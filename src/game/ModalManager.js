export class ModalManager {
  constructor() {
    this.currentModal = null;
    this.modals = {
      mainMenu: document.getElementById('main-menu'),
      gameOver: document.getElementById('game-over-menu'),
      lifeLost: document.getElementById('life-lost-menu'),
      help: document.getElementById('help-modal'),
      pause: document.getElementById('pause-menu')
    };

    // Prevent closing with ESC
    Object.values(this.modals).forEach(m => {
      if (m) {
        m.addEventListener('cancel', (e) => {
          e.preventDefault();
          // On mobile, the back button might trigger 'cancel' on the dialog instead of 'popstate'.
          // By preventing default, we keep the dialog open.
          // Then we manually trigger the back navigation so our popstate handler catches it.
          window.history.back();
        });
      }
    });
  }

  showModal(modalName) {
    this.closeAllModals();
    this.currentModal = modalName;
    const modalEl = this.modals[modalName];
    if (modalEl && !modalEl.open) {
      modalEl.style.pointerEvents = 'auto';
      modalEl.showModal();
    }
  }

  closeAllModals() {
    this.currentModal = null;
    Object.values(this.modals).forEach(m => {
      if (m && m.open) {
        m.style.pointerEvents = 'none';
        m.close();
      }
    });
  }
}
