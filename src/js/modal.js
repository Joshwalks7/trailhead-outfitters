let lastFocusedElement = null;

export function setupModal(overlay, dialog, titleId) {
    if (!overlay || !dialog) return;

    overlay.setAttribute("aria-hidden", "true");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("tabindex", "-1");

    if (titleId) {
        dialog.setAttribute("aria-labelledby", titleId);
    }
}

export function openModal(overlay, dialog) {
    if (!overlay || !dialog) return;

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    overlay.classList.remove("hidden");
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");

    const closeButton = dialog.querySelector("[data-modal-close]");
    if (closeButton instanceof HTMLElement) {
        closeButton.focus();
    } else {
        dialog.focus();
    }
}

export function closeModal(overlay) {
    if (!overlay) return;

    overlay.classList.add("hidden");
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");

    if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

export function trapModalFocus(event, dialog, closeHandler) {
    if (!dialog) return;

    if (event.key === "Escape") {
        event.preventDefault();
        closeHandler();
        return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const focusable = Array.from(focusableElements).filter(element => !element.hasAttribute("disabled"));

    if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
    }

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}