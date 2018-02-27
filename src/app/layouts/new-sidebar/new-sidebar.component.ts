import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EDITemplate} from '../../components/service/EDITemplate';
import {State} from '../../model/State';
import {MetadataService} from '../../components/service/MetadataService';
import {MatDialog} from '@angular/material';
import {SendMetadataDialogComponent} from '../../pages/send-metadata-dialog/send-metadata-dialog.component';

@Component({
  selector: 'app-new-sidebar',
  templateUrl: './new-sidebar.component.html',
  styleUrls: ['./new-sidebar.component.css']
})
export class NewSidebarComponent implements OnInit {
  groups: any;
  interfaceLanguage = 'en';
  @Output()
  saving = new EventEmitter();

  constructor(private template: EDITemplate,  public metadataService: MetadataService) {
    this.template.stateSubject
      .subscribe( (state: State) => {
        if ( state && state.template && state.template.group ) {
          console.log('received new version of state', state);
          this.groups = state.template.group;
          this.interfaceLanguage = state.interfaceLanguage;
        }
      });
  }

  ngOnInit() {
  }

  goTo(location: string): void {
    window.location.hash = location;
  }
  setLanguage(lang: string) {
    this.metadataService.state.interfaceLanguage = lang;
    this.interfaceLanguage = lang;
  }
  sendMetadata() {
    this.metadataService.sendMetadata();
    this.saving.emit(true);
  }

}
