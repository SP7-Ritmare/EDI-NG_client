import {Item} from './Item';
import {State} from './State';
import {Utils} from '../utils/Utils';
import {IEDIMLElement} from './EDIML';
import {availableContexts, Logger} from '../utils/logger';
import {MetadataService} from '../components/service/MetadataService';
/**
 * Created by fabio on 05/03/2017.
 */
const cloneSuffix = "_XritX";

export class Element {
    static logger = new Logger(availableContexts.ELEMENT);
    static metadataService: MetadataService;
    id: string = undefined;
    root: string = undefined;
    mandatory: boolean = undefined;
    multiple: boolean = undefined;
    represents_element: string = undefined;
    alternativeTo: string;
    items: Item[];
    label: any[];
    help: any[];

    fromTemplateElement(templateElement: any) {
        let e: any = templateElement;

        this.root = e.hasRoot;
        if ( e.label ) {
            this.label = (Array.isArray(e.label) ? e.label : [e.label]);
        }
        if ( e.help ) {
            this.help = (Array.isArray(e.help) ? e.help : [e.help]);
        }
        if ( Element.metadataService.state.templateVersion === 2 ) {
            this.id = e['_xml:id'];
            this.mandatory = Utils.stringToBoolean(e['_isMandatory']);
            this.multiple = Utils.stringToBoolean(e['_isMultiple']);
        } else {
            this.id = e['id'];
            this.mandatory = Utils.stringToBoolean(e['isMandatory']);
            this.multiple = Utils.stringToBoolean(e['isMultiple']);
        }

        let items: Item[] = [];
        for ( let item of e.produces.item ) {
            let i: Item = new Item();
            i.fromTemplateItem(item, this.id);
            if ( this.mandatory ) {
                i.mandatory = true;
            }
            items.push(i);
        }
        this.items = items;
        this.represents_element = this.id;
    }

    fromEDIML(e: IEDIMLElement) {
        function getItem(e: any, id: string) {
            Element.logger.log('fromEDIML', 'getItem', e, id);
            for ( let i of e.items ) {
                if ( i.id == id ) {
                    return i;
                }
            }
        }
        var _ = require('lodash');
        Element.logger.log('fromEDIML', e);
        this.id = e.id;
        this.alternativeTo = e.alternativeTo;
        this.represents_element = e.represents_element;
        let items: Item[] = [];
        Element.logger.log('fromEDIML element items', e.items);
        for ( let i of this.items ) {
            let item = _.cloneDeep(i); // Object.assign({}, i);
            item.id = i.id;
            item.elementId = this.id;
            if ( i.datasource ) {
                let ds = i.datasource.duplicate();
                if ( ds.triggerItem ) {
                    ds.triggerItem = ds.triggerItem;
                    ds.fixTriggerItem();
                }
                Element.logger.log('duplicated datasource', ds);
                item.datasource = ds;
            }
            let newItem = getItem(e, i.id);
            if ( newItem ) {
                item.codeValue = newItem.codeValue;
                item.labelValue = newItem.labelValue;
                item.urnValue = newItem.urnValue;
                item.languageNeutral = newItem.languageNeutral;
                item.value = newItem.value;

            } else {
                if ( i.dataType == 'boundingBox' ) {
                    const templateItem = Element.metadataService.state.getItem(i.id);
                    Element.logger.log('boundingBox found', getItem(e, i.id + '_westLongitude'));
                    let westLong = getItem(e, i.id + '_westLongitude');
                    item.westLongitude = {
                        label: templateItem.westLongitude.label,
                        hasPath: westLong.path,
                        value: westLong.value
                    }
                    let eastLong = getItem(e, i.id + '_eastLongitude');
                    item.eastLongitude = {
                        label: templateItem.eastLongitude.label,
                        hasPath: eastLong.path,
                        value: eastLong.value
                    }
                    let northLat = getItem(e, i.id + '_northLatitude');
                    item.northLatitude = {
                        label: templateItem.northLatitude.label,
                        hasPath: northLat.path,
                        value: northLat.value
                    }
                    let southLat = getItem(e, i.id + '_southLatitude');
                    item.southLatitude = {
                        label: templateItem.southLatitude.label,
                        hasPath: southLat.path,
                        value: southLat.value
                    }

                    Element.logger.log('fromEDIML - partial item', item);
                }
                Element.logger.log('ERROR - newItem is undefined', i.id);
            }
            Element.logger.log('fromEDIML newItem', newItem);

            Element.logger.log('fromEDIML adding item', item);
            items.push(item);
        }
        this.items = items;
    }

    duplicate() {
        var _ = require('lodash');
        Element.logger.log('duplicate', this);
        let tempElement = _.cloneDeep(this); //  Object.assign({}, this);
        let instances = Element.metadataService.state.getElementInstances(this.represents_element);
        Element.logger.log('instances of', this.id, instances);
        let latestInstance: string = '';
        for ( let e of instances ) {
            if ( e.id.length > latestInstance.length ) {
                latestInstance = e.id;
            }
        }
        Element.logger.log('latestInstance: ' + latestInstance, instances);
        tempElement.id = latestInstance + cloneSuffix;
        let items: Item[] = [];
        Element.logger.log('duplicating element ' + this.id + " -> " + tempElement.id);
        Element.logger.log('duplicate element items', tempElement.items);
        for ( let i of tempElement.items ) {
            let item = _.cloneDeep(i); // Object.assign({}, i);
            item.id = i.id.replace(this.id, tempElement.id);
            item.elementId = tempElement.id;
            if ( i.datasource ) {
                let ds = i.datasource.duplicate();
                if ( ds.triggerItem ) {
                    ds.triggerItem = ds.triggerItem.replace(this.id, tempElement.id);
                    ds.fixTriggerItem();
                }
                Element.logger.log('duplicated datasource', ds);
                item.datasource = ds;
            }
            item.resetToInitialValue();
            items.push(item);
        }
        tempElement.items = items;
        Element.metadataService.state.appendElement(tempElement);
    }

    remove() {
        Element.metadataService.state.removeElement(this);
    }

    get fixed() {
        // Element.logger.log('element', this.id);
        let atLeastOneNotFixed = false;
        for ( let i of this.items ) {
            // Element.logger.log('item', i, i.fixed);
            if ( !i.fixed ) {
                // Element.logger.log('ok, not fixed');
                atLeastOneNotFixed = true;
            }
        }
        // Element.logger.log('fixed element');
        return !atLeastOneNotFixed;
    }
}
