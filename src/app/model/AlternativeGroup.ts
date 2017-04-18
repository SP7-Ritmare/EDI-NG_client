import {Element} from './Element';
import {element} from 'protractor';
export class AlternativeGroup {
    id: string;
    elements: Element[];
    activeElementIndex: number = 0;
    activeElement: Element;

    get mandatory() {
      for ( let e of this.elements ) {
        if ( e.mandatory ) {
          return true;
        }
      }
      return false;
    }

    activateElement(index: number) {
        this.activeElementIndex = index;
        this.activeElement = this.elements[index];
    }
    getActiveElement() {
        if ( this.activeElementIndex > -1 ) {
            return this.activeElement;
        }
    }
}
