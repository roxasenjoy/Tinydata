import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { FiltersStorageService } from 'src/app/shared/consts/filtersStorage';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-total-learning-time',
  templateUrl: './total-learning-time.component.html',
  styleUrls: ['./total-learning-time.component.css']
})
export class TotalLearningTimeComponent implements OnInit {

  /* User ou entreprise ? */
  userZoom = false;
  canShowGraphic = false;
  result: any;
  idUser: any;

  displayedColumns: string[] = ['firstName', 'lastName','email','groupePrincipal', 'groupe', 'time'];
	nameColumns: string[] = ['Prénom', 'Nom', 'Adresse email','Groupe principal', 'Groupe', 'Temps'];
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
    public globalService: GlobalService,
    public RequestV2Service: RequestV2Service
  ) { }

  ngOnInit(): void {
    /* Est ce qu'on a la vision utilisateur ou entreprise ? */
    this.eventEmitterService.refreshGraphics.subscribe(() => {
      this.setUserZoom();
    });

    this.setUserZoom();

    this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
			if ("TOTAL_LEARNING_TIME" in graphSelected || graphSelected.includes("TOTAL_LEARNING_TIME")) {
				this.getData(true, null);
			}
		});

  }

  getData(isExtended: boolean = false, _pageIndex: number | null = 1){

    this.dataIsReady = false;
    FiltersStorageService.specificGraphData('total_learning_time', { isExtended: 'true', _pageIndex: null });
    
    this.RequestV2Service.getRawData('total_learning_time', {isExtended, _pageIndex}).subscribe(
			(result: any) => {
				this.result = this.globalService.secondsToHms(JSON.parse(result.data.rawData.data)['value']); 
        this.dataExtended = JSON.parse(result.data.rawData.data)['dataExtended'];
        this.totalElements = JSON.parse(result.data.rawData.data)['total'];
        this.sendData.emit(this.result);
        this.extendedData.emit(this.dataExtended);
        this.canShowGraphic = true;
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
		this.getData(true, event.pageIndex+1);
	}

}