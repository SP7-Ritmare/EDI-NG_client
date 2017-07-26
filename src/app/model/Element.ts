import {Item} from './Item';
import {State} from './State';
import {Utils} from '../utils/Utils';
import {IEDIMLElement} from './EDIML';
/**
 * Created by fabio on 05/03/2017.
 */
const cloneSuffix = "_XritX";

export class Element {
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
        if ( State.templateVersion === 2 ) {
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
            console.log('fromEDIML', 'getItem', e, id);
            for ( let i of e.items ) {
                if ( i.id == id ) {
                    return i;
                }
            }
        }
        var _ = require('lodash');
        console.log('fromEDIML', e);
        this.id = e.id;
        this.alternativeTo = e.alternativeTo;
        this.represents_element = e.represents_element;
        let items: Item[] = [];
        console.log('fromEDIML element items', e.items);
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
                console.log('duplicated datasource', ds);
                item.datasource = ds;
            }
            let newItem = getItem(e, i.id);
            console.log('fromEDIML newItem', newItem);

            item.codeValue = newItem.codeValue;
            item.labelValue = newItem.labelValue;
            item.urnValue = newItem.urnValue;
            item.languageNeutral = newItem.languageNeutral;
            item.value = newItem.value;

            console.log('fromEDIML adding item', item);
            items.push(item);
        }
        this.items = items;
    }

    duplicate() {
        var _ = require('lodash');
        console.log('duplicate', this);
        let tempElement = _.cloneDeep(this); //  Object.assign({}, this);
        let instances = State.getElementInstances(this.represents_element);
        console.log('instances of', this.id, instances);
        let latestInstance: string = '';
        for ( let e of instances ) {
            if ( e.id.length > latestInstance.length ) {
                latestInstance = e.id;
            }
        }
        console.log('latestInstance: ' + latestInstance, instances);
        tempElement.id = latestInstance + cloneSuffix;
        let items: Item[] = [];
        console.log('duplicating element ' + this.id + " -> " + tempElement.id);
        console.log('duplicate element items', tempElement.items);
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
                console.log('duplicated datasource', ds);
                item.datasource = ds;
            }
            item.resetToInitialValue();
            items.push(item);
        }
        tempElement.items = items;
        State.appendElement(tempElement);
    }

    remove() {
        State.removeElement(this);
    }

    get fixed() {
        // console.log('element', this.id);
        let atLeastOneNotFixed = false;
        for ( let i of this.items ) {
            // console.log('item', i, i.fixed);
            if ( !i.fixed ) {
                // console.log('ok, not fixed');
                atLeastOneNotFixed = true;
            }
        }
        // console.log('fixed element');
        return !atLeastOneNotFixed;
    }
}
