import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {CategoryListComponent} from './components/categoryList/category-list.component';
import {MainLayoutComponent} from './components/layout/main-layout-component';
import {EdiElementComponent} from './components/ediElement/edi-element-component';
import {EdiItemComponent} from './components/ediItem/edi-item-component';
import {EdiComboboxComponent} from './components/ediItem/combobox/edi-combobox-component';
import {EdiTextboxComponent} from './components/ediItem/textbox/edi-textbox-component';
import {Ng2AutoCompleteComponent} from 'ng2-auto-complete';
import {EdiAutocompleteComponent} from './components/ediItem/autocomplete/edi-autocomplete-component';
import {SidebarComponent} from './components/sidebar/edi-sidebar-component';
import {NumberValidatorDirective} from './number-validator.directive';
import {EdiTextareaComponent} from './components/ediItem/textarea/edi-textarea-component';
import {EdiBooleanComponent} from './components/ediItem/boolean/edi-boolean-component';
import {MaterialModule} from '@angular/material';
import {DebugWindowComponent} from './components/debugWindow/edi-debug-window-component';
import {DatepickerModule} from 'ng2-bootstrap';
import {EdiDateComponent} from './components/ediItem/date/edi-date-component';

@NgModule({
    declarations: [
        AppComponent,
        Ng2AutoCompleteComponent,
        CategoryListComponent,
        MainLayoutComponent,
        SidebarComponent,
        EdiElementComponent,
        EdiItemComponent,
        EdiComboboxComponent,
        EdiTextboxComponent,
        EdiTextareaComponent,
        EdiAutocompleteComponent,
        EdiBooleanComponent,
        EdiDateComponent,
        NumberValidatorDirective,
        DebugWindowComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        DatepickerModule
    ],
    providers: [],
    bootstrap: [MainLayoutComponent]
})
export class AppModule {
}
