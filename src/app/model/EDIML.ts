import {Logger, availableContexts} from '../utils/logger';
import {Configuration} from './Configuration';
import {Element} from './Element';
import {Item} from './Item';
import {ITemplate} from './Template';
import {State} from './State';
import {AlternativeGroup} from './AlternativeGroup';
import {XML2JSON} from '../utils/XML2JSON';
import {EDITemplate} from '../components/service/EDITemplate';
import {MetadataService} from '../components/service/MetadataService';
/**
 * Created by fabio on 05/03/2017.
 */

export interface IXSLT {
    xslt: string;
}

export interface IEDIMLItem {
    id: string;
    label?: any;
    hasIndex: number;
    element_id: string;
    path: string;
    codeValue: string;
    urnValue: string;
    labelValue: string;
    value: string;
    datatype: string;
    fixed: string;
    isLanguageNeutral: string;
    languageNeutral: string;
    useCode: string;
    useURN: string;
    outIndex?: string;
    datasource: string;
}

export interface IEDIMLElement {
    id: string;
    root: string;
    mandatory: string;
    label: string;
    alternativeTo?: string;
    represents_element?: string;
    items: {
        item: IEDIMLItem[]
    };
}

export class EDIML {
    static metadataService: MetadataService;
    contents: {
        generator: string;
        ediVersion: string;
        starterKit: string;
        starterKitUri: string;
        fileId: string;
        fileUri: string;
        timestamp: Date;
        baseDocument: string;
        xsltChain: IXSLT[];
        templateName: string;
        /*
         templateDocument: string;
         */
        version: string;
        user: string;
        /*
         queryString: string;
         numElements: number;
         */
        element: IEDIMLElement[];
    } = {
        generator: 'EDI-NG_CLient v.3.0',
        ediVersion: '3.0',
        starterKit: 'noSK',
        starterKitUri: '',
        timestamp: new Date(),
        baseDocument: '',
        xsltChain: [],
        templateName: 'template not initialised',
        /*
         templateDocument: '',
         */
        version: '',
        fileId: '',
        fileUri: '',
        user: '',
        /*
         queryString: '',
         numElements: 0,
         */
        element: []
    };
    private x2js: XML2JSON = new XML2JSON();
    ediTemplate: EDITemplate;

    toXML() {
        let json = JSON.parse(JSON.stringify(this.contents));
        /*
         json = {
         ediml: {
         firstName: 'John',
         lastName: 'Doe'
         }
         };
         */
        delete json.templateDocument;

        let temp = this.x2js.json2xmlString({elements: json});
        // let parser = require('xml2json');
        // let temp = parser.toXml(json, {});
        console.log('toXML', temp);
        return temp;
    }

    createBoundingBoxItems(i: Item) {
        let itemEast: IEDIMLItem = {
            id: i.elementId + '_' + i.index + '_eastLongitude',
            label: i.label,
            hasIndex: i.index,
            element_id: i.elementId,
            codeValue: i.codeValue,
            datasource: ( i.datasource ? i.datasource.id : '' ),
            datatype: i.dataType,
            fixed: ( i.fixed ? 'true' : 'false'),
            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
            labelValue: i.eastLongitude.value,
            urnValue: i.urnValue,
            languageNeutral: i.languageNeutral,
            value: i.eastLongitude.value,
            outIndex: i.outIndex ? '' + i.outIndex : undefined,
            path: i.eastLongitude.hasPath,
            useCode: ( i.useCode ? 'true' : 'false' ),
            useURN: ( i.useURN ? 'true' : 'false')
        }
        let itemWest: IEDIMLItem = {
            id: i.elementId + '_' + i.index + '_westLongitude',
            label: i.label,
            hasIndex: i.index,
            element_id: i.elementId,
            codeValue: i.codeValue,
            datasource: ( i.datasource ? i.datasource.id : '' ),
            datatype: i.dataType,
            fixed: ( i.fixed ? 'true' : 'false'),
            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
            labelValue: i.westLongitude.value,
            urnValue: i.urnValue,
            languageNeutral: i.languageNeutral,
            value: i.westLongitude.value,
            outIndex: i.outIndex ? '' + i.outIndex : undefined,
            path: i.westLongitude.hasPath,
            useCode: ( i.useCode ? 'true' : 'false' ),
            useURN: ( i.useURN ? 'true' : 'false')
        }
        let itemNorth: IEDIMLItem = {
            id: i.elementId + '_' + i.index + '_northLatitude',
            label: i.label,
            hasIndex: i.index,
            element_id: i.elementId,
            codeValue: i.codeValue,
            datasource: ( i.datasource ? i.datasource.id : '' ),
            datatype: i.dataType,
            fixed: ( i.fixed ? 'true' : 'false'),
            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
            labelValue: i.northLatitude.value,
            urnValue: i.urnValue,
            languageNeutral: i.languageNeutral,
            value: i.northLatitude.value,
            outIndex: i.outIndex ? '' + i.outIndex : undefined,
            path: i.northLatitude.hasPath,
            useCode: ( i.useCode ? 'true' : 'false' ),
            useURN: ( i.useURN ? 'true' : 'false')
        }
        let itemSouth: IEDIMLItem = {
            id: i.elementId + '_' + i.index + '_southLatitude',
            label: i.label,
            hasIndex: i.index,
            element_id: i.elementId,
            codeValue: i.codeValue,
            datasource: ( i.datasource ? i.datasource.id : '' ),
            datatype: i.dataType,
            fixed: ( i.fixed ? 'true' : 'false'),
            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
            labelValue: i.southLatitude.value,
            urnValue: i.urnValue,
            languageNeutral: i.languageNeutral,
            value: i.southLatitude.value,
            outIndex: i.outIndex ? '' + i.outIndex : undefined,
            path: i.southLatitude.hasPath,
            useCode: ( i.useCode ? 'true' : 'false' ),
            useURN: ( i.useURN ? 'true' : 'false')
        }
        return [itemEast, itemWest, itemNorth, itemSouth];
    }

