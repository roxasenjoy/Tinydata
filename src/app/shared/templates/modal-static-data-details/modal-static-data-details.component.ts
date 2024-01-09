import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';

@Component({
  selector: 'app-modal-static-data-details',
  templateUrl: './modal-static-data-details.component.html',
  styleUrls: ['./modal-static-data-details.component.css'],
})
export class ModalStaticDataDetailsComponent implements OnInit {

  @Input() nameColumns: string[];
  @Input() displayedColumns: string[];
  @Input() totalElements: number;
  @Input() dataExtended: any;
  @Input() modal: boolean;
  @Input() dataIsReady: boolean = false;

  @Output() displayModalEvent = new EventEmitter<void>();
  @Output() updateDataEvent = new EventEmitter<PageEvent>();

  constructor(
    public settingsStorageService: SettingsStorageService
  ) { }

  ngOnInit() {
  }

  displayModal() {
    this.displayModalEvent.emit();
  }

  updateData(event: PageEvent) {
    this.updateDataEvent.emit(event);
  }

}

