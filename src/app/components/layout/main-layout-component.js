/**
 * Created by fabio on 02/03/2017.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var EDITemplate_1 = require('../service/EDITemplate');
var Template_1 = require('../../model/Template');
var State_1 = require('../../model/State');
// const templateUrl = '../assets/RNDT_dataset_v4.00.xml';
var templateUrl = 'assets/SensorML20_lightweight_v1.00_forLTER_newSchema.xml';
var MainLayoutComponent = (function () {
    function MainLayoutComponent(EDITemplate) {
        var _this = this;
        this.EDITemplate = EDITemplate;
        this.interfaceLanguage = 'en';
        this.template = new Template_1.Template();
        console.log('about to load template', templateUrl);
        this.EDITemplate.load(templateUrl)
            .subscribe(function (res) {
            _this.template = res;
            _this.title = State_1.State.templateName;
            console.log('Template loaded: ', res);
        });
    }
    MainLayoutComponent = __decorate([
        core_1.Component({
            selector: 'app-main-layout',
            templateUrl: './main-layout-component.html',
            styleUrls: ['./main-layout-component.css'],
            providers: [EDITemplate_1.EDITemplate]
        })
    ], MainLayoutComponent);
    return MainLayoutComponent;
}());
exports.MainLayoutComponent = MainLayoutComponent;
