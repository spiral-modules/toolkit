import sf from '@spiral-toolkit/core';
import get from 'lodash.get';
import ActionPanel from '../actionpanel/ActionPanel';
import {
  DATAGRID_CHECK_SELECT_ALL_ATTR,
  DATAGRID_CHECK_SELECT_ATTR, defaultGridMessages,
  SelectionType,
} from '../constants';
import type { Datagrid } from '../datagrid/Datagrid';
import { DatagridState } from '../datagrid/DatagridState';
import { Messages } from '../messages';
import Paginator from '../paginator/Paginator';
import {
  IActionPanelOptions,
  ICellMeta, IGridRenderOptions, INormalizedColumnDescriptor, IRowMeta,
} from '../types';
import { addClasses, applyAttrributes, normalizeColumns } from '../utils';
import { bodyWrapper } from './table/bodyWrapper';
import { footerWrapper } from './table/footerWrapper';
import { headerWrapper } from './table/headerWrapper';
import { defaultGridUiOptions, renderer } from './table/renderer';
import { rowWrapper } from './table/rowWrapper';
import { tableWrapper } from './table/tableWrapper';
import { normalizedCellRenderer, normalizedHeaderCellRenderer } from './normalizers';

let instanceCounter = 1;

export class GridRenderer {
  // eslint-disable-next-line
  private instance = instanceCounter++;

  private wrapper!: Element;

  private tableEl!: Element;

  private headerEl?: { outer: Element, inner: Element };

  private footerEl?: Element;

  private bodyEl?: Element;

  private paginatorEl?: Element;

  private actionPanelEl?: Element;

  private columnInfo: INormalizedColumnDescriptor[];

  private options: IGridRenderOptions;

  private messages: Messages;

  constructor(partialOptions: Partial<IGridRenderOptions>, private root: Datagrid) {
    this.options = { ...renderer, ...partialOptions, ui: { ...defaultGridUiOptions, ...partialOptions.ui } };
    this.messages = new Messages((this.options.messages || {}) as any, defaultGridMessages as any);
    this.columnInfo = normalizeColumns(this.options.columns, this.options.sortable);
    this.create();
  }

  private create() {
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('role', 'sf-datagrid-wrapper');
    this.wrapper.setAttribute('class', this.options.ui.wrapperClassName || '');

    // this.root.node.innerHTML = '';
    this.root.node.appendChild(this.wrapper);

    if (this.options.actions) {
      this.createDefaultActions();
    }
    if (this.options.paginator) {
      this.createDefaultPaginator();
    }

    const tableRenderer = this.options.tableWrapper || tableWrapper;
    this.tableEl = tableRenderer(this.wrapper, this.options);
  }

  private createDefaultPaginator() {
    const id = `${Date.now()}${this.instance}`;
    this.root.options.captureForms.push(id);
    this.paginatorEl = document.createElement('div');
    this.root.node.appendChild(this.paginatorEl);
    const extension = (typeof this.options.paginator === 'boolean') ? {} : this.options.paginator;
    const options = {
      ...Paginator.defaultOptions,
      id,
      ...extension,
    };
    if (this.root.options.responsive) {
      if (this.options.renderAsList) {
        options.className += ` ${this.root.options.responsive.listClass}`;
      } else {
        options.className += ` ${this.root.options.responsive.tableClass}`;
      }
    }
    const paginator = new Paginator(sf, this.paginatorEl, options);
    this.root.registerPaginatorInstance(paginator, false);
  }

