import {Logger, availableContexts} from '../utils/logger';
import {Configuration} from './Configuration';
import {Element} from './Element';
import {Item} from './Item';
import {ITemplate} from "./Template";
import {State} from "./State";
import {AlternativeGroup} from "./AlternativeGroup";
import {XML2JSON} from "../utils/XML2JSON";
/**
 * Created by fabio on 05/03/2017.
 */

export interface IXSLT {
    xslt: string;
}

export interface IEDIMLItem {
    id: string;
    index: number;
    elementId: string;
    path: string;
    codeValue: string;
    urnValue: string;
    labelValue: string;
    value: string;
    dataType: string;
    fixed: string;
    isLanguageNeutral: string;
    languageNeutral: string;
    useCode: string;
    useUrn: string;
    outIndex?: string;
    datasource: string;
}

export interface IEDIMLElement {
    id: string;
    root: string;
    mandatory: string;
    label: string;
    items: IEDIMLItem[];
}

export class EDIML {
    generator: string;
    ediVersion: string;
    starterKit: string;
    starterKitUri: string;
    timestamp: Date;
    baseDocument: string;
    xsltChain: IXSLT[];
    templateName: string;
    templateDocument: string;
    version: string;
    fileId: string;
    fileUri: string;
    user: string;
    queryString: string;
    numElements: number;
    elements: IEDIMLElement[];
    x2js: XML2JSON = new XML2JSON();

    toXML() {
        return this.x2js.json2xml(this);
    }

    constructor(template: ITemplate) {
        console.log('EDIML constructor', template);
        this.generator = 'EDI-NG_CLient v.2.0';
        this.ediVersion = '2.0';
        this.starterKit = 'noSK';
        this.starterKitUri = '';
        this.timestamp = new Date();
        this.baseDocument = template.settings.baseDocument;
        this.xsltChain = template.settings.xsltChain;
        this.templateName = State.templateName;
        this.templateDocument = State.originalTemplate;
        this.version = '' + State.templateVersion;
        this.queryString = '';
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
                        items: []
                    };
                    for (let i of e1.items) {
                        let item: IEDIMLItem = {
                            id: i['_xml:id'],
                            index: i.index,
                            elementId: i.elementId,
                            codeValue: i.codeValue,
                            datasource: ( i.datasource ? i.datasource.id : '' ),
                            dataType: i.dataType,
                            fixed: ( i.fixed ? 'true' : 'false'),
                            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
                            labelValue: i.labelValue,
                            urnValue: i.urnValue,
                            languageNeutral: i.languageNeutral,
                            value: i._value,
                            outIndex: i.outIndex ? '' + i.outIndex : undefined,
                            path: i.path,
                            useCode: ( i.useCode ? 'true' : 'false' ),
                            useUrn: ( i.useURN ? 'true' : 'false')
                        }
                        if (item.value && item.value.hasOwnProperty('ttValue')) {
                            item.codeValue = item.value['ttValue'];
                            item.urnValue = item.value['urn'];
                            item.labelValue = item.value['l'] ? item.value['l'] : item.value['a'];
                            item.languageNeutral = item.value['z'];

                            if ( item.isLanguageNeutral == 'true' ) {
                                item.value = item.languageNeutral;
                            } else if ( item.useCode == 'true') {
                                item.value = item.codeValue;
                            } else if ( item.useUrn == 'true') {
                                item.value = item.urnValue;
                            } else {
                                item.value = item.labelValue;
                            }
                        }
                        element.items.push(item);
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
                        items: []
                    }
                    for (let i of e1.items) {
                        let item: IEDIMLItem = {
                            id: i['_xml:id'],
                            index: i.index,
                            elementId: i.elementId,
                            codeValue: i.codeValue,
                            datasource: ( i.datasource ? i.datasource.id : '' ),
                            dataType: i.dataType,
                            fixed: ( i.fixed ? 'true' : 'false'),
                            isLanguageNeutral: ( i.isLanguageNeutral ? 'true' : 'false' ),
                            labelValue: i.labelValue,
                            urnValue: i.urnValue,
                            languageNeutral: i.languageNeutral,
                            value: i.value,
                            outIndex: '' + i.outIndex,
                            path: i.path,
                            useCode: ( i.useCode ? 'true' : 'false' ),
                            useUrn: ( i.useURN ? 'true' : 'false')
                        }
                        if (item.value && item.value.hasOwnProperty('ttValue')) {
                            item.codeValue = item.value['ttValue'];
                            item.urnValue = item.value['urn'];
                            item.labelValue = item.value['l'] ? item.value['l'] : item.value['a'];
                            item.languageNeutral = item.value['z'];
                        }
                        element.items.push(item);
                    }
                }
                console.log('pushing element', element.id);
                elements.push(element);
            }
        }

        this
            .elements = elements;
        console
            .log(
                'EDIML'
                ,
                this
            );
    }
}

