export default class AccordionGroup {
    selectors = {
        accordion: '[data-js-accordion]',
        accordionSummary: '[data-js-accordion-summary]',
    };

    constructor(node) {
        this.root = node;
        let accordions = [...this.root.querySelectorAll(this.selectors.accordion)];
        this._accordionsMap = new Map(accordions.map((accordion) => [accordion, new Accordion(accordion)]));
        this.currentOpened = this._accordionsMap.values().find((item) => item.isOpened);
        this.bindEvents();
    }

    bindEvents() {
        this.root.addEventListener('click', this.onAccordionClick.bind(this));
    }

    onAccordionClick(event) {
        let target = event.target.closest(this.selectors.accordionSummary);
        if (!target) {
            return;
        } else target = target.closest(this.selectors.accordion);

        let accordion = this._accordionsMap.get(target);

        accordion.toggle();
        if (accordion !== this.current && this.current?.isOpened)  this.current?.toggle();;
        this.current = accordion;
    }
}

class Accordion {
    selectors = {
        button: '[data-js-accordion-button]',
        content: '[data-js-accordion-content]',
    };
    stateClasses = {
        isOpened: 'is-opened',
    };
    stateAttributes = {
        isOpened: 'data-js-is-opened',
    };

    constructor(node) {
        this.root = node;
        this.isOpened = !!this.root.hasAttribute(this.stateAttributes.isOpened);

        let button = node.querySelector(this.selectors.button);
        this.button = new AccordionButton(button, this.isOpened);

        let content = node.querySelector(this.selectors.content, this.isOpened);
        this.content = new AccordionContent(content);
    }

    toggle() {
        this.isOpened = !this.isOpened;
        this.root.toggleAttribute(this.stateAttributes.isOpened);
        this.root.classList.toggle(this.stateClasses.isOpened);

        this.button.toggle();
        this.content.toggle();
    }
}

class AccordionButton {
    constructor(node, isOpened) {
        this.root = node;
        this.isExpanded = isOpened;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
        this.root.setAttribute('aria-expanded', this.isExpanded);
    }
}

class AccordionContent {
    constructor(node, isOpened) {
        this.root = node;
        this.isHidden = !isOpened;
    }

    toggle() {
        this.isHidden = !this.isHidden;
        this.root.setAttribute('aria-hidden', this.isHidden);
    }
}
