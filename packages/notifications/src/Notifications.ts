import sf, { IOptionToGrab, ISpiralFramework } from '@spiral-toolkit/core';
import { SFSocket } from '@spiralscout/websockets';
import { EVENT_NAME } from './constants';
import { toastTemplate } from './item';
import {
  INCenterOptions, INCenterUiElements, INotification, INotificationEvent,
} from './types';

export function isNotificationEvent(e: any): e is INotificationEvent {
  if (e.type !== EVENT_NAME || !e.data) {
    return false;
  }
  if (e.data.title && e.data.id && e.data.body) {
    return true;
  }
  return false;
}

export class Notifications extends sf.core.BaseDOMConstructor {
  static readonly spiralFrameworkName: string = 'notifications';

  static readonly spiralFrameworkCssName: string = 'js-sf-notifications-dyn';

  static readonly defaultOptions: INCenterOptions = {
    drawer: {
      container: '.js-sf-notifications',
      body: '.js-sf-notifications-body',
      counter: '.js-sf-notifications-count',
      mask: '.js-sf-notifications-mask',
      btn: '.js-sf-notifications-button',
    },
    header: {
      toggle: '.js-sf-notifications-toggle',
      counter: '.js-sf-notifications-counter',
    },
    api: {
      getList: '/api/notifications',
      setAsRead: '/api/notifications/read',
    },
    ws: false,
  };

  public ui: INCenterUiElements;

  public options: INCenterOptions = { ...Notifications.defaultOptions };

  public readonly name = Notifications.spiralFrameworkName;

  public readonly optionsToGrab: { [option: string]: IOptionToGrab } = {};

  public ws?: SFSocket;

  private data: Array<INotification> = [];

  private unreadCount: number = 0;

  private selected: Set<string> = new Set<string>();

  private toastTemplate: (item: INotification) => string;


  constructor(ssf: ISpiralFramework, node: Element, options: INCenterOptions) {
    super();
    this.init(ssf, node, options);
    this.options = {
      ...Notifications.defaultOptions,
      ...this.options,
    };
    this.toastTemplate = sf.helpers.template.compile(toastTemplate);
    this.ui = {
      drawer: {
        body: document.querySelector(this.options.drawer.body) as HTMLElement,
        container: document.querySelector(this.options.drawer.container) as HTMLElement,
        counter: document.querySelector(this.options.drawer.counter) as HTMLElement,
        mask: document.querySelector(this.options.drawer.mask) as HTMLElement,
        btn: document.querySelector(this.options.drawer.btn) as HTMLElement,
      },
      header: {
        counter: document.querySelector(this.options.header.counter) as HTMLElement,
        toggle: document.querySelector(this.options.header.toggle) as HTMLElement,
      },
    };
    this.initWs();
    this.bindEvents();
    this.reload();
  }

  toggleDrawer() {
    this.ui.drawer.container.classList.toggle('drawer-open');
  }

  bindEvents() {
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.markSelection = this.markSelection.bind(this);
    this.ui.header.toggle.addEventListener('click', this.toggleDrawer);
    this.ui.drawer.mask.addEventListener('click', this.toggleDrawer);
    this.ui.drawer.btn.addEventListener('click', this.markSelection);
  }

  unbindEvents() {
    this.ui.header.toggle.removeEventListener('click', this.toggleDrawer);
  }

  calcSelected() {
    [...this.selected.values()].forEach((v) => {
      if (!this.data.find((n) => n.id === v)) {
        this.selected.delete(v);
      }
    });
  }

  updateButton() {
    let text = 'Mark All As Read';
    if (this.selected.size && this.selected.size < this.data.length) {
      text = `Mark ${this.selected.size} As Read`;
    }
    this.ui.drawer.btn.innerHTML = text;
  }

  initWs() {
    if (this.options.ws) {
      if (typeof (this.options.ws) === 'string') {
        this.ws = (window as any)[this.options.ws] as SFSocket;
      } else {
        this.ws = new SFSocket(this.options.ws);
      }
      if (this.ws) {
        this.ws.subscribe('message' as any, (event) => {
          try {
            const e = JSON.parse(event.data || '');
            if (isNotificationEvent(e)) {
              const { data } = e;
              this.onNotification(data);
            }
            // eslint-disable-next-line no-empty
          } catch (ex) {
          }
        });
      }
    }
  }

