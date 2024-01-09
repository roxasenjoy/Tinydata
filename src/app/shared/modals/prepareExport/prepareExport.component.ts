// @ts-ignore
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { SettingsStorageService } from '../../consts/settingsStorage';


@Component({
  selector: 'app-export-modal',
  templateUrl: './prepareExport.component.html',
  styleUrls: ['./prepareExport.component.css']
})
export class PrepareExportComponent implements OnInit {


  exportTitle: string = "";
  exportAnalysis: string = "";
  exportType: string = "PDF";

  @Output() cancel = new EventEmitter();
  @Output() export = new EventEmitter<any>();

  @Input() isPossibleToExportInPDF: boolean;
  

  constructor(public settingsStorageService: SettingsStorageService) {}

  ngOnInit(): any {
    this.exportType = this.isPossibleToExportInPDF ? 'PNG' : 'PDF';
  }

  startExport():any{
    this.export.emit({
      title:this.exportTitle,
      analysis:this.exportAnalysis,
      type:this.exportType,
    });
  }

  cancelExportModal():any{
    this.cancel.emit();
  }

}


