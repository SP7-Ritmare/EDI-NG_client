"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by fabio on 05/03/2017.
 */
var core_1 = require('@angular/core');
var State_1 = require('../../model/State');
var EdiElementComponent = (function () {
    function EdiElementComponent() {
        this.interfaceLanguage = State_1.State.interfaceLanguage;
    }
    EdiElementComponent.prototype.duplicateElement = function () {
        console.log('start duplication of element', this.element);
        this.element.duplicate();
    };
    EdiElementComponent.prototype.removeElement = function () {
        this.element.remove();
    };
    EdiElementComponent.prototype.showButton = function () {
        if (this.element.multiple && this.element.id === State_1.State.findLastInstanceOfBaseElement(this.element.represents_element)) {
            return true;
        }
        return false;
    };
    EdiElementComponent.prototype.showRemoveButton = function () {
        if (this.element.multiple && this.element.id !== this.element.represents_element) {
            return true;
        }
        return false;
    };
    EdiElementComponent.prototype.showTitle = function () {
        if (this.element.multiple && this.element.id === this.element.represents_element) {
            return true;
        }
        return false;
    };
    __decorate([
        core_1.Input()
    ], EdiElementComponent.prototype, "element", void 0);
    EdiElementComponent = __decorate([
        core_1.Component({
            selector: 'app-edi-element',
            templateUrl: './edi-element-component.html',
            styleUrls: ['./edi-element-component.css'],
            providers: []
        })
    ], EdiElementComponent);
    return EdiElementComponent;
}());
exports.EdiElementComponent = EdiElementComponent;