  onNotification(n: INotification) {
    const existing = this.data.findIndex((val) => val.id === n.id);
    if (n.icon) {
      // eslint-disable-next-line no-param-reassign
      n.title = `<i class="fas fa-${n.icon}"></i>&nbsp;${n.title}`;
    }
    if (existing >= 0) {
      this.data[existing] = n;
    } else {
      this.data = [n, ...this.data].sort((val) => (val.date || 0));
    }
    this.unreadCount = this.data.filter((v) => !v.read).length;
    this.calcSelected();

    const event = new CustomEvent('sf:notification-show', {
      bubbles: true,
      detail: {
        message: `<div>${n.title}&nbsp;&nbsp;<small class="float-right">${this.date(n.date)}</small><hr class="mx-0 my-1"/>${n.body}</div>`,
        type: 'primary',
        position: 'tr',
        timeout: 2000,
        onClick: this.toggleDrawer,
      },
    });
    document.dispatchEvent(event);

    this.render();
  }

  reload() {
    sf.ajax.send({
      method: 'GET',
      url: this.options.api.getList,
    }).then((axResp) => {
      const { data } = axResp;
      this.handleResponse(data);
    });
  }

  handleResponse(data: any) {
    this.unreadCount = data.unreadCount || this.unreadCount;
    this.data = data.data || this.data;
    this.calcSelected();
    this.render();
  }

  // eslint-disable-next-line class-methods-use-this
  date(n: number) {
    return n ? sf.helpers.luxon.DateTime.fromJSDate(new Date(n)).toFormat('HH:mm yyyy-MM-dd') : '';
  }

  renderNotitifation(not: INotification & { selected: boolean }) {
    const date = this.date(not.date);
    const item = this.toastTemplate({ ...not, date: date as any });
    const fr = document.createElement('div');
    fr.innerHTML = item;
    const el = fr.firstChild! as HTMLElement;
    this.bindToast(el, not);
    if (not.read) {
      el.classList.add('d-none');
    }
    return el;
  }

  render() {
    this.ui.header.counter.innerText = this.unreadCount.toString();
    this.ui.header.counter.classList.toggle('d-none', !this.unreadCount);
    this.ui.drawer.counter.innerText = this.unreadCount.toString();
    this.ui.drawer.counter.classList.toggle('d-none', !this.unreadCount);

    this.ui.drawer.body.innerHTML = '';
    this.data.forEach((not) => {
      const el = this.renderNotitifation({ ...not, selected: this.selected.has(not.id) });
      this.ui.drawer.body.appendChild(el);
    });
    this.updateButton();
  }

  bindToast(el: HTMLElement, not: INotification) {
    const closeBtn = el.querySelector('[data-dismiss]')!;
    closeBtn.addEventListener('click', () => {
      this.markAsRead(not, el);
    });
    const input: HTMLInputElement = el.querySelector('input') as HTMLInputElement;
    input.addEventListener('change', () => {
      if (input.checked) {
        this.selected.add(not.id);
      } else {
        this.selected.delete(not.id);
      }
      this.updateButton();
    });
  }

  die() {
    this.unbindEvents();
  }

  private markAsRead(not: INotification, el: HTMLElement) {
    // eslint-disable-next-line no-param-reassign
    not.read = true;
    el.classList.toggle('show');
    this.unreadCount = this.data.filter((v) => !v.read).length;

    sf.ajax.send({
      method: 'POST',
      data: { id: not.id },
      url: this.options.api.setAsRead,
    }).then((axResp) => {
      const { data } = axResp;
      this.handleResponse(data);
    }).catch(() => {
      this.reload();
    });
  }

  markSelection() {
    let ids = this.data.map((v) => v.id);
    if (this.selected.size && this.selected.size < ids.length) {
      ids = [...this.selected.values()];
    }
    sf.ajax.send({
      method: 'POST',
      data: { id: ids },
      url: this.options.api.setAsRead,
    }).then((axResp) => {
      const { data } = axResp;
      this.handleResponse(data);
    }).catch(() => {
      this.reload();
    });
  }
}
