import {ITemplate} from './Template';
import {Item} from './Item';
import {Element} from './Element';
import {BehaviorSubject, Observable} from 'rxjs';
import {AlternativeGroup} from './AlternativeGroup';
import {MetadataService} from '../components/service/MetadataService';
/**
 * Created by fabio on 06/03/2017.
 */
export class State {
    static templateName: string;
    static templateVersion: number;
    static _interfaceLanguage: BehaviorSubject<string> = new BehaviorSubject('en');
    static template: ITemplate;
    static originalTemplate: string;
    static metadataService: MetadataService;
    static queryParameters: any;

    static set interfaceLanguage(value: string) {
        State._interfaceLanguage.next(value);
    }

    static get interfaceLanguage() {
        return this._interfaceLanguage.value;
    }

    static getQuerystringParameter(name: string) {
        return State.queryParameters[name];
    }

    static getElement(id: string): Element {
        for (let g of State.template.group) {
            for (let e of g.element) {
                if (e instanceof Element && e.id === id) {
                    return (e as Element);
                } else {
                    if (e instanceof AlternativeGroup) {
                        let e1 = (e as AlternativeGroup);
                        if (e1.elements) {
                            for (let ee of e1.elements) {
                                if (ee.id === id) {
                                    return ee;
                                }
                            }
                        }
                    }
                }
            }
        }
        return undefined;
    }

    static getElementInstances(id: string) {
        let temp: (AlternativeGroup | Element)[] = [];
        for (let g of State.template.group) {
            for (let e of g.element) {
                if (e instanceof Element) {
                    console.log('getElementInstances', 'comparing', e['represents_element'], id);
                    if (e['represents_element'] === id) {
                        console.log('getElementInstances', 'found', e['id'], id);
                        temp.push(e);
                    }
                } else if (e instanceof AlternativeGroup) {
                    let e1 = (e as AlternativeGroup);
                    if (e1.elements) {
                        for (let ee of e1.elements) {
                            console.log('getElementInstances', 'comparing', ee['represents_element'], id);
                            if (ee['represents_element'] === id) {
                                console.log('getElementInstances', 'found', ee['id'], id);
                                temp.push(ee);
                            }
                        }
                    }
                }


            }
        }
        return temp;
    }

    private static findElementGroup(e: Element) {
        for (let g of State.template.group) {
            for (let el of g.element) {
                console.log('findElementGroup', e.id, el.id)
                if (el.id === e.represents_element) {
                    return g;
                }
            }
        }
        return undefined;
    }

    private static findIndexOfElement(id: string) {
        for (let g of State.template.group) {
            for (let i = 0; i < g.element.length; i++) {
                let e = g.element[i];
                if (e.id === id) {
                    return i;
                }
            }
        }
        return -1;
    }

    private static findLastIndexOfBaseElement(id: string) {
        let last = 0;
        for (let g of State.template.group) {
            for (let i = 0; i < g.element.length; i++) {
                let e = g.element[i];
                if (e['represents_element'] === id) {
                    last = i;
                }
            }
        }
        return last;
    }

    static findLastInstanceOfBaseElement(id: string) {
        let last: string;
        for (let g of State.template.group) {
            for (let i = 0; i < g.element.length; i++) {
                let e = g.element[i];
                if (e['represents_element'] === id) {
                    last = e.id;
                } else if (!e.hasOwnProperty('represents_element')) {
                    // console.log(e);
//                    throw 'missing property \'represents_element\' on ' + id;
                }
            }
        }
        return last;
    }

    static appendElement(e: Element) {
        let g = State.findElementGroup(e);
        let i = State.findLastIndexOfBaseElement(e.represents_element);
        console.log('appendElement', g, i);
        if (g.element.length > i + 1) {
            g.element.splice(i + 1, 0, e);
        } else {
            g.element.push(e);
        }
        console.log('appendElement OUT', g.element);
    }

    static removeElement(e: Element) {
        let g = State.findElementGroup(e);
        let i = State.findIndexOfElement(e.id);
        console.log('removeElement', e.id, g, i);
        if (i > -1) {
            g.element.splice(i, 1);
        }
        console.log('removeElement OUT', e.id, g, i);
    }

    static getItem(id: string): Item {
        console.log('getItem', id);
        for (let g of State.template.group) {
            for (let e of g.element) {
                if (e instanceof Element) {
                    for (let i of (e as Element).items) {
                        if (i.id === id) {
                            console.log('getItem found', i);
                            return i;
                        }
                    }
                }
            }
        }
        return undefined;
    }

    static mergeWithEDIML(ediml: any) {
        for ( let e of ediml.elements ) {
            console.log('EDIML', 'doing element', e.id, e.represents_element);
            if ( e.id == e.represents_element ) {
                // base element
                let element = State.getElement(e.id);
                console.log('EDIML', 'found element', element);
                element.fromEDIML(e);
            } else {
                // duplicate element
                let element = State.getElement(e.represents_element);
                element.duplicate();
                element = State.getElement(e.id);
                element.fromEDIML(e);
            }
        }
    }

}
