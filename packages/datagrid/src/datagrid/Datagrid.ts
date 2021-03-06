import sf, { IOptionToGrab, ISFInstance, ISpiralFramework } from '@spiral-toolkit/core';
import { listRenderers } from '../render/list';
import ActionPanel from '../actionpanel/ActionPanel';
import {
  DATAGRID_CLASS_NAME,
  DEFAULT_LIMIT, pageParams, RequestMethod, SelectionType, SortDirection, sortParams,
} from '../constants';
import FilterToggle from '../filter-toggle/FilterToggle';
import { DatagridState } from './DatagridState';
import Paginator from '../paginator/Paginator';
import { defaultGridOptions } from '../render/table/renderer';
import { GridRenderer } from '../render/GridRenderer';
import {
  IColumnDescriptor,
  IDatagridErrorResponse,
  IDataGridOptions,
  IDatagridRequest,
  IDatagridResponse,
  IGridRenderOptions,
  INormalizedColumnDescriptor,
  IPaginatorParams,
} from '../types';
import { normalizeColumns } from '../utils';

const { assert } = sf.helpers;
const { makeUrl } = sf.tools;
const { parse, stringifyUrl } = sf.helpers.queryString;

export class Datagrid<Item = any> extends sf.core.BaseDOMConstructor {
  static readonly spiralFrameworkName: string = 'datagrid';

  static readonly spiralFrameworkCss: string = DATAGRID_CLASS_NAME;

  public readonly name = Datagrid.spiralFrameworkName;

  static defaultOptions: IDataGridOptions = defaultGridOptions;

  static registerInSf = () => {
    sf.registerInstanceType(Datagrid, Datagrid.spiralFrameworkCss);
  };

  public readonly optionsToGrab: { [option: string]: IOptionToGrab } = {
    id: {
      value: Datagrid.defaultOptions.id,
      domAttr: 'id',
    },
    url: {
      value: Datagrid.defaultOptions.url,
      domAttr: 'data-url',
    },
  };

  public readonly options: IDataGridOptions<Item> = { ...Datagrid.defaultOptions };

  public readonly sf!: ISpiralFramework;

  public readonly node!: Element;

  grids: GridRenderer[] = [];

  state: DatagridState<Item> = new DatagridState<Item>(this);

  capturedForms: { [id: string]: { instance: any, fields: Array<string> } } = {}; // TODO: type as sf.Form instance array

  capturedPaginators: Array<Paginator> = [];

  capturedActionPanels: Array<ActionPanel> = [];

  capturedFilters: Array<FilterToggle> = [];

  private defaults: IPaginatorParams & { sortBy?: string, sortDir?: SortDirection } = {
    page: 1, // TODO: different defaults depending on paginator type
    limit: DEFAULT_LIMIT,
  };

  private columnInfo: INormalizedColumnDescriptor[];

  constructor(ssf: ISpiralFramework, node: Element, options: IDataGridOptions<Item>) {
    super();
    this.init(ssf, node, options, Datagrid.defaultOptions);
    assert.notEqual(this.options.id, '', 'id should be not empty');
    assert.notEqual(this.options.url, '', 'url should be not empty');

    // Process options
    this.applyExperimentalResponsive();

    // TODO: we can override columns and sort options inside renderers but it might produce situation of triggering unexisting sort
    // Think about that, or ignore
    this.columnInfo = normalizeColumns(this.options.columns, this.options.sortable);

    if (this.options.paginator && this.options.paginator !== true) {
      // Pass default limit from integrated paginator everywhere
      this.defaults.limit = this.options.paginator.defaultLimit || DEFAULT_LIMIT;
      this.state.updatePaginator({ limit: this.defaults.limit });
    }
    // Set default sort if present
    if (this.options.sort) {
      if (typeof this.options.sort === 'string') {
        this.defaults.sortBy = this.options.sort;
        const col = this.columnInfo.find((cI) => cI.id === this.defaults.sortBy);
        this.defaults.sortDir = col ? col.direction : SortDirection.ASC;
      } else {
        this.defaults.sortBy = this.options.sort.field;
        const col = this.columnInfo.find((cI) => cI.id === this.defaults.sortBy);
        this.defaults.sortDir = col ? col.direction : SortDirection.ASC;
        this.defaults.sortDir = this.options.sort.direction || this.defaults.sortDir;
      }
      this.state.setSort(this.defaults.sortBy, this.defaults.sortDir);
    }

    this.createRenderers();
    this.initFromUrl();
    this.captureForms();
    this.setFilterStatuses();
    if (this.allFormsAttached() && !this.state.isLoading) {
      this.request();
    }
    this.bindReload();
  }

