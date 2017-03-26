/**
 * Created by fabio on 06/03/2017.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var State_1 = require('../../model/State');
var EdiItemComponent = (function () {
    function EdiItemComponent() {
    }
    EdiItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.interfaceLanguage = State_1.State.interfaceLanguage;
        console.log('init text box', this.item.id, this.item.datasource, this.item.dataType);
        if (this.item.datasource && this.item.dataType === 'select') {
            // this.item.datasource.refresh();
            this.item.datasource._currentRow.subscribe(function (res) {
                console.log('ds change on item', _this.item.id, res, _this.item);
                _this.item.value = res[_this.item.field];
            }, function (err) {
                console.log('ds change error', err);
            }, function () {
                console.log('ds change complete');
            });
        }
    };
    __decorate([
        core_1.Input()
    ], EdiItemComponent.prototype, "item", void 0);
    EdiItemComponent = __decorate([
        core_1.Component({
            selector: 'app-edi-item',
            templateUrl: './edi-item-component.html',
            styleUrls: [],
            providers: []
        })
    ], EdiItemComponent);
    return EdiItemComponent;
}());
exports.EdiItemComponent = EdiItemComponent;
