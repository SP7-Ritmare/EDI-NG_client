import {Component, Input, ElementRef, ViewChildren, ViewChild} from '@angular/core';
import {EdiItemComponent} from '../edi-item-component';
import {Item} from '../../../model/Item';
import {State} from '../../../model/State';
import {EDITemplate} from '../../service/EDITemplate';
import {MetadataService} from '../../service/MetadataService';
import {availableContexts, Logger} from '../../../utils/logger';

/**
 * Created by fabio on 22/03/2017.


 */

@Component({
    selector: 'app-edi-autocomplete',
/*
    host: {
        '(document:click)': 'handleClick($event)',
    },
*/
    template: `        
        <md-input-container class="md-icon-float md-block md-title">
            <input
                    mdInput
                    class="form-control" type="text" placeholder="{{placeholder()}}" [(ngModel)]="query"
                    (keyup)="filter($event); false" [required]="item.mandatory"
            >
            <div class="suggestions" [hidden]="filteredList.length <= 0">
                <select #select size="10" (keyup)="filter($event)">
                    <option *ngFor="let item of filteredList; let i = index" value="item.c" (click)="select(item)" [selected]="i == selectedItem" [attr.data-index]="i">{{item.l}}
<!--
                        <a (click)="select(item)" [innerHTML]="item.l"></a>
-->
                    </option>
                </select>
            </div>
        </md-input-container>
    `,
    styleUrls: ['./edi-autocomplete-component.css'],
    providers: [EDITemplate]
})
export class EdiAutocompleteComponent {
    @ViewChild('select')
    combo: ElementRef;

    static logger = new Logger(availableContexts.AUTOCOMPLETION);
    interfaceLanguage: string;
    @Input() item: Item;
    query = '';
    data: any[] = [];
    private filteredList: any = [];
    elementRef: any;
    selectedItem = 0;

    constructor(protected metadataService: MetadataService) {
    }
/*
    constructor(protected metadataService: MetadataService, private myElement: ElementRef) {
        super(metadataService);
        // TODO: check if inheritance is broken
    }
*/

    renderRow(data: any) {
        let html = `<b style='float:left;width:100%'>${data.c}</b>
                
                <span>${data.l}</span>`;

        return html;
    }

    placeholder() {
        if (this.item.label) {
            for (let l of this.item.label) {
                if (l['_xml:lang'] === this.metadataService.state.interfaceLanguage) {
                    return l['__text'];
                }
            }
        }
        return '';
    }

    filter(event: any) {
        event.stopPropagation();
        EdiAutocompleteComponent.logger.log('event', event);
        if ( event.key == 'ArrowDown' && this.selectedItem < this.filteredList.length - 1 ) {
            this.selectedItem++;
        } else if ( event.key == 'ArrowUp' && this.selectedItem > 0 ) {
            this.selectedItem--;
        } else if ( event.key == 'Enter'/* && this.selectedItem >= 0 && this.selectedItem < this.filteredList.length*/ ) {
            EdiAutocompleteComponent.logger.log('Enter pressed', 'selecting', this.selectedItem, this.filteredList[this.selectedItem], this.filteredList);
            this.select(this.filteredList[this.selectedItem]);
        } else {
            if (this.query !== "") {
                EdiAutocompleteComponent.logger.log('autocomplete refreshing on ds ' + this.item.datasource.id);
                this.item.datasource.refresh({searchParam: this.query});
                this.item.datasource.results.subscribe(res => {
                    this.filteredList = res;
                    EdiAutocompleteComponent.logger.log('results', this.filteredList);
                    this.combo.nativeElement.focus();
                    if (this.filteredList.length == 1) {
                        this.select(this.filteredList[0]);
                    }
                });
                /*
                 this.filteredList = this.data.filter(function(el: any){
                 return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                 }.bind(this));
                 */
            } else {
                this.filteredList = [];
            }
        }
    }

    select(item: any) {
        this.query = item.l;
        this.item.value = item;
        this.item.labelValue = item.l ? item.l : item.a;
        this.item.codeValue = item.c;
        this.item.languageNeutral = item.z;
        this.item.urnValue = item.urn;
        EdiAutocompleteComponent.logger.log('changed item', this.item);
        this.filteredList = [];
    }

    handleClick(event: any) {
        var clickedComponent = event.target;
        var inside = false;
        do {
/*
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
*/
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }
    }

    ngOnInit() {
/*
        this.elementRef = this.myElement;
*/

        if (this.item.value) {
            this.query = this.item.value;
            this.filter(null);
        }
    }
}