  private createDefaultActions() {
    const id = `${Date.now()}${this.instance}`;
    this.actionPanelEl = document.createElement('div');
    this.root.node.appendChild(this.actionPanelEl);
    if (!this.root.options.captureActionPanels) {
      this.root.options.captureActionPanels = [];
    }
    this.root.options.captureActionPanels.push(id);
    const options: IActionPanelOptions = {
      id,
      className: (state) => (state.hasSelection ? 'row no-gutters align-items-center px-3 py-2 border-bottom' : 'd-none'),
      lockType: 'none',
      noSelection: document.createElement('div'),
      actionClassName: 'btn btn-sm',
      selectionType: this.options.selectable?.type || SelectionType.SINGLE,
      actions: this.options.actions!,
    };
    if (this.root.options.responsive) {
      if (this.options.renderAsList) {
        options.className = (state) => (state.hasSelection
          ? `row no-gutters align-items-center px-3 py-2 border-bottom ${this.root.options.responsive?.listClass}` : 'd-none');
      } else {
        options.className = (state) => (state.hasSelection
          ? `row no-gutters align-items-center px-3 py-2 border-bottom ${this.root.options.responsive?.tableClass}` : 'd-none');
      }
    }
    const panel = new ActionPanel(sf, this.actionPanelEl, options);
    this.root.registerActionPanelInstance(panel);
  }


