"use strict";
/**
 * Created by fabio on 06/03/2017.
 */
var State = (function () {
    function State() {
    }
    State.getElement = function (id) {
        for (var _i = 0, _a = State.template.group; _i < _a.length; _i++) {
            var g = _a[_i];
            for (var _b = 0, _c = g.element; _b < _c.length; _b++) {
                var e = _c[_b];
                if (e.id === id) {
                    return e;
                }
            }
        }
        return undefined;
    };
    State.getElementInstances = function (id) {
        var temp = [];
        for (var _i = 0, _a = State.template.group; _i < _a.length; _i++) {
            var g = _a[_i];
            for (var _b = 0, _c = g.element; _b < _c.length; _b++) {
                var e = _c[_b];
                if (e.represents_element === id) {
                    temp.push(e);
                }
            }
        }
        return temp;
    };
    State.findElementGroup = function (e) {
        for (var _i = 0, _a = State.template.group; _i < _a.length; _i++) {
            var g = _a[_i];
            for (var _b = 0, _c = g.element; _b < _c.length; _b++) {
                var el = _c[_b];
                console.log('findElementGroup', e.id, el.id);
                if (el.id === e.represents_element) {
                    return g;
                }
            }
        }
        return undefined;
    };
    State.findIndexOfElement = function (id) {
        for (var _i = 0, _a = State.template.group; _i < _a.length; _i++) {
            var g = _a[_i];
            for (var i = 0; i < g.element.length; i++) {
                var e = g.element[i];
                if (e.id === id) {
                    return i;
                }
            }
        }
        return -1;
    };
    State.findLastIndexOfBaseElement = function (id) {
        var last = 0;
        for (var _i = 0, _a = State.template.group; _i < _a.length; _i++) {
            var g = _a[_i];
            for (var i = 0; i < g.element.length; i++) {
                var e = g.element[i];
                if (e.represents_element === id) {
                    last = i;
                }
            }
        }
        return last;
    };
    State.findLastInstanceOfBaseElement = function (id) {
        var last;
        for (var _i = 0, _a = State.template.group; _i < _a.length; _i++) {
            var g = _a[_i];
            for (var i = 0; i < g.element.length; i++) {
                var e = g.element[i];
                if (e.represents_element === id) {
                    last = e.id;
                }
            }
        }
        return last;
    };
    State.appendElement = function (e) {
        var g = State.findElementGroup(e);
        var i = State.findLastIndexOfBaseElement(e.represents_element);
        console.log('appendElement', g, i);
        if (g.element.length > i + 1) {
            g.element.splice(i + 1, 0, e);
        }
        else {
            g.element.push(e);
        }
        console.log('appendElement OUT', g.element);
    };
    State.removeElement = function (e) {
        var g = State.findElementGroup(e);
        var i = State.findIndexOfElement(e.id);
        console.log('removeElement', e.id, g, i);
        if (i > -1) {
            g.element.splice(i, 1);
        }
        console.log('removeElement OUT', e.id, g, i);
    };
    State.getItem = function (id) {
        console.log('getItem', id);
        for (var _i = 0, _a = State.template.group; _i < _a.length; _i++) {
            var g = _a[_i];
            for (var _b = 0, _c = g.element; _b < _c.length; _b++) {
                var e = _c[_b];
                for (var _d = 0, _e = e.items; _d < _e.length; _d++) {
                    var i = _e[_d];
                    if (i.id === id) {
                        console.log('getItem found', i);
                        return i;
                    }
                }
            }
        }
        return undefined;
    };
    return State;
}());
exports.State = State;
