/**
 * Created by fabio on 06/03/2017.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var edi_item_component_1 = require('../edi-item-component');
var EdiTextboxComponent = (function (_super) {
    __extends(EdiTextboxComponent, _super);
    function EdiTextboxComponent() {
        _super.apply(this, arguments);
    }
    EdiTextboxComponent.prototype.ngOnInit = function () {
        if (this.item && this.item.dataType === 'real') {
            this.pattern = '^[0-9]*$';
        }
    };
    __decorate([
        core_1.Input()
    ], EdiTextboxComponent.prototype, "item", void 0);
    EdiTextboxComponent = __decorate([
        core_1.Component({
            selector: 'app-edi-textbox',
            template: "\n        <!--<pre>{{item | json}}</pre>-->\n        <input class=\"form-control\" #pippo=\"ngModel\" type=\"text\" [attr.name]=\"item.id\" placeholder=\"{{item.mandatory}}\" [(ngModel)]=\"item.value\" pattern=\"{{pattern}}\" [required]=\"item.mandatory\">\n        <!--<div class=\"alert alert-danger\" *ngIf=\"!pippo.valid && pippo.touched\">Mandatory field</div>-->\n    ",
            styleUrls: ['./edi-textbox-component.css'],
            providers: []
        })
    ], EdiTextboxComponent);
    return EdiTextboxComponent;
}(edi_item_component_1.EdiItemComponent));
exports.EdiTextboxComponent = EdiTextboxComponent;
