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
import {EdiDateComponent} from './components/ediItem/date/edi-date-component';
import {MyDatePickerModule} from 'mydatepicker';
import {MyDateRangePickerModule} from 'mydaterangepicker';
import {EdiDateRangeComponent} from './components/ediItem/daterange/edi-date-range-component';
import {RouterModule, Routes} from '@angular/router';
import {EdiAlternativeGroupComponent} from './components/alternativeGroup/edi-alternative-group-component';
import {RemoveCyclicPipe} from './components/pipes/remove-cyclic.pipe';

const appRoutes: Routes = [
    { path: 'main', component: MainLayoutComponent },
    { path: 'debug', component: DebugWindowComponent },
    { path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    }

    /*
        { path: 'login', component: LoginComponent },
        { path: 'main', component: MainPageComponent},
        { path: 'customers', component: CustomerListComponent},
        { path: 'customers/:id', component: CustomerEditComponent },
        { path: 'customers/new', component: CustomerEditComponent },
        { path: '',
            redirectTo: '/login',
            pathMatch: 'full'
        }
    */
];

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
        EdiDateRangeComponent,
        EdiAlternativeGroupComponent,
        RemoveCyclicPipe,
        NumberValidatorDirective,
        DebugWindowComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        MyDatePickerModule,
        MyDateRangePickerModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
