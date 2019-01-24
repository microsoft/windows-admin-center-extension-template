//
//
var fse = require('fs-extra');

module.exports = {
    update: function (validate) {
        console.log('we made it');

        let actions = buildElements();

        if(validate) {
            editFiles();
        } else {
            warnFiles();
        }
    }
}

function editFiles() {
    console.log('writing');
}

function warnFiles() {
    console.log('prompt only');
}

function buildElements() {
    return {
        '.auto-flex-size': { action: 'edit', content: '.sme-position-flex-auto' },
        '.border-all': { action: 'edit', content: '.sme-border-inset-sm .sme-border-color-base-90' },
        '.border-bottom': { action: 'edit', content: '.sme-border-bottom-sm .sme-border-bottom-color-base-90' },
        '.border-horizontal': { action: 'edit', content: '.sme-border-horizontal-sm .sme-border-horizontal-color-base-90' },
        '.border-left': { action: 'edit', content: '.sme-border-left-sm .sme-border-left-color-base-90' },
        '.border-right': { action: 'edit', content: '.sme-border-right-sm .sme-border-right-color-base-90' },
        '.border-top': { action: 'edit', content: '.sme-border-top-sm .sme-border-top-color-base-90' },
        '.border-vertical': { action: 'edit', content: '.sme-border-vertical-sm .sme-border-vertical-color-base-90' },
        '.break-word': { action: 'edit', content: '.sme-arrange-ws-wrap' },
        '.color-dark': { action: 'edit', content: '.sme-color-alt' },
        '.color-light': { action: 'edit', content: '.sme-color-base' }, 
        '.color-light-gray': { action: 'edit', content: '.sme-color-base-90' },
        '.dashboard': { action: 'edit', content: 'sme-layout-content-zone-padded sme-arrange-stack-h' },
        '.details-panel': { action: 'edit', content: 'sme-property-grid' },
        '.details-panel-container': { action: 'edit', content: 'sme-property-grid' },
        '.details-tab': { action: 'warn', content: 'sme-property-grid and/or sme-pivot' },
        '.details-wrapper': { action: 'edit', content: 'sme-property-grid' },
        '.disabled': { action: 'edit', content: 'sme-disabled' },
        '.fixed-flex-size': { action: 'edit', content: '.sme-position-flex-none' },
        '.flex-layout': { action: 'warn', content: '.sme-arrange-stack-h OR .sme-arrange-stack-v' },
        '.font-bold': { action: 'edit', content: '.sme-font-emphasis1' },
        '.nav-tabs': { action: 'edit', content: 'sme-pivot component' },
        '.acceptable': { action: 'edit', content: 'remove only' },
        '.alert': { action: 'edit', content: 'sme-alert component' },
        '.alert-danger': { action: 'edit', content: 'sme-alert component' },
        '.breadCrumb': { action: 'edit', content: 'sme-alert component' },
        '.checkbox': { action: 'edit', content: 'sme-form-field[type="checkbox"]' }, 
        '.color-error': { action: 'edit', content: 'remove only' },
        '.color-info': { action: 'edit', content: 'remove only' },
        '.color-success': { action: 'edit', content: 'remove only' },
        '.color-warning': { action: 'edit', content: 'remove only' },
        '.combobox': { action: 'edit', content: 'sme-form-field[type="select"]' },
        '.delete-button': { action: 'edit', content: 'remove only' },
        '.details-content': { action: 'edit', content: 'remove only' },
        '.error-cover': { action: 'edit', content: 'remove only' },
        '.error-message': { action: 'edit', content: 'remove only' },
        '.form-buttons': { action: 'edit', content: 'Please use sme-form-field components instead' },
        '.form-control': { action: 'edit', content: 'Please use sme-form-field components instead' },
        '.form-controls': { action: 'edit', content: 'Please use sme-form-field components instead' },
        '.form-group': { action: 'edit', content: 'Please use sme-form-field components instead' },
        '.form-group-label': { action: 'edit', content: 'Please use sme-form-field components instead' },
        '.form-input': { action: 'edit', content: 'Please use sme-form-field components instead' },
        '.form-stretch': { action: 'edit', content: 'Please use sme-form-field components instead' },
        '.guided-pane-button': { action: 'edit', content: 'remove only' },
        '.header-container': { action: 'edit', content: 'remove only' },
        '.highlight': { action: 'edit', content: '.sme-background-color-yellow' },
        '.horizontal': { action: 'edit', content: '.sme-arrange-stack-h' },
        '.indent': { action: 'edit', content: 'remove only' },
        '.input-file': { action: 'edit', content: 'Please use sme-form-field components instead' },
        '.invalid': { action: 'edit', content: 'remove only' },
        '.item-list': { action: 'edit', content: 'remove only' }, 
        '.modal-scrollable': { action: 'edit', content: 'remove only' },
        '.multi-section': { action: 'edit', content: 'remove only' },
        '.no-action-bar': { action: 'edit', content: 'remove only' },
        '.no-scroll': { action: 'edit', content: '.sme-position-flex-auto' },
        '.nowrap': { action: 'edit', content: '.sme-arrange-stack-h OR .sme-arrange-stack-v' },
        '.overflow-margins': { action: 'warn', content: 'remove only' },
        '.overflow-tool': { action: 'warn', content: 'remove only' },
        '.progress-cover': { action: 'warn', content: 'remove only' },
        '.radio': { action: 'warn', content: 'sme-form-field[type="radio"]' },
        '.relative': { action: 'edit', content: '.sme-layout-relative' },
        '.relative-center': { action: 'edit', content: '.sme-layout-absolute .sme-position-center' },
        '.required-clue': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.reverse': { action: 'edit', content: '.sme-arrange-stack-reversed' },
        '.right-panel': { action: 'warn', content: 'remove only' },
        '.rollup': { action: 'warn', content: 'remove only' },
        '.rollup-status': { action: 'warn', content: 'remove only' },
        '.rollup-title': { action: 'warn', content: 'remove only' },
        '.rollup-value': { action: 'warn', content: 'remove only' },
        '.searchbox': { action: 'warn', content: 'sme-form-field[type="search"]' },
        '.searchbox-action-bar': { action: 'warn', content: 'remove only' },
        '.size-h-1': { action: 'warn', content: 'remove only' },
        '.size-h-2': { action: 'warn', content: 'remove only' },
        '.size-h-3': { action: 'warn', content: 'remove only' },
        '.size-h-4': { action: 'warn', content: 'remove only' },
        '.size-h-full': { action: 'warn', content: 'remove only' },
        '.size-h-half': { action: 'warn', content: 'remove only' },
        '.size-v-1': { action: 'warn', content: 'remove only' },
        '.size-v-2': { action: 'warn', content: 'remove only' },
        '.size-v-3': { action: 'warn', content: 'remove only' },
        '.size-v-4': { action: 'warn', content: 'remove only' },
        '.status-icon': { action: 'edit', content: 'remove only' },
        '.stretch-absolute': { action: 'edit', content: '.sme-layout-absolute .sme-position-inset-none' },
        '.stretch-fixed': { action: 'edit', content: '.sme-layout-fixed .sme-position-inset-none' },
        '.stretch-vertical': { action: 'edit', content: '.sme-position-stretch-v' },
        '.stretch-width': { action: 'edit', content: '.sme-position-stretch-h' },
        '.svg-16px': { action: 'warn', content: 'remove only' },
        '.table-indent': { action: 'warn', content: 'remove only' },
        '.table-sm': { action: 'warn', content: 'remove only' },
        '.thin': { action: 'warn', content: 'remove only' },
        '.tile': { action: 'warn', content: 'remove only' },
        '.tile-body': { action: 'warn', content: 'remove only' },
        '.tile-content': { action: 'warn', content: 'remove only' },
        '.tile-footer': { action: 'warn', content: 'remove only' },
        '.tile-header': { action: 'warn', content: 'remove only' },
        '.tile-layout': { action: 'warn', content: 'remove only' },
        '.tile-table': { action: 'warn', content: 'remove only' },
        '.tool-bar': { action: 'warn', content: 'remove only' },
        '.tool-container': { action: 'warn', content: 'sme-layout-content-zone or sme-layout-content-zone-padded' },
        '.tool-header': { action: 'warn', content: 'remove only' },
        '.tool-header-box': { action: 'warn', content: 'remove only' },
        '.tool-pane': { action: 'warn', content: 'remove only' },
        '.toolbar': { action: 'warn', content: 'remove only' },
        '.usage-bar': { action: 'warn', content: 'remove only' },
        '.usage-bar-area': { action: 'warn', content: 'remove only' },
        '.usage-bar-background': { action: 'warn', content: 'remove only' },
        '.usage-bar-title': { action: 'warn', content: 'remove only' },
        '.usage-bar-value': { action: 'warn', content: 'remove only' },
        '.usage-chart': { action: 'warn', content: 'remove only' },
        '.usage-message': { action: 'warn', content: 'remove only' },
        '.usage-message-area': { action: 'warn', content: 'remove only' },
        '.usage-message-title': { action: 'warn', content: 'remove only' },
        '.vertical': { action: 'edit', content: '.sme-arrange-stack-v' },
        '.vertical-scroll-only': { action: 'edit', content: '.sme-arrange-overflow-hide-x sme-arrange-overflow-auto-y' },
        '.warning': { action: 'warn', content: 'remove only' },
        '.white-space': { action: 'warn', content: 'remove only' },
        '.wrap': { action: 'warn', content: '.sme-arrange-wrapstack-h OR .sme-arrange-wrapstack-v' },
        '.btn': { action: 'warn', content: '.sme-button OR button' },
        '.btn-primary': { action: 'warn', content: '.sme-button.sme-button-primary OR button.sme-button-primary' },
        '.toggle-switch': { action: 'warn', content: 'sme-form-field[type="toggle-switch"]' },
        '.icon-win': { action: 'warn', content: 'remove only' }
    };
}