import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    catalogueUrl = 'https://enygma.it/edi-catalogue/';
    constructor() {
    }

    ngOnInit() {
    }

    save() {
        console.log('saving', this.catalogueUrl);
    }
}
