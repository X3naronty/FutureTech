export default class Header {
    selectors = {
        root: '[data-js-header]',
        overlay: '[data-js-overlay]',
        burgerButton: '[data-js-burger-button]'
    }
    
    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock'
    }
    
    constructor() {
        this.rootElement = document.querySelector(this.selectors.root);
        this.overlayElement = this.rootElement.querySelector(this.selectors.overlay);
        this.burgerButton = this.rootElement.querySelector(this.selectors.burgerButton);
        this.bindEvents();
    }
    
    bindEvents() {
        this.burgerButton.addEventListener('click', this.handleBurgerButtonClick);
    }
    
    handleBurgerButtonClick = (event) => {
        this.overlayElement.classList.toggle(this.stateClasses.isActive);
        this.burgerButton.classList.toggle(this.stateClasses.isActive);
        document.documentElement.classList.toggle(this.stateClasses.isLock);
        this.burgerButton.setAttribute('aria-expanded', this.burgerButton.classList.contains('is-active') ? 'true' : 'false');
    } 
}
