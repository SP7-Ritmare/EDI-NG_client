import {Component, Input, ElementRef} from '@angular/core';
import {EdiItemComponent} from '../edi-item-component';
import {Item} from '../../../model/Item';
import {State} from '../../../model/State';
import {EDITemplate} from '../../service/EDITemplate';
/**
 * Created by fabio on 22/03/2017.


 */

@Component({
    selector: 'app-edi-autocomplete',
    host: {
        '(document:click)': 'handleClick($event)',
    },
    template: `
        <md-input-container class="col-md-12">
            <input
                    mdInput
                    class="form-control" type="text" placeholder="{{placeholder()}}" [(ngModel)]="query"
                    (keyup)=filter() [required]="item.mandatory"
            >
            <div class="suggestions" *ngIf="filteredList.length > 0">
                <ul *ngFor="let item of filteredList">
                    <li>
                        <a (click)="select(item)" [innerHTML]="item.l"></a>
                    </li>
                </ul>
            </div>
        </md-input-container>
    `,
    styleUrls: ['./edi-autocomplete-component.css'],
    providers: [EDITemplate]
})
export class EdiAutocompleteComponent extends EdiItemComponent {
    interfaceLanguage: string;
    @Input() item: Item;
    query = '';
    data: any[] = [];
    private filteredList: any = [];
    elementRef: any;

    constructor(myElement: ElementRef) {
        super();
        this.elementRef = myElement;
    }

    renderRow(data: any) {
        let html = `<b style='float:left;width:100%'>${data.c}</b>
                
                <span>${data.l}</span>`;

        return html;
    }

    placeholder() {
        if (this.item.label) {
            for (let l of this.item.label) {
                if (l['_xml:lang'] === State.interfaceLanguage) {
                    return l['__text'];
                }
            }
        }
        return '';
    }

    filter() {
        if (this.query !== "") {
            console.log('autocomplete refreshing on ds ' + this.item.datasource.id);
            this.item.datasource.refresh({searchParam: this.query});
            this.item.datasource.results.subscribe(res => this.filteredList = res);
            /*
             this.filteredList = this.data.filter(function(el: any){
             return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
             }.bind(this));
             */
        } else {
            this.filteredList = [];
        }
    }

    select(item: any) {
        this.query = item.l;
        this.item.value = item;
        this.item.labelValue = item.l ? item.l : item.a;
        this.item.codeValue = item.c;
        this.item.languageNeutral = item.z;
        this.item.urnValue = item.urn;
        console.log('changed item', this.item);
        this.filteredList = [];
    }

    handleClick(event: any) {
        var clickedComponent = event.target;
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }
    }
}