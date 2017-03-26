"use strict";
var Item_1 = require('./Item');
var State_1 = require('./State');
var Utils_1 = require('../utils/Utils');
/**
 * Created by fabio on 05/03/2017.
 */
var cloneSuffix = "_XritX";
var Element = (function () {
    function Element() {
        this.id = undefined;
        this.root = undefined;
        this.mandatory = undefined;
        this.multiple = undefined;
        this.represents_element = undefined;
    }
    Element.prototype.fromTemplateElement = function (templateElement) {
        var e = templateElement;
        this.root = e.hasRoot;
        if (e.label) {
            this.label = (Array.isArray(e.label) ? e.label : [e.label]);
        }
        if (e.help) {
            this.help = (Array.isArray(e.help) ? e.help : [e.help]);
        }
        if (State_1.State.templateVersion === 2) {
            this.id = e['_xml:id'];
            this.mandatory = Utils_1.Utils.stringToBoolean(e['_isMandatory']);
            this.multiple = Utils_1.Utils.stringToBoolean(e['_isMultiple']);
        }
        else {
            this.id = e['id'];
            this.mandatory = Utils_1.Utils.stringToBoolean(e['isMandatory']);
            this.multiple = Utils_1.Utils.stringToBoolean(e['isMultiple']);
        }
        var items = [];
        for (var _i = 0, _a = e.produces.item; _i < _a.length; _i++) {
            var item = _a[_i];
            var i = new Item_1.Item();
            i.fromTemplateItem(item, this.id);
            if (this.mandatory) {
                i.mandatory = true;
            }
            items.push(i);
        }
        this.items = items;
        this.represents_element = this.id;
    };
    Element.prototype.duplicate = function () {
        var _ = require('lodash');
        console.log('duplicate', this);
        var tempElement = _.cloneDeep(this); //  Object.assign({}, this);
        var instances = State_1.State.getElementInstances(this.represents_element);
        var latestInstance = '';
        for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
            var e = instances_1[_i];
            if (e.id.length > latestInstance.length) {
                latestInstance = e.id;
            }
        }
        console.log('latestInstance: ' + latestInstance, instances);
        tempElement.id = latestInstance + cloneSuffix;
        var items = [];
        console.log('duplicating element ' + this.id + " -> " + tempElement.id);
        console.log('duplicate element items', tempElement.items);
        for (var _a = 0, _b = tempElement.items; _a < _b.length; _a++) {
            var i = _b[_a];
            var item = _.cloneDeep(i); // Object.assign({}, i);
            item.id = i.id.replace(this.id, tempElement.id);
            item.elementId = tempElement.id;
            items.push(item);
        }
        tempElement.items = items;
        State_1.State.appendElement(tempElement);
    };
    Element.prototype.remove = function () {
        State_1.State.removeElement(this);
    };
    Object.defineProperty(Element.prototype, "fixed", {
        get: function () {
            // console.log('element', this.id);
            var atLeastOneNotFixed = false;
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var i = _a[_i];
                // console.log('item', i, i.fixed);
                if (!i.fixed) {
                    // console.log('ok, not fixed');
                    atLeastOneNotFixed = true;
                }
            }
            // console.log('fixed element');
            return !atLeastOneNotFixed;
        },
        enumerable: true,
        configurable: true
    });
    return Element;
}());
exports.Element = Element;
