import {Component, Input, ElementRef, ViewChildren, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, NgZone} from '@angular/core';
import {EdiItemComponent} from '../edi-item-component';
import {Item} from '../../../model/Item';
import {State} from '../../../model/State';
import {EDITemplate} from '../../service/EDITemplate';
import {MetadataService} from '../../service/MetadataService';
import {availableContexts, Logger} from '../../../utils/logger';
import {BaseDatasource} from '../../../model/Datasource';
import {MatAutocomplete} from '@angular/material';

/*
    <!--      <mat-input-container class='md-icon-float md-block md-title'>
                <input
                        matInput
                        class='form-control' type='text' placeholder='{{placeholder()}}' [(ngModel)]='query'
                        (keyup)='filter($event); false' [required]='item.mandatory'
                >
                <div class='suggestions' [hidden]='filteredList.length <= 0'>
                    <select #select size='10' (keyup)='filter($event)'>
                        <option *ngFor='let item of filteredList; let i = index' value='item.c' (click)='select(item)' [selected]='i == selectedItem' [attr.data-index]='i'>{{item.l}}
    &lt;!&ndash;
                            <a (click)='select(item)' [innerHTML]='item.l'></a>
    &ndash;&gt;
                        </option>
                    </select>
                </div>
            </mat-input-container>-->

 */
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
<!--
        <pre>{{ query | json }}</pre>
        <button mat-button (click)="test()">test</button>
-->
        <input
            #input
            matInput
            type='text' [placeholder]='placeholder()' [(ngModel)]='query.l'
            (keyup)='filter($event); false' [required]='item.mandatory' [matAutocomplete]="auto"
        >
        <mat-autocomplete #auto='matAutocomplete' [displayWith]="displayFn" (optionSelected)="select($event)">
            <mat-option *ngFor='let i of filteredList' [value]='i'>
                {{ i.l }}
            </mat-option>
        </mat-autocomplete>
        <!--
            <mat-form-field class="col-md-12">
              <pre>{{item | removeCyclic | json}}</pre>
            </mat-form-field>
        -->

    `,
    styleUrls: ['./edi-autocomplete-component.css'],
    providers: [EDITemplate]
})
export class EdiAutocompleteComponent implements OnInit, AfterViewInit {
    static logger = new Logger(availableContexts.AUTOCOMPLETION);
    @ViewChild('select')
    combo: ElementRef;

    @ViewChild('input') input: ElementRef;
    @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;

    interfaceLanguage: string;
    @Input() item: Item;
    query: any = {
        c: undefined,
        l: undefined,
        a: undefined
    };
    data: any[] = [];
    private filteredList: any = [];
    elementRef: any;
    selectedItem = 0;
    mustSetValue = false;

    constructor(protected metadataService: MetadataService, private cdRef: ChangeDetectorRef, private zone: NgZone) {
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
        if ( !event ) {
            return;
        }
        const ignoredKeys = [
            'ArrowUp',
            'ArrowDown',
            'Enter',
        ];
        // event.stopPropagation();
        EdiAutocompleteComponent.logger.log('event', event);
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            console.log('discarding key', event.key);
            return;
        }
        if (this.query.l && this.query.l !== '' && this.query.l.length > 2) {
            EdiAutocompleteComponent.logger.log('autocomplete refreshing on ds ' + this.item.datasource.id);
            this.item.datasource.refresh({searchParam: this.query.l});
            this.item.datasource.results.subscribe(res => {
                this.filteredList = res;
                if ( this.mustSetValue ) {
                    this.mustSetValue = false;
                    if ( this.item.datasource.baseResults.length > 0 ) {
                        console.log('setting current row to', this.item.datasource.id, this.item.datasource.baseResults[0]);
                        this.select(this.item.datasource.baseResults[0]);
                    }
                } else {
                    this.item.datasource.setCurrentRow({});
                }
                // EdiAutocompleteComponent.logger.log('results', this.filteredList);
                // this.combo.nativeElement.focus();
                /*
                          if (this.filteredList.length === 1) {
                            this.select(this.filteredList[0]);
                          }
                */
            });
            /*
             this.filteredList = this.data.filter(function(el: any){
             return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
             }.bind(this));
             */
        } else {
            this.filteredList = [];
            /*
                  console.log('clearing current row in datasource', this.item.datasource.id, this.query);
                  this.select({c: null});
            */
        }

        /*
            if (event.key === 'ArrowDown' && this.selectedItem < this.filteredList.length - 1) {
              this.selectedItem++;
            } else if (event.key === 'ArrowUp' && this.selectedItem > 0) {
              this.selectedItem--;
            } else if (event.key === 'Enter'/!* && this.selectedItem >= 0 && this.selectedItem < this.filteredList.length*!/) {
              EdiAutocompleteComponent.logger.log('Enter pressed', 'selecting', this.selectedItem, this.filteredList[this.selectedItem], this.filteredList);
              this.select(this.filteredList[this.selectedItem]);
            } else {
            }
        */
    }

    select(originalItem: any) {
        console.log('selected item', originalItem);
        if (originalItem && originalItem.hasOwnProperty('option') && originalItem.option.hasOwnProperty('value')) {
            const item = originalItem.option.value;
            // this.query = item.l;
            this.item.value = item;
            this.item.labelValue = item.l ? item.l : item.a;
            this.item.codeValue = item.c;
            this.item.languageNeutral = item.z;
            this.item.urnValue = item.urn;
            EdiAutocompleteComponent.logger.log('changed item', this.item);
            this.filteredList = [];
            this.item.datasource.setCurrentRow(item);
        } else {
            this.item.value = null;
            this.item.labelValue = null;
            this.item.codeValue = null;
            this.item.languageNeutral = null;
            this.item.urnValue = null;
        }
    }

    handleClick(event: any) {
        let clickedComponent = event.target;
        let inside = false;
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

    displayFn(item?: any) {
        const result = item && item.l ? item.l : item;
        console.log('displayFn', item, result);
        return result;
    }

    test() {
        console.log(this.item);
        this.item.value = this.item.datasource.baseResults[0];
/*
        this.input.nativeElement.focus();
        this.matAutocomplete._keyManager.setFirstItemActive();
*/
    }

    ngOnInit() {
        console.log('value is', this.item.value);
        if (this.item.value) {
            this.query = this.item.value = {
                ttValue: this.item.codeValue,
                c: this.item.codeValue,
                l: this.item.labelValue
            };
            this.mustSetValue = true;
            this.filter(this.query);
/*
            setTimeout( () => {
                this.select({
                    ttValue: this.item.codeValue,
                    c: this.item.codeValue,
                    l: this.item.labelValue
                });
            }, 1000);
*/
            // this.matAutocomplete.options.first.select();
        } else {
            this.query = {
            };
        }
        console.log('query', this.query);
    }
    ngAfterViewInit() {
        /*
                this.elementRef = this.myElement;
        */

    }
}
