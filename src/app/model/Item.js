"use strict";
var State_1 = require('./State');
var Utils_1 = require('../utils/Utils');
var Datasource_1 = require('./Datasource');
var rxjs_1 = require('rxjs');
var Item = (function () {
    function Item() {
        this.mandatory = false;
        this._valueObject = new rxjs_1.BehaviorSubject({});
    }
    Item.prototype.valueObject = function () {
        return this._valueObject.asObservable();
    };
    Object.defineProperty(Item.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            console.log('set value', this.id, value);
            this._value = value;
            this._valueObject.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Item.prototype.fromTemplateItem = function (templateItem, elementId) {
        var i = templateItem;
        this.elementId = elementId;
        if (i.label) {
            this.label = (Array.isArray(i.label) ? i.label : [i.label]);
        }
        if (i.help) {
            this.help = (Array.isArray(i.help) ? i.help : [i.help]);
        }
        if (State_1.State.templateVersion === 2) {
            this.index = i['_hasIndex'];
            if (i['_xml:id']) {
                this.id = i['_xml:id'];
            }
            else {
                this.id = this.elementId + '_' + this.index;
            }
            this.path = i['_hasPath'];
            this.fixed = (i['_isFixed'] === 'true');
            this.dataType = i['_hasDatatype'];
            this.field = i['_field'];
            this.useCode = Utils_1.Utils.stringToBoolean(i['_useCode']);
            this.useURN = Utils_1.Utils.stringToBoolean(i['_useURN']);
            this.isLanguageNeutral = Utils_1.Utils.stringToBoolean(i['_isLanguageNeutral']);
            this.outIndex = i['_outIndex'];
            if (this.dataType === 'autoCompletion') {
                this.show = 'autocomplete';
            }
            else {
                this.show = i['_show'];
            }
            if (i['_datasource']) {
                this.datasource = Datasource_1.BaseDatasource.find(i['_datasource']);
                console.log('item', this.id, 'datasource', i['_datasource'], this.datasource);
            }
        }
        else {
            this.index = i['hasIndex'];
            this.id = this.elementId + '_' + this.index;
            this.path = i['hasPath'];
            this.fixed = i['isFixed'];
            this.dataType = i['hasDatatype'];
            this.useCode = Utils_1.Utils.stringToBoolean(i['useCode']);
            this.useURN = Utils_1.Utils.stringToBoolean(i['useURN']);
            this.isLanguageNeutral = Utils_1.Utils.stringToBoolean(i['isLanguageNeutral']);
            this.outIndex = i['outIndex'];
            this.show = i['show'];
            this.datasource = Datasource_1.BaseDatasource.find(i['datasource']);
        }
        if (!this.show) {
            switch (this.dataType) {
                case 'text':
                    this.show = 'textarea';
                    break;
                case 'string':
                    this.show = 'textbox';
                    break;
                case 'codelist':
                    this.show = 'combobox';
                    break;
                default:
                    this.show = 'textbox';
            }
        }
    };
    return Item;
}());
exports.Item = Item;
