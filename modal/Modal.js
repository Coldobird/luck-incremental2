export class Modal {
  constructor({ id, message, confirmText = "Reset!", cancelText = "Cancel" }) {
    this.id = id;
    this.message = message;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
    this.modalElement = this.createModal();
    document.body.appendChild(this.modalElement);
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = this.id;
    modal.className = 'modal hidden';
    modal.innerHTML = `
      <div class="modal-content">
        <p>${this.message}</p>
        <button class="modal-button" data-action="confirm">${this.confirmText}</button>
        <button class="modal-button" data-action="cancel">${this.cancelText}</button>
      </div>
    `;
    return modal;
  }

  show() {
    this.modalElement.classList.remove('hidden');
  }

  hide() {
    this.modalElement.classList.add('hidden');
  }

  onConfirm(callback) {
    this.modalElement.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      callback();
      this.hide();
    });
  }

  onCancel(callback) {
    this.modalElement.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      callback();
      this.hide();
    });
  }
}
