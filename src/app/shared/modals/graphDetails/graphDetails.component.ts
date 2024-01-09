// @ts-ignore
import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { graphicsSettings } from 'src/app/shared/consts/graphicsSettings';
import { SettingsStorageService } from '../../consts/settingsStorage';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ColumnsType } from '../../models/type';

@Component({
  selector: 'app-graph-details',
  templateUrl: './graphDetails.component.html',
  styleUrls: ['./graphDetails.component.css']
})
export class GraphDetailsComponent implements OnInit {


  @Output() close = new EventEmitter();
  @Output() pagination = new EventEmitter();
  @Input() data!: any;
  @Input() graphType!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentGraph: any;

  columns: any;
  displayedColumns: any = [];

  constructor(public settingsStorageService: SettingsStorageService,) { }

  // @lucasGancel
  ngOnInit(): any {
    //@ts-ignore
    this.currentGraph = graphicsSettings[this.graphType]
    this.columns = this.currentGraph.dataColumns;
    this.columns = this.setupGraphicsParticularities(this.columns, this.currentGraph['exportTitle']);
    this.displayedColumns = this.columns.map((c: any) => c.columnDef);
  }

  setupGraphicsParticularities(columns: ColumnsType, graphicName: string) {
    var isAvailable = columns.some(function (obj: any) {
      return obj.header === "Nombre total d'apprenants actifs";
    });

    graphicName == 'total_apprenants' && isAvailable ? columns.shift() : '';

    return columns;

  }

  onPaginateChange(event: any) {
    this.pagination.emit(event);
  }

  closeModal(): any {
    this.close.emit();
  }

}


