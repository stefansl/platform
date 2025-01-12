/* global cy */
import elements from '../sw-general.page-object';

export default class ProductStreamPageObject {
    constructor() {
        this.elements = {
            ...elements,
            ...{
                columnName: '.sw-product-stream-list__column-name',
                streamSaveAction: '.sw-product-stream-detail__save-action'
            }
        };
    }

    deleteProductStream(productStreamName) {
        cy.get('.sw-sidebar__navigation .sw-sidebar-navigation-item').click();
        cy.get(this.elements.loader).should('not.exist');
        cy.clickContextMenuItem(
            '.sw-context-menu-item--danger',
            this.elements.contextMenuButton,
            `${this.elements.dataGridRow}--0`
        );
        cy.contains(`${this.elements.modal}__body`,
            `Are you sure you want to delete the dynamic product group "${productStreamName}"?`);

        cy.get(`${this.elements.modal}__footer button${this.elements.primaryButton}`).click();
        cy.get(this.elements.modal).should('not.exist');
    }

    clickProductStreamFilterOption(productStreamFilterQuery, actionLabel) {
        productStreamFilterQuery.within(() => {
            cy.get('.sw-context-button').click();
        });
        cy.get('.sw-context-menu').contains(actionLabel).click();
    }

    fillFilterWithSelect(selector, { field, operator, value }) {
        this.selectFieldAndOperator(selector, field, operator);

        cy.get(selector).within(() => {
            // value is the last single-select
            cy.get('.sw-single-select').last().within(($singleSelect) => {
                cy.wrap($singleSelect).click();
                cy.get('.sw-select-result-list').should('be.visible');
                selectResultList().find('li.sw-select-result').contains(value).click();
            });
        });
    }

    fillFilterWithEntitySelect(selector, { field, operator, value }) {
        this.selectFieldAndOperator(selector, field, operator);

        cy.get(selector).within(() => {
            // value is the last single-select
            cy.get('.sw-entity-single-select').within(($singleSelect) => {
                cy.wrap($singleSelect).click();
                cy.get('.sw-select-result-list').should('be.visible');
                selectResultList().find('li.sw-select-result').contains(value).click();
            });
        });
    }

    /**
     * @param exact Selects the field with an exact match
     */
    fillFilterWithEntityMultiSelect(selector, { field, operator, value }, exactField = false) {
        this.selectFieldAndOperator(selector, field, operator, exactField);

        cy.get(selector).within((p) => {
            cy.get('.sw-entity-multi-select').within(($multiSelect) => {
                cy.get('.sw-select-selection-list__input').click();
                cy.get('.sw-select-result-list').should('be.visible');
            });
        });

        value.forEach((value) => {
            // "force: true" is needed, because when clicking several entries, the tooltip might be overlapping
            // the next element to click
            cy.get('li.sw-select-result').contains(value).click({ force: true });
        });
    }

    selectFieldAndOperator(selector, fieldPath, operator, exactField = false) {
        if (typeof fieldPath === 'string' && fieldPath !== '') {
            cy.wrap(fieldPath.split('.')).each((field) => {
                cy.get('.sw-product-stream-field-select').last().within(($singleSelect) => {
                    cy.wrap($singleSelect).click();
                    cy.get('.sw-select-result-list').should('be.visible');
                    const searchText = exactField ? new RegExp(`^${field}$`) : field;

                    selectResultList().find('li.sw-select-result').contains(searchText).click();
                });
            });
        }

        if (typeof operator === 'string' && operator !== '') {
            cy.get(selector).find('.sw-product-stream-value').within(() => {
                cy.get('.sw-single-select').first().click();
            });

            cy.get('.sw-select-result-list').should('be.visible');
            cy.get('li.sw-select-result').contains(operator).click();
        }
    }
}

function selectResultList() {
    return cy.window().then(() => {
        return cy.wrap(Cypress.$('.sw-select-result-list-popover-wrapper'));
    });
}