  private bindReload() {
    this.reload = this.reload.bind(this);
    document.addEventListener('datagrid:refresh', this.reload);
  }

  private unbindReload() {
    document.removeEventListener('datagrid:refresh', this.reload);
  }

  private reload(e: Event) {
    const event = e as CustomEvent;
    if (event && event.detail && event.detail.gridId === this.options.id) {
      if (this.allFormsAttached() && !this.state.isLoading) {
        this.request();
      }
    }
  }

  private registerFormInstance(formInstance: any) {
    if (formInstance.options
      && formInstance.options.id
      && this.options.captureForms.indexOf(formInstance.options.url) >= 0) {
      // console.log('Regging', this.options.id, formInstance.options.url);
      const { id } = formInstance.options;
      const fields = formInstance.enumerateFieldNames();

      this.capturedForms[id] = {
        instance: formInstance,
        fields,
      };

      // eslint-disable-next-line
      formInstance.options.jsonOnly = true;
      let data = {};
      if (formInstance.getFormData) {
        // Capture default form data
        data = formInstance.getFormData();
        this.state.mergeDefaultData(data);
        this.state.setFormData(id, data);
      }
      // eslint-disable-next-line
      formInstance.options.beforeSubmitCallback = (options: any) => {
        this.resetPaginator();
        this.applyFormChange(id, options.data);
        this.request();
        return false;
      };

      const urlDataForForm: { [key: string]: any } | undefined = this.state.urlData
        ? Object.keys(this.state.urlData)
          .filter((key) => fields.indexOf(key) >= 0)
          .reduce((map, key) => ({
            ...map,
            [key]: this.state.urlData[key],
          }), {})
        : undefined;

      if (urlDataForForm) {
        const formSpecificData = Object.keys(urlDataForForm)
          .filter((k) => fields.indexOf(k) >= 0)
          .reduce((map, key) => ({ ...map, [key]: urlDataForForm[key] }), {});
        formInstance.setFieldValues(formSpecificData);
        this.state.setFormData(id, { ...data, ...formSpecificData });
      }

      this.options.captureForms = this.options.captureForms.filter((f) => f !== formInstance.options.url);
      this.request();
    }
  }

  public registerPaginatorInstance(formInstance: any, doRequest: boolean = true) {
    if (formInstance.options && formInstance.options.id && this.options.captureForms.indexOf(formInstance.options.id) >= 0) {
      this.capturedPaginators.push(formInstance);
      // eslint-disable-next-line
      formInstance.options.willFetchCount = this.options.fetchCount;
      // eslint-disable-next-line
      formInstance.options.onPageChange = (options: IPaginatorParams) => {
        this.state.updatePaginator(options);
        this.request();
        return false;
      };

      this.options.captureForms = this.options.captureForms.filter((f) => f !== formInstance.options.id);
      if (doRequest) { this.request(); }
    }
  }

  public registerActionPanelInstance(formInstance: any) {
    if (formInstance.options
      && formInstance.options.id
      && this.options.captureActionPanels
      && this.options.captureActionPanels.indexOf(formInstance.options.id) >= 0) {
      this.capturedActionPanels.push(formInstance);
      if (this.options.selectable) {
        (formInstance as ActionPanel).reconfigure({ selectionType: this.options.selectable!.type }, this);
        (formInstance as ActionPanel).setSelection(this.state.selection, this.state.selectedItems);
      }
    }
  }

  public registerFilterToggleInstance(formInstance: any) {
    if (formInstance.options
      && formInstance.options.id
      && this.options.captureFilters
      && this.options.captureFilters.indexOf(formInstance.options.id) >= 0) {
      this.capturedFilters.push(formInstance);
      formInstance.setHasFilter(this.state.listCustomFields);
    }
  }

