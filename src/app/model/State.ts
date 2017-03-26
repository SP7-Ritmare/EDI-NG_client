import {ITemplate} from './Template';
import {Item} from './Item';
import {Element} from './Element';
/**
 * Created by fabio on 06/03/2017.
 */
export class State {
    static templateName: string;
    static templateVersion: number;
    static interfaceLanguage: string;
    static template: ITemplate;

    static getElement(id: string): Element {
        for ( let g of State.template.group ) {
            for ( let e of g.element ) {
                if ( e.id === id ) {
                    return e;
                }
            }
        }
        return undefined;
    }

    static getElementInstances(id: string) {
        let temp: Element[] = [];
        for ( let g of State.template.group ) {
            for ( let e of g.element ) {
                if ( e.represents_element === id ) {
                    temp.push(e);
                }
            }
        }
        return temp;
    }

    private static findElementGroup(e: Element) {
        for ( let g of State.template.group ) {
            for ( let el of g.element ) {
                console.log('findElementGroup', e.id, el.id)
                if ( el.id === e.represents_element ) {
                    return g;
                }
            }
        }
        return undefined;
    }

    private static findIndexOfElement(id: string) {
        for ( let g of State.template.group ) {
            for ( let i = 0; i < g.element.length; i++ ) {
                let e = g.element[i];
                if ( e.id === id ) {
                    return i;
                }
            }
        }
        return -1;
    }

    private static findLastIndexOfBaseElement(id: string) {
        let last = 0;
        for ( let g of State.template.group ) {
            for ( let i = 0; i < g.element.length; i++ ) {
                let e = g.element[i];
                if ( e.represents_element === id ) {
                    last = i;
                }
            }
        }
        return last;
    }

    static findLastInstanceOfBaseElement(id: string) {
        let last: string;
        for ( let g of State.template.group ) {
            for ( let i = 0; i < g.element.length; i++ ) {
                let e = g.element[i];
                if ( e.represents_element === id ) {
                    last = e.id;
                }
            }
        }
        return last;
    }
    static appendElement(e: Element) {
        let g = State.findElementGroup(e);
        let i = State.findLastIndexOfBaseElement(e.represents_element);
        console.log('appendElement', g, i);
        if ( g.element.length > i + 1 ) {
            g.element.splice(i+1, 0, e);
        } else {
            g.element.push(e);
        }
        console.log('appendElement OUT', g.element);
    }

    static removeElement(e: Element) {
        let g = State.findElementGroup(e);
        let i = State.findIndexOfElement(e.id);
        console.log('removeElement', e.id, g, i);
        if ( i > -1 ) {
            g.element.splice(i, 1);
        }
        console.log('removeElement OUT', e.id, g, i);
    }

    static getItem(id: string): Item {
        console.log('getItem', id);
        for ( let g of State.template.group ) {
            for ( let e of g.element ) {
                for ( let i of e.items ) {
                    if ( i.id === id ) {
                        console.log('getItem found', i);
                        return i;
                    }
                }
            }
        }
        return undefined;
    }
}
