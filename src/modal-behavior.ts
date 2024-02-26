document.addEventListener('click', function (event) {
    const modal = document.getElementById('modal') as HTMLDialogElement | null;
    if (modal && event.target === modal) {
        modal.close();
    }
});

document.addEventListener('keydown', function (event) {
    const modal = document.getElementById('modal') as HTMLDialogElement | null;
    if (modal && event.key === 'Escape') {
        modal.close();
    }
});

document.addEventListener('click', function (event) {
    const modal = document.getElementById('modal') as HTMLDialogElement | null;
    if (modal && event.target instanceof HTMLAnchorElement && event.target.getAttribute('aria-label') === 'Close') {
        modal.close();
    }
});
