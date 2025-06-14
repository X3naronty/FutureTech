import AccordionGroup from './AccordionGroup.js';
import Header from './Header.js';
import Select from './Select.js';

new Header();

const accordionGroup = document.querySelector('[data-js-faq]');
if (accordionGroup) {
    new AccordionGroup(accordionGroup);
}

const select = document.querySelector('[data-js-select]');
if (select) {
    new Select(select);
}
