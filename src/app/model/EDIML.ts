import {Logger, availableContexts} from '../utils/logger';
import {Configuration} from './Configuration';
import {Element} from './Element';
import {Item} from './Item';
import {ITemplate} from './Template';
import {State} from './State';
import {AlternativeGroup} from './AlternativeGroup';
import {XML2JSON} from '../utils/XML2JSON';
/**
 * Created by fabio on 05/03/2017.
 */

export interface IXSLT {
    xslt: string;
}

export interface IEDIMLItem {
    id: string;
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
        templateName: State.templateName,
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
    }
    ;
    private x2js: XML2JSON = new XML2JSON();

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

    constructor(public template: ITemplate) {
        console.log('EDIML constructor', template);
        this.contents.generator = 'EDI-NG_CLient v.3.0';
        this.contents.ediVersion = '3.0';
        this.contents.starterKit = 'noSK';
        this.contents.starterKitUri = '';
        this.contents.timestamp = new Date();
        this.contents.baseDocument = template.settings.baseDocument;
        this.contents.xsltChain = template.settings.xsltChain;
        console.log('State is now', State.templateName);

        this.contents.templateName = State.templateName;
        /*
         this.contents.templateDocument = State.originalTemplate;
         */
        this.contents.version = '' + State.templateVersion;
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
                        if ( i.dataType == 'boundingBox' ) {
                            // TODO:
                            let temp = this.createBoundingBoxItems(i);
                            for ( let t of temp ) {
                                element.items.item.push(t);
                            }
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

                                if (item.isLanguageNeutral == 'true') {
                                    item.value = item.languageNeutral;
                                } else if (item.useCode == 'true') {
                                    item.value = item.codeValue;
                                } else if (item.useURN == 'true') {
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
        console.log('EDIML', this.contents);
    }
}