    createDateRangeItems(i: Item) {
        // TODO: implement this
        let itemStart: IEDIMLItem = {
            id: i.elementId + '_' + i.index + '_start',
            hasIndex: i.index,
            element_id: i.elementId,
            codeValue: i.codeValue,
            datasource: ( i.datasource ? i.datasource.id : '' ),
            datatype: i.dataType,
            fixed: ( i.fixed ? 'true' : 'false'),
            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
            labelValue: i.start.value,
            urnValue: i.urnValue,
            languageNeutral: i.languageNeutral,
            value: i.start.value,
            outIndex: i.outIndex ? '' + i.outIndex : undefined,
            path: i.start.hasPath,
            useCode: ( i.useCode ? 'true' : 'false' ),
            useURN: ( i.useURN ? 'true' : 'false')
        }
        let itemEnd: IEDIMLItem = {
            id: i.elementId + '_' + i.index + '_end',
            hasIndex: i.index,
            element_id: i.elementId,
            codeValue: i.codeValue,
            datasource: ( i.datasource ? i.datasource.id : '' ),
            datatype: i.dataType,
            fixed: ( i.fixed ? 'true' : 'false'),
            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
            labelValue: i.end.value,
            urnValue: i.urnValue,
            languageNeutral: i.languageNeutral,
            value: i.end.value,
            outIndex: i.outIndex ? '' + i.outIndex : undefined,
            path: i.end.hasPath,
            useCode: ( i.useCode ? 'true' : 'false' ),
            useURN: ( i.useURN ? 'true' : 'false')
        }

        return [itemStart, itemEnd];
    }

    sortItems() {
        for ( let e of this.contents.element ) {
            e.items.item = e.items.item.sort( (a, b) => {
                if ( a.outIndex > b.outIndex ) {
                    return 1;
                } else if ( a.outIndex < b.outIndex ) {
                    return -1;
                } else {
                    return 0;
                }
            })
        }
    }
/*
    static set metadataService(value: MetadataService) {
        EDIML.metadataService = value;
        console.log('State is now', EDIML._metadataService.state.templateName);

/!*
        this.contents.templateName = EDIML.metadataService.state.templateName;
        /!*
         this.contents.templateDocument = State.originalTemplate;
         *!/
        this.contents.version = '' + EDIML.metadataService.state.templateVersion;
*!/
    }

    static get metadataService() {
        return this._metadataService;
    }
*/

