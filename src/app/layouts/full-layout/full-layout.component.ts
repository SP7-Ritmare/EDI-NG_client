import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {SendMetadataDialogComponent} from '../../pages/send-metadata-dialog/send-metadata-dialog.component';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.css']
})
export class FullLayoutComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    this.dialog.open(SendMetadataDialogComponent, {
    });
  }


}
