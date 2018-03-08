import {ITemplate} from './Template';
import {Item} from './Item';
import {Element} from './Element';
import {BehaviorSubject, Observable} from 'rxjs';
import {AlternativeGroup} from './AlternativeGroup';
import {MetadataService} from '../components/service/MetadataService';
import {availableContexts, Logger} from '../utils/logger';
/**
 * Created by fabio on 06/03/2017.
 */
export class State {
    static logger = new Logger(availableContexts.STATE);
    templateName: string;
    templateVersion: number;
    _interfaceLanguage: BehaviorSubject<string> = new BehaviorSubject('en');
    template: ITemplate;
    originalTemplate: string;
    metadataService: MetadataService;
    queryParameters: any;

    set interfaceLanguage(value: string) {
        this._interfaceLanguage.next(value);
    }

    get interfaceLanguage() {
        return this._interfaceLanguage.value;
    }

    getQuerystringParameter(name: string) {
        return this.queryParameters[name];
    }

    getElement(id: string): Element {
        for (let g of this.template.group) {
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

    getElementInstances(id: string) {
        let temp: (AlternativeGroup | Element)[] = [];
        for (let g of this.template.group) {
            for (let e of g.element) {
                if (e instanceof Element) {
                    State.logger.log('getElementInstances', 'comparing', e['represents_element'], id);
                    if (e['represents_element'] === id) {
                        State.logger.log('getElementInstances', 'found', e['id'], id);
                        temp.push(e);
                    }
                } else if (e instanceof AlternativeGroup) {
                    let e1 = (e as AlternativeGroup);
                    if (e1.elements) {
                        for (let ee of e1.elements) {
                            State.logger.log('getElementInstances', 'comparing', ee['represents_element'], id);
                            if (ee['represents_element'] === id) {
                                State.logger.log('getElementInstances', 'found', ee['id'], id);
                                temp.push(ee);
                            }
                        }
                    }
                }


            }
        }
        return temp;
    }

    private findElementGroup(e: Element) {
        for (let g of this.template.group) {
            for (let el of g.element) {
                State.logger.log('findElementGroup', e.id, el.id)
                if (el.id === e.represents_element) {
                    return g;
                }
            }
        }
        return undefined;
    }

    private findIndexOfElement(id: string) {
        for (let g of this.template.group) {
            for (let i = 0; i < g.element.length; i++) {
                let e = g.element[i];
                if (e.id === id) {
                    return i;
                }
            }
        }
        return -1;
    }

    private findLastIndexOfBaseElement(id: string) {
        let last = 0;
        for (let g of this.template.group) {
            for (let i = 0; i < g.element.length; i++) {
                let e = g.element[i];
                if (e['represents_element'] === id) {
                    last = i;
                }
            }
        }
        return last;
    }

    findLastInstanceOfBaseElement(id: string) {
        let last: string;
        for (let g of this.template.group) {
            for (let i = 0; i < g.element.length; i++) {
                let e = g.element[i];
                if (e['represents_element'] === id) {
                    last = e.id;
                } else if (!e.hasOwnProperty('represents_element')) {
                    // State.logger.log(e);
//                    throw 'missing property \'represents_element\' on ' + id;
                }
            }
        }
        return last;
    }

    appendElement(e: Element) {
        let g = this.findElementGroup(e);
        let i = this.findLastIndexOfBaseElement(e.represents_element);
        State.logger.log('appendElement', g, i);
        if (g.element.length > i + 1) {
            g.element.splice(i + 1, 0, e);
        } else {
            g.element.push(e);
        }
        State.logger.log('appendElement OUT', g.element);
    }

    removeElement(e: Element) {
        let g = this.findElementGroup(e);
        let i = this.findIndexOfElement(e.id);
        State.logger.log('removeElement', e.id, g, i);
        if (i > -1) {
            g.element.splice(i, 1);
        }
        State.logger.log('removeElement OUT', e.id, g, i);
    }

    getItem(id: string): Item {
        State.logger.log('getItem', id);
        for (let g of this.template.group) {
            for (let e of g.element) {
                if (e instanceof Element) {
                    for (let i of (e as Element).items) {
                        if (i.id === id) {
                            State.logger.log('getItem found', i);
                            return i;
                        }
                    }
                }
            }
        }
        return undefined;
    }

    mergeWithEDIML(ediml: any) {
        console.log('EDIML merge', ediml);
        this.template.fileId = ediml.fileId;
        this.template.fileUri = ediml.fileUri;
        for ( let e of ediml.elements ) {
            State.logger.log('EDIML', 'doing element', e.id, e.represents_element);
            if ( e.id === e.represents_element ) {
                // base element
                let element = this.getElement(e.id);
                State.logger.log('EDIML', 'found element', element);
                element.fromEDIML(e);
            } else {
                // duplicate element
                let element = this.getElement(e.represents_element);
                element.duplicate();
                element = this.getElement(e.id);
                element.fromEDIML(e);
            }
        }
    }

}