    constructor(public template: ITemplate) {
        console.log('EDIML constructor', template);
        this.contents.generator = 'EDI-NG_CLient v.3.0';
        this.contents.ediVersion = '3.0';
        this.contents.starterKit = 'noSK';
        this.contents.starterKitUri = '';
        this.contents.timestamp = new Date();
        this.contents.baseDocument = template.settings.baseDocument;
        this.contents.xsltChain = template.settings.xsltChain;
        this.contents.fileId = template.fileId;
        this.contents.fileUri = template.fileUri;

/**
 * TODO: set template name and version
        this.contents.templateName = EDIML.metadataService.state.templateName;
        /!*
         this.contents.templateDocument = State.originalTemplate;
         *!/
        this.contents.version = '' + EDIML.metadataService.state.templateVersion;
*/

        /*
         this.contents.queryString = '';
         */
        let elements: IEDIMLElement[] = [];
        for (let g of template.group) {
            console.log('group', g);
            for (let e of g.element) {
                let element: IEDIMLElement;
                if (!((e as AlternativeGroup).elements)) {
                    let e1: Element = (e as Element);
                    element = {
                        id: e1.id,
                        label: '',
                        mandatory: ( e1.mandatory ? 'forAll' : 'NA' ),
                        root: (e1 as Element).root,
                        represents_element: e1.represents_element,
                        items: {item: []}
                    };
                    for (let i of e1.items) {
                        if ( i.dataType === 'boundingBox' ) {
                            // TODO:
                            let temp = this.createBoundingBoxItems(i);
                            for (let t of temp) {
                                element.items.item.push(t);
                            }
                        } else if ( i.dataType === 'dateRange' ) {
                            // TODO:
                            let temp = this.createDateRangeItems(i);
                            for ( let t of temp ) {
                                element.items.item.push(t);
                            }
/*
                        } else if ( i.dataType === 'date' ) {
                            console.log('this is a date', i);
*/
                        } else {
                            let item: IEDIMLItem = {
                                id: i.elementId + '_' + i.index,
                                hasIndex: i.index,
                                element_id: i.elementId,
                                codeValue: i.codeValue,
                                datasource: ( i.datasource ? i.datasource.id : '' ),
                                datatype: i.dataType,
                                fixed: ( i.fixed ? 'true' : 'false'),
                                isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
                                labelValue: i.labelValue,
                                urnValue: i.urnValue,
                                languageNeutral: i.languageNeutral,
                                value: i._value,
                                outIndex: i.outIndex ? '' + i.outIndex : undefined,
                                path: i.path,
                                useCode: ( i.useCode ? 'true' : 'false' ),
                                useURN: ( i.useURN ? 'true' : 'false')
                            }
                            if (item.value && item.value.hasOwnProperty('ttValue')) {
                                item.codeValue = item.value['ttValue'];
                                item.urnValue = item.value['urn'];
                                item.labelValue = item.value['l'] ? item.value['l'] : item.value['a'];
                                item.languageNeutral = item.value['z'];

                                if (item.isLanguageNeutral === 'true') {
                                    item.value = item.languageNeutral;
                                } else if (item.useCode === 'true') {
                                    item.value = item.codeValue;
                                } else if (item.useURN === 'true') {
                                    item.value = item.urnValue;
                                } else {
                                    item.value = item.labelValue;
                                }
                            }
                            element.items.item.push(item);
                        }
                    }
                } else {
                    let e1 = (e as AlternativeGroup).activeElement;
                    if (!e1) {
                        e1 = (e as AlternativeGroup).elements[0];
                    }
                    element = {
                        id: e1.id,
                        label: '',
                        mandatory: ( e1.mandatory ? 'true' : 'false' ),
                        root: (e1 as Element).root,
                        represents_element: e1.represents_element,
                        items: {item: []},
                        alternativeTo: e.id
                    }
                    for (let i of e1.items) {
                        let item: IEDIMLItem = {
                            id: i.elementId + '_' + i.index,
                            hasIndex: i.index,
                            element_id: i.elementId,
                            codeValue: i.codeValue,
                            datasource: ( i.datasource ? i.datasource.id : '' ),
                            datatype: i.dataType,
                            fixed: ( i.fixed ? 'true' : 'false'),
                            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
                            labelValue: i.labelValue,
                            urnValue: i.urnValue,
                            languageNeutral: i.languageNeutral,
                            value: i.value,
                            outIndex: '' + i.outIndex,
                            path: i.path,
                            useCode: ( i.useCode ? 'true' : 'false' ),
                            useURN: ( i.useURN ? 'true' : 'false')
                        }
                        if (item.value && item.value.hasOwnProperty('ttValue')) {
                            item.codeValue = item.value['ttValue'];
                            item.urnValue = item.value['urn'];
                            item.labelValue = item.value['l'] ? item.value['l'] : item.value['a'];
                            item.languageNeutral = item.value['z'];
                        } else if ( ! item.value ) {
                            item.value = item.labelValue;
                        }
                        element.items.item.push(item);
                    }
                }
                console.log('pushing element', element.id);
                elements.push(element);
            }
        }

        this.contents.element = elements;
        this.sortItems();
        this.contents.timestamp = new Date();
        console.log('EDIML', this.contents);
    }
}

