export class ModalManager {
  constructor() {
    this.modals = {
      mainMenu: document.getElementById('main-menu'),
      gameOver: document.getElementById('game-over-menu'),
      lifeLost: document.getElementById('life-lost-menu'),
      help: document.getElementById('help-modal'),
      pause: document.getElementById('pause-menu')
    };
  }

  showModal(modalName) {
    this.closeAllModals();
    const modalEl = this.modals[modalName];
    if (modalEl && !modalEl.open) {
      modalEl.style.pointerEvents = 'auto';
      modalEl.showModal();
    }
  }

  closeAllModals() {
    Object.values(this.modals).forEach(m => {
      if (m && m.open) {
        m.style.pointerEvents = 'none';
        m.close();
      }
    });
  }
}