  // eslint-disable-next-line class-methods-use-this
  private applyAdditionalCellAttributes(el: Element, column: INormalizedColumnDescriptor, options: IGridRenderOptions, state: DatagridState, index: number) {
    const cellMeta: ICellMeta = {
      id: column.id,
      column,
      index,
      rowSelected: options.selectable ? state.isSelected(state.data[index][options.selectable.id]) : false,
      state,
      item: state.data[index],
    };

    if (options.ui.cellClassName) {
      if (typeof options.ui.cellClassName === 'function') {
        addClasses(el, options.ui.cellClassName(cellMeta));
      } else {
        const specific = options.ui.cellClassName[column.id];
        if (specific) {
          if (typeof specific === 'string') {
            addClasses(el, specific);
          } else {
            addClasses(el, specific(cellMeta));
          }
        }
      }
    }
    if (options.ui.cellAttributes) {
      if (typeof options.ui.cellAttributes === 'function') {
        applyAttrributes(el, options.ui.cellAttributes(cellMeta));
      } else {
        const specific = options.ui.cellAttributes[column.id];
        if (specific) {
          if (typeof specific === 'function') {
            applyAttrributes(el, specific(cellMeta));
          } else {
            applyAttrributes(el, specific);
          }
        }
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private applyAdditionalRowAttributes(el: Element, options: IGridRenderOptions, state: DatagridState, index: number) {
    const item = state.data[index];
    const rowMeta: IRowMeta = {
      index,
      item,
      selected: this.options.selectable ? state.isSelected(item[this.options.selectable.id]) : false,
      state,
      id: this.options.selectable ? item[this.options.selectable.id] : undefined,
    };
    if (this.options.ui.rowClassName) {
      if (typeof this.options.ui.rowClassName === 'string') {
        addClasses(el, this.options.ui.rowClassName);
      } else {
        addClasses(el, this.options.ui.rowClassName(rowMeta));
      }
    }
    if (options.ui.rowAttributes) {
      if (typeof options.ui.rowAttributes === 'function') {
        applyAttrributes(el, options.ui.rowAttributes(rowMeta));
      } else {
        const specific = options.ui.rowAttributes;
        applyAttrributes(el, specific);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private applyAdditionalHeaderCellAttributes(el: Element, column: INormalizedColumnDescriptor, options: IGridRenderOptions, state: DatagridState) {
    const cellMeta = {
      id: column.id,
      column,
      index: 0,
      rowSelected: options.selectable ? state.areAllSelected() : false,
      state,
      item: null,
    };

    if (options.ui.headerCellClassName) {
      if (typeof options.ui.headerCellClassName === 'function') {
        addClasses(el, options.ui.headerCellClassName(cellMeta));
      } else {
        const specific = options.ui.headerCellClassName[column.id];
        if (specific) {
          if (typeof specific === 'string') {
            addClasses(el, specific);
          } else {
            addClasses(el, specific(cellMeta));
          }
        }
      }
    }
    if (options.ui.headerCellAttributes) {
      if (typeof options.ui.headerCellAttributes === 'function') {
        applyAttrributes(el, options.ui.headerCellAttributes(cellMeta));
      } else {
        const specific = options.ui.headerCellAttributes[column.id];
        if (specific) {
          if (typeof specific === 'function') {
            applyAttrributes(el, specific(cellMeta));
          } else {
            applyAttrributes(el, specific);
          }
        }
      }
    }
  }

  render(state: DatagridState) {
    // Render header
    const headerRenderer = this.options.headerWrapper || headerWrapper;
    if (this.headerEl) {
      this.tableEl.removeChild(this.headerEl.outer);
    }
    this.headerEl = headerRenderer(this.tableEl, this.options, state, this.messages, this.columnInfo);
    if (this.headerEl) {
      if (this.columnInfo.length) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.columnInfo.forEach((cI, index) => {
          const headerCellRenderer = normalizedHeaderCellRenderer((this.options.headerList || {})[cI.id], !!this.options.renderAsList);
          const node = headerCellRenderer.createEl(cI, this.options);
          if (node) {
            const { container, el } = node;
            const rendered = headerCellRenderer.render(cI, this.options, state);
            if (typeof rendered !== 'undefined' && rendered !== null) {
              if (typeof rendered === 'string') {
                el.innerHTML = rendered;
              } else {
                el.appendChild(rendered);
              }
              this.applyAdditionalHeaderCellAttributes(container, cI, this.options, state);
              this.headerEl!.inner.appendChild(container);
            }
          }
        });
      }
    }

    // Render body
    if (this.bodyEl) {
      this.tableEl.removeChild(this.bodyEl);
    }
    const bodyRenderer = this.options.bodyWrapper || bodyWrapper;
    this.bodyEl = bodyRenderer(this.tableEl, this.options, state, this.messages);
    if (this.bodyEl) {
      this.tableEl.appendChild(this.bodyEl);
      const row = this.options.rowWrapper || rowWrapper;
      state.data.forEach((item: any, index) => {
        const rowEl = row(this.bodyEl!, this.options, state, index, this.columnInfo);
        this.applyAdditionalRowAttributes(rowEl, this.options, state, index);
        this.columnInfo.forEach((cI) => {
          const value = get(item, cI.id);
          const rowCellRenderer = normalizedCellRenderer((this.options.cells || {})[cI.id], !!this.options.renderAsList);
          const node = rowCellRenderer.createEl(cI, this.options);
          if (node) { // If no node generated, skip it, that might be custom tr render or colspan
            const { container, el } = node;
            const rendered = rowCellRenderer.render(value, item, cI, this.options, index, state);
            if (typeof rendered !== 'undefined' && rendered !== null) { // If no content generated, skip it, that might be custom tr render or colspan
              if (typeof rendered === 'string') {
                el.innerHTML = rendered;
              } else {
                el.appendChild(rendered);
              }
              this.applyAdditionalCellAttributes(container, cI, this.options, state, index);
              rowEl.appendChild(container);
            }
          }
        });
      });
    }

    // Render footer
    if (this.footerEl) {
      this.tableEl.removeChild(this.footerEl);
    }
    const footerRenderer = this.options.footerWrapper || footerWrapper;
    this.footerEl = footerRenderer(this.tableEl, this.options, state, this.messages);
    if (this.footerEl) {
      this.tableEl.appendChild(this.footerEl);
      // We assume footer render handles all data so no additional renders here
    }
  }

  updateCheckboxes(state: DatagridState) {
    if (this.root.options.selectable) {
      const headerEl: HTMLInputElement | null | undefined = this.headerEl?.outer.querySelector(`input[${DATAGRID_CHECK_SELECT_ALL_ATTR}]`);
      if (headerEl) {
        headerEl.checked = state.areAllSelected();
      }
      const checkboxes = this.bodyEl?.querySelectorAll(`input[${DATAGRID_CHECK_SELECT_ATTR}]`);
      if (checkboxes) {
        checkboxes.forEach((checkbox: Element) => {
          const el = (checkbox as HTMLInputElement);
          el.checked = state.isSelected(el.value);
        });
      }
    }
  }
}