  captureForms() {
    const forms = this.sf.getInstances('form') || [];
    forms.forEach((f: { instance: ISFInstance }) => {
      this.registerFormInstance(f.instance);
    });

    const paginators = this.sf.getInstances(Paginator.spiralFrameworkName) || [];
    paginators.forEach((f: { instance: ISFInstance }) => {
      this.registerPaginatorInstance(f.instance);
    });

    const actionPanels = this.sf.getInstances(ActionPanel.spiralFrameworkName) || [];
    actionPanels.forEach((f: { instance: ISFInstance }) => {
      this.registerActionPanelInstance(f.instance);
    });

    const filters = this.sf.getInstances(FilterToggle.spiralFrameworkName) || [];
    filters.forEach((f: { instance: ISFInstance }) => {
      this.registerFilterToggleInstance(f.instance);
    });

    this.sf.instancesController.events.on('onAddInstance', ({ instance, type }: { instance: any, type: string }) => {
      if (type === 'form') {
        this.registerFormInstance(instance);
      }
      if (type === Paginator.spiralFrameworkName) {
        this.registerPaginatorInstance(instance);
      }
      if (type === ActionPanel.spiralFrameworkName) {
        this.registerActionPanelInstance(instance);
      }
      if (type === FilterToggle.spiralFrameworkName) {
        this.registerFilterToggleInstance(instance);
      }
    });
  }

  /**
   * Sets sort for this field if not yet, or changes direction if already same
   * @param fieldId
   */
  triggerSort(fieldId: string) {
    if (this.state.sortBy === fieldId) {
      if (this.state.sortDir === SortDirection.ASC) {
        this.state.setSort(fieldId, SortDirection.DESC);
      } else {
        this.state.setSort(fieldId, SortDirection.ASC);
      }
    } else {
      const field = this.columnInfo.find((cI) => cI.id === fieldId);
      if (field) {
        this.state.setSort(field.id, field.direction);
      } else {
        console.warn(`Trying to sort by unsortable field ${fieldId}`);
      }
    }
    this.resetPaginator();
    this.request();
  }

  private setAllPaginators(p: IPaginatorParams & { error?: boolean }) {
    this.capturedPaginators.forEach((f) => {
      if (f.setParams) {
        f.setParams(p, this.usePrefix() ? this.getPrefix() : this.options.serialize);
      }
    });
  }

  private resetPaginator() {
    // TODO: depending on paginator type perform different reset type
    this.state.resetFetchCount();
    this.state.updatePaginator({ page: 1 });
    this.setAllPaginators(this.state.paginate);
  }

  private formRequest() {
    const { error, count, ...rest } = this.state.paginate;
    const request: IDatagridRequest = {
      fetchCount: this.state.needFetchCount,
      filter: this.state.getFilter(),
      paginate: rest,
      sort: this.state.sortBy ? { [this.state.sortBy]: this.state.sortDir } : {},
    };

    return request;
  }

  private unlock() {
    if (!this.sf.removeInstance('lock', this.node)) {
      console.warn('You try to remove \'lock\' instance, but it is not available or not started');
    }
    Object.keys(this.capturedForms).forEach((fKey) => {
      const f = this.capturedForms[fKey].instance;
      if (f.unlock) {
        f.unlock();
      }
    });
    this.capturedPaginators.forEach((f) => {
      if (f.unlock) {
        f.unlock();
      }
    });
  }

  private lock() {
    if (!this.options.lockType || this.options.lockType === 'none') {
      return;
    }
    const lock = this.sf.addInstance('lock', this.node, { type: this.options.lockType });
    if (!lock) {
      console.warn('You try to add \'lock\' instance, but it is not available or already started');
      return;
    }
    Object.keys(this.capturedForms).forEach((fKey) => {
      const f = this.capturedForms[fKey].instance;
      if (f.lock) {
        f.lock();
      }
    });
    this.capturedPaginators.forEach((f) => {
      if (f.lock) {
        f.lock();
      }
    });
  }

