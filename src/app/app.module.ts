import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {CategoryListComponent} from './components/categoryList/category-list.component';
import {MainLayoutComponent} from './components/layout/main-layout-component';
import {EdiElementComponent} from './components/ediElement/edi-element-component';
import {EdiItemComponent} from './components/ediItem/edi-item-component';
import {EdiComboboxComponent} from './components/ediItem/combobox/edi-combobox-component';
import {EdiTextboxComponent} from './components/ediItem/textbox/edi-textbox-component';
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
import {TypeaheadDirective} from 'ng2-bootstrap';
import {EdiQRCodeComponent} from './components/ediItem/qrcode/edi-qrcode-component';
import {QRCodeComponent} from 'ng2-qrcode';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {QRCodeModule} from 'angular2-qrcode';
import {MetadataService} from './components/service/MetadataService';
import {BoundingBoxComponent} from './components/ediItem/bounding-box/bounding-box.component';
import {LeafletModule} from '@asymmetrik/angular2-leaflet';
import {LeafletDrawModule} from '@asymmetrik/angular2-leaflet-draw';
import {UuidComponent} from './components/ediItem/uuid/uuid.component';
import {ConfigService} from './components/service/ConfigService';
import { environment } from '../environments/environment';
import { TemplateSelectorComponent } from './components/template-selector/template-selector.component';
import { TimePickerComponent } from './components/ediItem/time-picker/time-picker.component';
import {CatalogueService} from './components/service/catalogue.service';
import { CatalogueListComponent } from './components/catalogue-list/catalogue-list.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TimeComponent } from './components/ediItem/time/time.component';
import {FlexLayoutModule} from '@angular/flex-layout';

const appRoutes: Routes = [
    {path: 'select', component: TemplateSelectorComponent},
    {path: 'catalogue-list', component: CatalogueListComponent},
    {path: ':template', component: MainLayoutComponent},
    {path: 'debug', component: DebugWindowComponent},
    {
        path: '',
        redirectTo: '/select',
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

export function ConfigLoader(configService: ConfigService) {
//Note: this factory need to return a function (that return a promise)

    return () => configService.load(environment.configFile);
}

@NgModule({
    declarations: [
        AppComponent,
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
        DebugWindowComponent,
        TypeaheadDirective,
        EdiQRCodeComponent,
        QRCodeComponent,
        BoundingBoxComponent,
        UuidComponent,
        TemplateSelectorComponent,
        TimePickerComponent,
        CatalogueListComponent,
        TimeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MyDatePickerModule,
        MyDateRangePickerModule,
        MaterialModule,
        RouterModule.forRoot(appRoutes),
        BrowserAnimationsModule,
        QRCodeModule,
        LeafletModule,
        LeafletDrawModule,
        FilterPipeModule,
        FlexLayoutModule
    ],
    providers: [
        MetadataService,
        CatalogueService,
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: ConfigLoader,
            deps: [ConfigService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
