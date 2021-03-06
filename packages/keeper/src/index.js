import './keeper.scss';

import { confirmModal } from './utils/confirm';
import Nav from './components/nav';
import Dropdown from './components/dropdown';
import Sidebar from './components/sidebar';
import Modal from './components/modal';
import NotificationCenter from './components/notificationCenter';
import Tabnav from './components/tabnav';

import { on, dispatch } from './utils/events';

document.addEventListener('DOMContentLoaded', () => {
  NotificationCenter.init();

  document.querySelectorAll('[data-sf="dropdown"]').forEach((elem) => Dropdown.init(elem));
  document.querySelectorAll('[data-sf="modal"]').forEach((elem) => Modal.init(elem));
  document.querySelectorAll('[data-sf="tabnav"]').forEach((elem) => Tabnav.init(elem));

  Nav.init();
  Sidebar.init();

  setTimeout(() => document.body.classList.add('loaded'), 1);

  document.addEventListener('sf:confirm', (e) => {
    // eslint-disable-next-line max-len
    confirmModal(e.detail.title, e.detail.body, e.detail.options).then(e.detail.onConfirm).catch(e.detail.onCancel);
  });
});

export {
  on,
  dispatch,
  confirmModal,
  Dropdown,
  Modal,
  Tabnav,
  NotificationCenter,
};
