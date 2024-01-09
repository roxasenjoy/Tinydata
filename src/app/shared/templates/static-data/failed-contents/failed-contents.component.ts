import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FiltersStorageService } from 'src/app/shared/consts/filtersStorage';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';

@Component({
  selector: 'app-failed-contents',
  templateUrl: './failed-contents.component.html',
  styleUrls: ['./failed-contents.component.css']
})
export class FailedContentsComponent implements OnInit {

  /* User ou entreprise ? */
  userZoom = false;

  canShowResult = false;
  result: any;
  idUser: any;

  displayedColumns: string[] = ['companyName', 'parent1Name','firstName', 'lastName', 'email',  'matrixName', 'contentCount'];
	nameColumns: string[] = ['Groupe Principal', 'Groupe', 'Prénom', 'Nom', 'Adresse email', 'Formation', 'Nombre total de contenus non validés'];
	totalElements: number;
  modal: boolean = false;
  dataExtended: any;
  dataIsReady: boolean = false;

  @Output() public sendData = new EventEmitter<any[]>();
  @Output() public extendedData = new EventEmitter<any[]>();

  constructor(
    public filter: FiltersStorageService,
    private eventEmitterService: EventEmitterService,
    public settingsStorageService: SettingsStorageService,
    public RequestV2Service: RequestV2Service
  ) { }

  ngOnInit(): void {
    /* Est ce qu'on a la vision utilisateur ou entreprise ? */
    this.eventEmitterService.refreshGraphics.subscribe(() => {
      this.setUserZoom();
    });

    this.setUserZoom();

    this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
      if ("TOTAL_CONTENTS_FAILED" in graphSelected || graphSelected.includes("TOTAL_CONTENTS_FAILED")) {
        this.getData(true, null);
      }
    });

  }

  getData(isExtended: boolean = false, _pageIndex: number | null = 1) {

    this.dataIsReady = false;
    this.canShowResult = false;
    let isValidated = false;

    FiltersStorageService.specificGraphData('total_contents_failed', { isValidated: 'false', isExtended: 'true', _pageIndex: null });

    this.RequestV2Service.getRawData('total_contents', { isValidated, isExtended, _pageIndex }).subscribe(
      (result: any) => {
        this.result = JSON.parse(result.data.rawData.data);
        this.dataExtended = JSON.parse(result.data.rawData.data)['dataExtended'];
        this.totalElements = JSON.parse(result.data.rawData.data)['totalStatus'];
        this.sendData.emit(this.result);
        this.extendedData.emit(this.dataExtended);
        this.canShowResult = true;
        this.dataIsReady = true;
      }
    );

  }

  setUserZoom() {
    this.userZoom = FiltersStorageService.isUserZoom;
    this.getData();
  }

  getDataModal() {
    this.getData(true);
    this.displayModal();
  }

  displayModal() {
    this.modal = !this.modal;
  }

  updateData(event: any) {
    this.getData(true, event.pageIndex + 1);
  }


}