window.registerOutsideClick = function (dotNetHelper) {
    document.addEventListener('click', function (e) {
        const picker = document.querySelector('.color-picker-container');
        if (picker && !picker.contains(e.target)) {
            dotNetHelper.invokeMethodAsync('HideColorPicker');
        }
    });
};

window.unregisterOutsideClick = function () {
    // Cleanup for disposal
    const picker = document.querySelector('.color-picker-container');
    if (picker) {
        picker.removeEventListener('click', function (e) {
            const picker = document.querySelector('.color-picker-container');
            if (picker && !picker.contains(e.target)) {
                dotNetHelper.invokeMethodAsync('HideColorPicker');
            }
        });
    }
};

window.positionAbove = (pickerId, slotId) => {
    const picker = document.getElementById(pickerId);
    const slot = document.getElementById(slotId);

    if (!picker || !slot) return;

    //const slotRect = slot.getBoundingClientRect();
    //const parentRect = slot.offsetParent.getBoundingClientRect();

    picker.style.position = "absolute";
    picker.style.top = (slot.offsetTop - picker.offsetHeight - 10) + "px";
    picker.style.left = slot.offsetLeft + "px";
};

