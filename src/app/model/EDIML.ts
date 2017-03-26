import {Logger, availableContexts} from '../utils/logger';
import {Configuration} from './Configuration';
import {Element} from './Element';
import {Item} from './Item';
/**
 * Created by fabio on 05/03/2017.
 */
export class EDIML {
    metadataEndpoint: string;
    settings: any;
    edimls: any = {};
    isDirty: boolean = false;
    logger: Logger = new Logger(availableContexts.EDIML);
    defaults: any = {
        metadataEndpoint: 'https://adamassoft.it/jbossTest/edi/',
        requiresValidation: 'true',
        ediVersion: '2.00',
        controlCSS: 'form-control',
        controlGroupCSS: 'input-group',
        labelCSS: 'form-label',
        DEBUG_DATASOURCES: false,
        refreshDelay: 100,
        selectsDelay: 1000
    }

    content: any = {
        elements: {
            ediVersion: 2.0,
            version: undefined,
            template: undefined,
            templateDocument: undefined,
            starterKit: 'noSK',
            starterKitUri: undefined,
            fileId: undefined,
            fileUri: undefined,
            user: undefined,
            baseDocument: undefined,
            xsltChain: undefined,
            element: [Element]
        }
    };

    inheritSettings(newSettings: any) {
        this.settings = newSettings;
        this.metadataEndpoint = this.settings.metadataEndpoint;
        if (typeof this.metadataEndpoint === 'undefined') {
            this.metadataEndpoint = this.defaults.metadataEndpoint;
        }
        if (typeof this.settings.baseDocument !== 'undefined') {
            this.content.elements.baseDocument = this.settings.baseDocument;
        }
        if (typeof this.settings.xsltChain !== 'undefined') {
            this.content.elements.xsltChain = this.settings.xsltChain;
        }
    }

    fixJSONDiscrepancies() {
        this.logger = new Logger('editfillin');
        for (let i = 0; i < this.content.elements.element.length; i++) {
            let element = this.content.elements.element[i];
            if (Array.isArray(element.items)) {
                let temp = element.items.item;
                element.items = {};
                if (Array.isArray(temp)) {
                    element.items.item = temp;
                } else {
                    element.items.item = [temp];
                }
            }
        }
    }

/*
    fillInEdiMl(ediMl: any) {
        this.logger = new Logger('editfillin');
        let element: Element;
        let item: Item;
        let cloneSuffix = Configuration.cloneSuffix;
        this.logger.log('ediml caricato:');
        this.logger.log(ediMl);
        this.content.elements.fileId = ediMl.fileId;
        this.content.elements.fileUri = ediMl.fileUri;
        this.content.elements.template = ediMl.templateName;
        this.content.elements.version = ediMl.version;
        this.content.elements.ediVersion = this.defaults.ediVersion;
        this.content.elements.starterKitUri = ediMl.starterKitUri;
        this.content.elements.element = ediMl.element;
        this.content.elements.baseDocument = ediMl.baseDocument;
        this.fixJSONDiscrepancies();

        this.logger.log(this.content.elements);
        let elements = this.content.elements;
        for (let i = 0; i < elements.element.length; i++) {
            element = elements.element[i];
            if (element.id.indexOf(cloneSuffix) === -1) {
                this.logger.log(element);
                let represents_element = element.id.split(cloneSuffix).join('');
                if (!Array.isArray(element.items.item)) {
                    element.items.item = [element.items.item];
                }
                for (let j = 0; element.items.item && j < element.items.item.length; j++) {
                    item = element.items.item[j];
                    let newItem = new Item();
                    newItem = Object.assign({}, item);
                    element.items.item[j] = newItem;
                    item = element.items.item[j];
                }
            }
        }
    }
*/
}
