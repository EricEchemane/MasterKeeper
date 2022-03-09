const listenToDropdown = () => {
    let currentOpenDropdown = null;
    const dropdowns = document.querySelectorAll('div.menu-wrapper');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
                currentOpenDropdown.classList.remove('show');
            }
            currentOpenDropdown = dropdown;
            dropdown.classList.toggle('show');
        });
    });

    window.onclick = (e: any) => {
        if (e.target.classList.contains('menu-item')) {
            currentOpenDropdown.classList.remove('show');
            return;
        }
        if (currentOpenDropdown && !currentOpenDropdown.contains(e.target)) {
            currentOpenDropdown.classList.remove('show');
        }
    };
};

export default listenToDropdown;