import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MetadataService} from '../service/MetadataService';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-template-selector',
  templateUrl: './template-selector.component.html',
  styleUrls: ['./template-selector.component.css']
})
export class TemplateSelectorComponent implements OnInit, AfterViewInit {
  templates = [
      'RNDT_dataset_v4.00_newFormat.xml',
      'SensorML20_lightweight_v1.00_forLTER_newSchema.xml'
  ]
  constructor(private metadataService: MetadataService, private http: HttpClient) {
      this.http.get('assets/templates/template-list.json')
          .subscribe( (res: string[]) => this.templates = res );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
      this.metadataService.clear();
  }

}