  private handleSuccess({ data }: { data: IDatagridResponse<Item> }) {
    this.state.setSuccess(data.data, data.pagination);
    if (typeof data.pagination.count !== 'undefined') {
      this.state.onCountFetched();
    }
    this.render();
    this.setAllPaginators({ ...this.state.paginate, error: false });
  }

  private beforeSubmit() {
    Object.keys(this.capturedForms).forEach((fKey) => {
      const f = this.capturedForms[fKey].instance;
      if (f.removeMessages) {
        f.removeMessages();
      }
    });
    this.capturedFilters.forEach((fToggle) => {
      fToggle.closePanel();
    });
    this.setFilterStatuses();
  }

  private setFilterStatuses() {
    this.capturedFilters.forEach((fToggle) => {
      fToggle.setHasFilter(this.state.listCustomFields);
    });
  }

  private handleError(response: { data: IDatagridErrorResponse, status: number, statusText: string }) {
    const { data, status, statusText } = this.processResponse(response);
    this.state.setError(data.error || 'Unknown Error', data.errors, this.options.resetOnError);
    Object.keys(this.capturedForms).forEach((fKey) => {
      const f = this.capturedForms[fKey].instance;
      if (f.processAnswer) {
        const id = f.options.url;
        const { error, ...rest } = data;
        const passError = (id === this.options.errorMessageTarget || this.options.errorMessageTarget === '@all');
        const filteredData = passError ? { ...data } : rest;
        f.processAnswer(passError ? { data: filteredData, status, statusText } : {
          data: { errors: {}, ...filteredData },
          status,
          statusText,
        }, false); // false stands for 'dont display errors unrelated to form inputs'
      }
    });
    this.setAllPaginators({ error: true });
    this.render();
  }

  async request() {
    if (!this.allFormsAttached()) {
      console.debug('Cant start new request, not all forms are yet attached', this.options.captureForms, this.options.id);
      return;
    }
    if (this.state.isLoading) {
      console.warn('Cant start new request, old one is running', this.options.id);
      return;
    }
    this.state.startLoading();
    this.beforeSubmit();
    this.lock();
    this.updateUrl();
    // console.log(this.state.isCustomSearch, this.getDefaults(), this.formRequest());
    const isGet = this.options.method.toUpperCase() === RequestMethod.GET;
    const data = this.formRequest();
    const rawFilter = data.filter;
    if (this.options.omitEmptyFilters && rawFilter) {
      Object.keys(rawFilter).forEach((k) => {
        if (rawFilter[k] === '' || rawFilter[k] === null || rawFilter[k] === undefined) {
          delete rawFilter[k];
        }
      });
      data.filter = rawFilter;
    }
    const request = this.sf.ajax.send<IDatagridResponse>({
      url: isGet ? makeUrl(this.options.url, data) : this.options.url, // TODO: need to verify GET api is same
      method: this.options.method,
      headers: this.options.headers,
      data: isGet ? undefined : data,
    });
    try {
      const response: { data: IDatagridResponse } = this.processResponse(await request);
      this.handleSuccess(response);
    } catch (e) {
      if (e.isSFAjaxError) {
        this.handleError(e);
      } else {
        this.handleError({
          data: {
            error: e.toString(),
            originalError: e,
          },
          status: 1000,
          statusText: e.toString(),
        });
      }
    } finally {
      this.unlock();
      this.state.stopLoading();
    }
  }

