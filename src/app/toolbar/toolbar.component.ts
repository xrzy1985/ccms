import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// Components
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() title: string;

  constructor(public dialog: MatDialog) {
    this.title = '';
  }

  ngOnInit(): void {}

}
