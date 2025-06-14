import BaseComponent from './BaseComponent.js';

export default class Select extends BaseComponent {
    ariaAttributes = {
        ariaSelected: 'aria-selected',
        ariaExpanded: 'aria-expanded',
        ariaHidden: 'aria-hidden',
    };

    stateClasses = {
        isExpanded: 'is-expanded',
        isFocused: 'is-focused',
        isSelected: 'is-selected',
    };

    stateAttributes = {
        isFocused: 'data-js-focused',
        isSelected: 'data-js-selected',
    };

    selectors = {
        root: '[data-js-select]',
        originalControl: '[data-js-original-control]',
        button: '[data-js-select-button]',
        dropdown: '[data-js-select-dropdown]',
        option: '[data-js-select-option]',
    };

    constructor(node) {
        super();
        this.root = node;
        this.originalControl = this.root.querySelector(this.selectors.originalControl);
        this.button = this.root.querySelector(this.selectors.button);
        this.dropdown = this.root.querySelector(this.selectors.dropdown);
        this.options = [...this.root.querySelectorAll(this.selectors.option)];
        this.state = this.getProxyState({
            isExpanded: false,
            selectedIdx: this.options.findIndex((option) => option.hasAttribute(this.stateAttributes.isSelected)),
            focusedIdx: 0,
        });
        this.bindEvents();
    }

    updateUI() {
        const { isExpanded, selectedIdx, focusedIdx } = this.state;

        const newValue = this.options[selectedIdx].textContent;
        const updateButton = () => {
            this.button.textContent = newValue;
            this.button.setAttribute(this.ariaAttributes.ariaExpanded, isExpanded);
            console.log(isExpanded);
            this.button.classList.toggle(this.stateClasses.isExpanded, isExpanded);
        };

        const updateDropdown = () => {
            this.dropdown.classList.toggle(this.stateClasses.isExpanded, isExpanded);
        };

        const updateOptions = () => {
            this.options.forEach((option, idx) => {
                const isSelected = idx === selectedIdx;
                const isFocused = idx === focusedIdx;

                if (isFocused) {
                    option.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                option.classList.toggle(this.stateClasses.isSelected, isSelected);
                option.classList.toggle(this.stateClasses.isFocused, isFocused);

                option.setAttribute(this.ariaAttributes.ariaSelected, isSelected);
                option.setAttribute(this.stateAttributes.isSelected, isSelected);
            });
        };

        updateButton();
        updateDropdown();
        updateOptions();
    }

    handleArrowUpKeyDown(event) {
        event.preventDefault();
        if (!this.state.isExpanded && document.activeElement === this.button) {
            this.state.isExpanded = true;
            return;
        }

        if (this.state.focusedIdx > 0) {
            this.state.focusedIdx--;
        }
    }

    handleArrowDownKeyDown(event) {
        event.preventDefault();

        if (!this.state.isExpanded && document.activeElement === this.button) {
            this.state.isExpanded = true;
            return;
        }

        if (this.state.focusedIdx < this.options.length - 1) {
            this.state.focusedIdx++;
        }
    }

    handleSpaceKeyDown(event) {
        event.preventDefault();

        if (!this.state.isExpanded && document.activeElement === this.button) {
            this.state.isExpanded = true;
            return;
        }

        if (this.state.focusedIdx) {
            this.state.selectedIdx = this.state.focusedIdx;
        }
        this.state.isExpanded = false;
    }

    handleEnterKeyDown(event) {
        event.preventDefault();

        if (!this.state.isExpanded && document.activeElement === this.button) {
            this.state.isExpanded = true;
            return;
        }

        if (this.state.focusedIdx) {
            this.state.selectedIdx = this.state.focusedIdx;
        }
        this.state.isExpanded = false;
    }

    handleTabKeyDown(event) {
        if (this.state.focusedIdx) {
            this.state.selectedIdx = this.state.focusedIdx;
        }
        this.state.isExpanded = false;
    }

    handleKeyDown(event) {
        const { code } = event;
        const action = {
            ArrowUp: this.handleArrowUpKeyDown.bind(this),
            ArrowDown: this.handleArrowDownKeyDown.bind(this),
            Enter: this.handleEnterKeyDown.bind(this),
            Space: this.handleSpaceKeyDown.bind(this),
            Tab: this.handleTabKeyDown.bind(this),
        }[code];

        if (action) {
            action(event);
        }
    }

    handleInnerClick(event) {
        const targetButton = event.target.closest(this.selectors.button);
        const targetOption = event.target.closest(this.selectors.option);

        if (targetButton) {
            this.state.isExpanded = !this.state.isExpanded;
        }

        if (targetOption) {
            this.state.selectedIdx = [...this.options].findIndex((option) => option === targetOption);
            this.state.isExpanded = !this.state.isExpanded;
        }
    }

    handleClick(event) {
        const targetSelect = event.target.closest(this.selectors.root);
        if (targetSelect) {
            this.handleInnerClick(event);
        } else {
            if (this.state.focusedIdx) {
                this.state.selectedIdx = this.state.focusedIdx;
            }
            this.state.isExpanded = false;
        }
    }

    bindEvents() {
        document.addEventListener('click', this.handleClick.bind(this));
        this.root.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
}