  applyExperimentalResponsive() {
    if (this.options.responsive && this.options.responsive.listSummaryColumn) {
      const {
        tableClass, listClass, listSummaryColumn, listExcludeColumns, tableExcludeColumns
      } = this.options.responsive;
      const renderList: IGridRenderOptions[] = Array.isArray(this.options.renderers) ? this.options.renderers : [this.options.renderers];
      if (renderList.length === 1) {
        const tableOptions = { ...renderList[0] };
        const listOptions = { ...renderList[0] };

        tableOptions.ui = tableOptions.ui || {};
        tableOptions.ui.tableClassName = tableOptions.ui.tableClassName ? (`${tableOptions.ui.tableClassName} ${tableClass}`) : tableClass;

        listOptions.ui = listOptions.ui || {};
        listOptions.ui.tableClassName = listOptions.ui.tableClassName ? (`${listOptions.ui.tableClassName} ${listClass}`) : listClass;

        tableOptions.columns = (tableOptions.columns || this.options.columns).filter(
          (c: IColumnDescriptor) => {
            if (typeof c === 'string') {
              return c !== listSummaryColumn;
            }
            return c.id !== listSummaryColumn;
          },
        );

        listOptions.tableWrapper = listRenderers.tableWrapper;
        listOptions.bodyWrapper = listRenderers.bodyWrapper;
        listOptions.footerWrapper = listRenderers.footerWrapper;
        listOptions.rowWrapper = listRenderers.rowWrapper;
        listOptions.headerWrapper = listRenderers.headerWrapper;
        listOptions.renderAsList = {
          summaryColumn: listSummaryColumn,
        };
        listOptions.exclude = listExcludeColumns;
        tableOptions.exclude = tableExcludeColumns;
        this.options.renderers = [tableOptions, listOptions];
      }
    }
  }

  createRenderers() {
    assert.deepEqual(this.grids, [], 'Grids are already initialized');
    const renderList: IGridRenderOptions[] = Array.isArray(this.options.renderers) ? this.options.renderers : [this.options.renderers];
    renderList.forEach((renderOption: IGridRenderOptions) => {
      this.grids.push(new GridRenderer({
        ...renderOption,
        ui: { ...this.options.ui, ...renderOption.ui },
        columns: (renderOption.columns && renderOption.columns.length) ? renderOption.columns : this.options.columns,
        sortable: (renderOption.sortable && renderOption.sortable.length) ? renderOption.sortable : this.options.sortable,
        paginator: typeof renderOption.paginator === 'undefined' ? this.options.paginator : renderOption.paginator,
        dontRenderError: !!this.options.errorMessageTarget && this.options.errorMessageTarget !== '@self',
        selectable: renderOption.selectable || this.options.selectable,
        messages: { ...this.options.messages, ...renderOption.messages },
      }, this));
    });
  }

  render() {
    this.grids.forEach((grid) => {
      grid.render(this.state);
    });
  }

  private updateCheckboxes() {
    this.grids.forEach((grid) => {
      grid.updateCheckboxes(this.state);
    });
    this.capturedActionPanels.forEach((a: ActionPanel) => {
      a.setSelection(this.state.selection, this.state.selectedItems);
    });
  }

  public toggleSelectionAll(checked: boolean) {
    if (this.options.selectable) {
      if (checked) {
        this.state.selectAll();
      } else {
        this.state.resetSelection();
      }
    }
    this.updateCheckboxes();
  }

  public resetSelectionAndReload() {
    this.state.resetSelection();
    this.updateCheckboxes();
    this.request();
  }

  public toggleSelection(value: string, checked: boolean) {
    if (this.options.selectable) {
      if (this.options.selectable.type === SelectionType.MULTIPLE) {
        if (checked) {
          this.state.addToSelection(value);
        } else {
          this.state.removeFromSelection(value);
        }
      } else if (checked) {
        this.state.selectSingle(value);
      }
    }
    this.updateCheckboxes();
  }

  private serialize() {
    const custom = this.state.getFilter();
    const pagination = Object.keys(this.state.paginate)
      .filter((k) => pageParams.indexOf(k) >= 0)
      .reduce((map: any, key) => ({
        ...map,
        [key]: (this.state.paginate as any)[key],
      }), {});
    const sortOptions = this.state.sortBy ? { sortBy: this.state.sortBy, sortDir: this.state.sortDir } : {};

    return {
      ...custom,
      ...pagination,
      ...sortOptions,
    };
  }

  private deserialize(values: { [value: string]: string }) {
    const {
      page, limit, cid, lid,
      ...rest
    } = values;
    const paginatorUpdate: { page?: number, limit?: number, cid?: string, lid?: string } = {
      page: this.defaults.page,
      limit: this.defaults.limit,
    };

    if (page) {
      paginatorUpdate.page = +page;
    }
    if (limit) {
      paginatorUpdate.limit = +limit;
    }
    if (cid) {
      paginatorUpdate.cid = cid;
    }
    if (lid) {
      paginatorUpdate.lid = lid;
    }

    this.state.updatePaginator(paginatorUpdate);

    const { sortBy, sortDir, ...rest2 } = rest;
    const sortField = sortBy || this.defaults.sortBy;
    const sortFDir = sortDir || this.defaults.sortDir;
    if (sortField && sortDir) {
      this.state.setSort(sortField, sortFDir as any);
    }

    [...pageParams, ...sortParams].forEach((p) => delete rest2[p]);
    this.state.urlData = rest2;
  }

