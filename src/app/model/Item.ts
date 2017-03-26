import {State} from './State';
import {Utils} from '../utils/Utils';
import {BaseDatasource} from './Datasource';
import {ReplaySubject, BehaviorSubject} from 'rxjs';
import {Visualisation} from './Visualisation';
/**
 * Created by fabio on 05/03/2017.
 */

export interface IValueObject {
    c?: string;
    l?: string;
    uri?: string;
    label?: string;
    languageNeutral?: string;
    urn?: string;
}

export class Item {
    id: string;
    index: number;
    elementId: string;
    path: string;
    dataType: string;
    field: string;
    fixed: boolean;
    useCode?: boolean;
    useURN?: boolean;
    outIndex?: number;
    datasource: BaseDatasource;
    _value: any;
    labelValue: string;
    codeValue: string;
    urnValue: string;
    languageNeutral: string;
    listeningFor: string;
    isLanguageNeutral: boolean;
    label: any[];
    help: any[];
    show: string;
    mandatory: boolean = false;
    private _valueObject: BehaviorSubject<IValueObject> = new BehaviorSubject({});

    valueObject() {
        return this._valueObject.asObservable();
    }

    set value(value: any) {
/*
        console.log('set value', this.id, value);
*/
        this._value = value;
        this._valueObject.next(value);
    }

    get value() {
        return this._value;
    }

    fromTemplateItem(templateItem: any, elementId: string) {
        let i: any = templateItem;

        this.elementId = elementId;
        if (i.label) {
            this.label = (Array.isArray(i.label) ? i.label : [i.label]);
        }
        if (i.help) {
            this.help = (Array.isArray(i.help) ? i.help : [i.help]);
        }
        if (State.templateVersion === 2) {
            this.index = i['_hasIndex'];
            if (i['_xml:id']) {
                this.id = i['_xml:id'];
            } else {
                this.id = this.elementId + '_' + this.index;
            }
            this.path = i['_hasPath'];
            this.fixed = (i['_isFixed'] === 'true');
            this.dataType = i['_hasDatatype'];
            this.field = i['_field'];
            this.useCode = Utils.stringToBoolean(i['_useCode']);
            this.useURN = Utils.stringToBoolean(i['_useURN']);
            this.isLanguageNeutral = Utils.stringToBoolean(i['_isLanguageNeutral']);
            this.outIndex = i['_outIndex'];
            if ( this.dataType === 'autoCompletion' ) {
                this.show = 'autocomplete';
            } else {
                this.show = i['_show'];
            }
            if (i['_datasource']) {
                this.datasource = BaseDatasource.find(i['_datasource']);
                console.log('item', this.id, 'datasource', i['_datasource'], this.datasource);
            }
        } else {
            this.index = i['hasIndex'];
            this.id = this.elementId + '_' + this.index;
            this.path = i['hasPath'];
            this.fixed = i['isFixed'];
            this.dataType = i['hasDatatype'];
            this.useCode = Utils.stringToBoolean(i['useCode']);
            this.useURN = Utils.stringToBoolean(i['useURN']);
            this.isLanguageNeutral = Utils.stringToBoolean(i['isLanguageNeutral']);
            this.outIndex = i['outIndex'];
            this.show = i['show'];
            this.datasource = BaseDatasource.find(i['datasource']);
        }

        if (!this.show) {
            this.show = Visualisation.findFor(this.dataType);
/*
            switch (this.dataType) {
                case 'text':
                    this.show = 'textarea';
                    break;
                case 'string':
                    this.show = 'textbox';
                    break;
                case 'boolean':
                    this.show = 'boolean';
                    break;
                case 'codelist':
                    this.show = 'combobox';
                    break;
                default:
                    this.show = 'textbox';
            }
*/
        }

    }
}
