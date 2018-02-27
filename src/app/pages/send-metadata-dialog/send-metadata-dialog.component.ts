import { Component, OnInit } from '@angular/core';
import {IMetadataServiceStatus, MetadataService} from '../../components/service/MetadataService';

@Component({
  selector: 'app-send-metadata-dialog',
  templateUrl: './send-metadata-dialog.component.html',
  styleUrls: ['./send-metadata-dialog.component.css']
})
export class SendMetadataDialogComponent implements OnInit {
  status: IMetadataServiceStatus;

  constructor(private metadataService: MetadataService) {
    this.metadataService.currentStatus.subscribe( status => this.status = status);
  }

  ngOnInit() {
  }

}