  private usePrefix() {
    return this.options.serialize && this.options.namespace;
  }

  private getPrefix() {
    return this.usePrefix() ? (`${this.options.namespace || ''}-`) : '';
  }

  private initFromUrl() {
    if (this.options.serialize) {
      if (window.location.search) {
        const urlData = this.getObjectFromUrl(this.getDefaults(), this.getPrefix());
        if (Object.keys(urlData).length) {
          this.deserialize(urlData);
        }
      }
    }
  }

  private updateUrl() {
    if (this.options.serialize) {
      const data = this.serialize();
      this.putObjectToUrl(data, this.getDefaults(), this.getPrefix());
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getObjectFromUrl(defaults: any, prefix = '') {
    const obj = parse(window.location.search, { parseNumbers: true, parseBooleans: true });
    const result = Object.keys(obj).reduce((map, oK) => {
      if (!prefix || oK.indexOf(prefix) === 0) {
        return {
          ...map,
          [oK.substr(prefix.length)]: (typeof obj[oK] !== 'undefined') ? obj[oK] : defaults[oK.substr(prefix.length)],
        };
      }
      return map;
    }, {});
    return result;
  }

  private putObjectToUrl(obj1: any, defaults: any, prefix = '') {
    if (!window.history) {
      console.warn('Cant update URL without reload, skipping');
      return;
    }
    const queryRaw = Object.keys(obj1).reduce((map, oK) => {
      // eslint-disable-next-line eqeqeq
      if (obj1[oK] && obj1[oK] != defaults[oK]) {
        return { ...map, [`${prefix}${oK}`]: obj1[oK] };
      }
      return map;
    }, {});
    let obj2 = parse(window.location.search, { parseNumbers: true, parseBooleans: true });
    if (this.usePrefix()) {
      Object.keys(obj2).forEach((k: string) => { // Remove params belonging to this table
        if (k.indexOf(this.getPrefix()) === 0) {
          delete obj2[k];
        }
      });
    } else {
      obj2 = {}; // If table is not using prefixes, all params are that table params
    }
    const query = { ...obj2, ...queryRaw };
    window.history.pushState({}, document.title, stringifyUrl({
      url: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
      query,
    }));
  }

  private getDefaults() {
    return {
      ...this.defaults,
      ...this.state.defaultData,
    };
  }

  private allFormsAttached() {
    return this.options.captureForms.length === 0;
  }

  private applyFormChange(id: string, data: any) {
    this.capturedForms[id].fields = [...new Set([...Object.keys(data), ...this.capturedForms[id].fields])]; // Merge new fields if any
    this.state.setFormData(id, data); // set data for specific form
    Object.keys(this.capturedForms).filter((formId) => formId !== id).forEach((formId) => {
      const formInstance = this.capturedForms[formId];
      const { fields } = formInstance;
      const formSpecificData = Object.keys(data).filter((k) => fields.indexOf(k) >= 0).reduce((map, key) => ({
        ...map,
        [key]: data[key],
      }), {});
      formInstance.instance.setFieldValues(formSpecificData);
    });
  }

  private processResponse(axiosResponse: any) {
    if (this.options.responseProcessor) {
      return this.options.responseProcessor(axiosResponse);
    }
    if (this.options.dataField) {
      const key = this.options.dataField;
      if (axiosResponse.data && axiosResponse.data[key]) {
        // A success answer it seems, put
        return {
          ...axiosResponse,
          data: {
            ...axiosResponse.data,
            data: axiosResponse.data[key],
          },
        };
      }
    }
    return axiosResponse;
  }

  die() {
    super.die();
    this.unbindReload();
  }
}

export default Datagrid;
