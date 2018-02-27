import { Component, OnInit } from '@angular/core';
import {ConfigService} from '../../components/service/ConfigService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  version: any;
  constructor(private config: ConfigService) {
    this.version = config.getConfiguration()['version'];
  }

  ngOnInit() {
  }

}
