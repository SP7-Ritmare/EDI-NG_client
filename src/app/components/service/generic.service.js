"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var rxjs_1 = require('rxjs');
var GenericService = (function () {
    function GenericService(http) {
        this.http = http;
        this.baseUrl = 'https://enygma.it/rupesBO/';
        this.dataStore = { categories: [] };
        this._categories = new rxjs_1.BehaviorSubject([]);
    }
    GenericService.prototype.getCategories = function () {
        var _this = this;
        this.http.get(this.baseUrl + 'categories')
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.dataStore.categories = data;
            _this._categories.next(Object.assign({}, _this.dataStore).categories);
        }, function (err) { return console.log('GenericService.getCategories', err); });
    };
    Object.defineProperty(GenericService.prototype, "categories", {
        get: function () {
            return this._categories.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    GenericService = __decorate([
        core_1.Injectable()
    ], GenericService);
    return GenericService;
}());
exports.GenericService = GenericService;
