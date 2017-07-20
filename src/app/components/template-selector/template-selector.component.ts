import { Component, OnInit } from '@angular/core';
import {MetadataService} from '../service/MetadataService';

@Component({
  selector: 'app-template-selector',
  templateUrl: './template-selector.component.html',
  styleUrls: ['./template-selector.component.css']
})
export class TemplateSelectorComponent implements OnInit {
  readonly templates = [
      'RNDT_dataset_v4.00_newFormat.xml',
      'SensorML20_lightweight_v1.00_forLTER_newSchema.xml'
  ]
  constructor(private metadataService: MetadataService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
      this.metadataService.clear();
  }

}
