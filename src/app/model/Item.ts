import {State} from './State';
import {Utils} from '../utils/Utils';
import {BaseDatasource} from './Datasource';
import {ReplaySubject, BehaviorSubject} from 'rxjs';
import {Visualisation} from './Visualisation';
import {MetadataService} from '../components/service/MetadataService';
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
  static metadataService: MetadataService;
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
    mandatory = false;
    defaultValue: string;
    private _valueObject: BehaviorSubject<IValueObject> = new BehaviorSubject({});

    valueObject() {
        return this._valueObject;
    }

    set value(value: any) {
        console.log('set value', this.id, value);
        this._value = value;
        this._valueObject.next(value);
    }

    get value() {
        return this._value;
    }

    fromTemplateItem(templateItem: any, elementId: string) {
        let i: any = templateItem;

        console.log('fromTemplateItem', i);
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
            this.path = i['hasPath'];
            // this.value = i['hasValue'];
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
            if ( i.hasValue ) {
                if ( this.dataType === 'codelist' ) {
                    this.codeValue = i.hasValue;
                    this.value = '';
                } else if ( this.dataType === 'boolean' ) {
                    this.value = ( i.hasValue === 'true' );
                } else if ( this.dataType === 'sensorID' ) {
                    console.log('sensorID', i);
                    if ( i.hasValue === 'auto' ) {
                        this.value = Item.metadataService.generateSensorId();
                    }
                } else {
                    console.log('fromTemplateItem', this.id, 'else', this.dataType);
                    this.value = i.hasValue;
                }
            }

            if ( i.defaultValue ) {
                this.defaultValue = i.defaultValue;
                if ( this.dataType === 'codelist' ) {
                    this.codeValue = i.defaultValue;
                    this.value = '';
                } else if ( this.dataType === 'boolean' ) {
                    this.value = ( i.defaultValue === 'true' );
                } else {
                    this.value = i.defaultValue;
                }
            }

            if (!this.show) {
                this.show = Visualisation.findFor(this.dataType);
            }

        } else {
            /**
             * TODO: implement version 1 template support
             */
            /*
            this.index = i['hasIndex'];
            this.id = this.element_id + '_' + this.index;
            this.path = i['hasPath'];
            this.fixed = i['isFixed'];
            this.dataType = i['hasDatatype'];
            this.useCode = Utils.stringToBoolean(i['useCode']);
            this.useURN = Utils.stringToBoolean(i['useURN']);
            this.isLanguageNeutral = Utils.stringToBoolean(i['isLanguageNeutral']);
            this.outIndex = i['outIndex'];
            this.show = i['show'];
            this.datasource = BaseDatasource.find(i['datasource']);
*/
        }


    }
}
