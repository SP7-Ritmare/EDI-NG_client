/**
 * Created by fabio on 05/03/2017.
 */
import {Component, Input, Host} from '@angular/core';
import {EDITemplate} from '../service/EDITemplate';
import {MainLayoutComponent} from '../layout/main-layout-component';
import {Element} from '../../model/Element';
import {State} from '../../model/State';
@Component({
    selector: 'app-edi-element',
    templateUrl: './edi-element-component.html',
    styleUrls: ['./edi-element-component.css'],
    providers: []
})
export class EdiElementComponent {
    interfaceLanguage: string;
    @Input() element: Element;

    duplicateElement(event: any) {
        event.stopPropagation();
        console.log('start duplication of element', this.element);
        this.element.duplicate();
    }

    removeElement() {
        this.element.remove();
    }

    showButton() {
        if ( this.element.multiple && this.element.id === State.findLastInstanceOfBaseElement(this.element.represents_element) ) {
            return true;
        }
        return false;
    }

    showRemoveButton() {
        if ( this.element.multiple && this.element.id !== this.element.represents_element ) {
            return true;
        }
        return false;
    }

    showTitle() {
        if ( ! this.element.multiple || this.element.multiple && this.element.id === this.element.represents_element ) {
            return true;
        }
        return false;
    }

    constructor() {
        State._interfaceLanguage.asObservable().subscribe(
            res => this.interfaceLanguage = res
        );
    }
}
