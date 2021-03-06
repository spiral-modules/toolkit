import sf, { IOptionToGrab, ISpiralFramework } from '@spiral-toolkit/core';
import { autobind } from '../autobind';
import { FILTER_TOGGLE_CLASS_NAME } from '../constants';
import type Datagrid from '../datagrid/Datagrid';

const { assert } = sf.helpers;

const BUTTON_CLASS = '.sf-filter-toggle-button';
const PANEL_CLASS = '.sf-filter-toggle-panel';

export interface IFilterToggleOptions {
  id: string;
  trackFields?: string[];
}

export class FilterToggle<Item = any> extends sf.core.BaseDOMConstructor {
  static readonly spiralFrameworkName: string = 'datagrid-filter-wrapper';

  static readonly spiralFrameworkCss: string = FILTER_TOGGLE_CLASS_NAME;

  public readonly name = FilterToggle.spiralFrameworkName;

  static defaultOptions: IFilterToggleOptions = {
    id: '',
  };

  static registerInSf = () => {
    sf.registerInstanceType(FilterToggle, FilterToggle.spiralFrameworkCss);
  };

  el?: HTMLDivElement;

  toggleButton: HTMLElement;

  togglePanel: HTMLElement;

  toggleOptions: {
    emptyClass: string,
    fullClass: string,
    template: Function,
  } = {
    emptyClass: '',
    fullClass: '',
    template: sf.helpers.template.compile('<i class="fas fa-filter"></i>'),
  };

  panelOptions: {
    openClass: string,
    closedClass: string,
  } = {
    openClass: '',
    closedClass: 'd-none',
  };


  datagrid?: Datagrid;

  public readonly optionsToGrab: { [option: string]: IOptionToGrab } = {
    id: {
      value: FilterToggle.defaultOptions.id,
      domAttr: 'data-id',
    },
    trackFields: {
      value: FilterToggle.defaultOptions.trackFields,
      domAttr: 'data-track-fields',
      processor(node: Element, val: any) {
        if (val === undefined || val == null) return this.value;
        return val.split(',');
      },
    },
  };

  options: IFilterToggleOptions = { ...FilterToggle.defaultOptions };

  sf!: ISpiralFramework;

  state: {
    hasFilter: number,
    isOpen: boolean,
  } = {
    hasFilter: 0,
    isOpen: false,
  };

  constructor(ssf: ISpiralFramework, node: Element, options: IFilterToggleOptions) {
    super();
    this.init(ssf, node, options, FilterToggle.defaultOptions);

    this.toggleButton = node.querySelector(BUTTON_CLASS) as HTMLElement;
    assert.ok(this.toggleButton, 'Cant find button that toggles filter panel, ensure you have element with `sf-filter-toggle-button` class');

    this.togglePanel = node.querySelector(PANEL_CLASS) as HTMLElement;
    assert.ok(this.toggleButton, 'Cant find toggle panel, ensure you have element with `sf-filter-toggle-button` class');

    if (this.toggleButton.hasAttribute('data-class-emptyfilter')) {
      this.toggleOptions.emptyClass = this.toggleButton.getAttribute('data-class-emptyfilter') || '';
    }
    if (this.toggleButton.hasAttribute('data-class-hasfilter')) {
      this.toggleOptions.fullClass = this.toggleButton.getAttribute('data-class-hasfilter') || '';
    }
    if (this.toggleButton.hasAttribute('data-template')) {
      this.toggleOptions.template = sf.helpers.template.compile(this.toggleButton.getAttribute('data-template') || '');
    }

    if (this.togglePanel.hasAttribute('data-class-open')) {
      this.panelOptions.openClass = this.togglePanel.getAttribute('data-class-open') || '';
    }
    if (this.togglePanel.hasAttribute('data-class-closed')) {
      this.panelOptions.closedClass = this.togglePanel.getAttribute('data-class-closed') || '';
    }

    this.bind();
    this.update();
  }

  public update() {
    if (this.state.isOpen) {
      if (this.panelOptions.closedClass) {
        this.togglePanel.classList.remove(this.panelOptions.closedClass);
      }
      if (this.panelOptions.openClass) {
        this.togglePanel.classList.add(this.panelOptions.openClass);
      }
    } else {
      if (this.panelOptions.openClass) {
        this.togglePanel.classList.remove(this.panelOptions.openClass);
      }
      if (this.panelOptions.closedClass) {
        this.togglePanel.classList.add(this.panelOptions.closedClass);
      }
    }
    if (this.state.hasFilter) {
      if (this.toggleOptions.emptyClass) {
        this.toggleButton.classList.remove(this.toggleOptions.emptyClass);
      }
      if (this.toggleOptions.fullClass) {
        this.toggleButton.classList.add(this.toggleOptions.fullClass);
      }
    } else {
      if (this.toggleOptions.fullClass) {
        this.toggleButton.classList.remove(this.toggleOptions.fullClass);
      }
      if (this.toggleOptions.emptyClass) {
        this.toggleButton.classList.add(this.toggleOptions.emptyClass);
      }
    }
    if (this.toggleOptions.template) {
      if (this.options.trackFields) {
        this.toggleButton.innerHTML = this.toggleOptions.template({
          isEmpty: !this.state.hasFilter,
          changes: this.state.hasFilter,
        });
      } else {
        this.toggleButton.innerHTML = this.toggleOptions.template({
          isEmpty: !this.state.hasFilter,
          changes: '*',
        });
      }
    }
  }

  public bind() {
    document.addEventListener('click', this.toggleClick, { capture: true });
    this.node.addEventListener('submit', this.onForm);
    this.node.addEventListener('reset', this.onForm);
  }

  public die() {
    super.die();
    document.removeEventListener('click', this.toggleClick);
    this.node.addEventListener('submit', this.onForm);
    this.node.addEventListener('reset', this.onForm);
  }

  @autobind
  public onForm() {
    this.closePanel();
  }

  @autobind
  public toggleClick(e: Event) {
    const node = e.target as Element;
    const isInBody: boolean = document.body.contains(node);
    const isInsidePanel: boolean = !!sf.helpers.domTools.closest(node, PANEL_CLASS);
    const isInsideAbsoluteElement: boolean = !!sf.helpers.domTools.closest(node, (n: Element) => window.getComputedStyle(n).position === 'absolute');
    const isInsideButton: boolean = node === this.toggleButton || !!sf.helpers.domTools.closest(node, BUTTON_CLASS);
    if (this.state.isOpen) {
      if (isInBody && !isInsidePanel && !isInsideAbsoluteElement) {
        this.closePanel();
      }
    } else if (isInsideButton) {
      this.openPanel();
    }
  }

  public closePanel() {
    this.state.isOpen = false;
    this.update();
  }

  public openPanel() {
    this.state.isOpen = true;
    this.update();
  }

  setHasFilter(fields: Set<string>) {
    // console.log(fields, this.options.trackFields);
    if (!this.options.trackFields) {
      this.state.hasFilter = fields.size;
    } else {
      this.state.hasFilter = 0;
      this.options.trackFields.forEach((f) => {
        if (fields.has(f)) {
          // eslint-disable-next-line no-plusplus
          this.state.hasFilter++;
        }
      });
      // console.log(this.state.hasFilter);
    }
    this.update();
  }
}

export default FilterToggle;
