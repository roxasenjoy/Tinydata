import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from 'src/app/shared/consts/customPaginator';
import { FiltersStorageService } from 'src/app/shared/consts/filtersStorage';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';

@Component({
	selector: 'app-total-connection',
	providers: [
		{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
	  ],
	templateUrl: './total-connection.component.html',
	styleUrls: ['./total-connection.component.css']
})
export class TotalConnectionComponent implements OnInit {


	/* User ou entreprise ? */
	userZoom = false;

	canShowResult = false;
	result: any;

	idUser: any;

	modal: boolean = false;
	displayedColumns: string[] = ['date', 'lastName', 'firstName', 'email', 'name',  'totalConnexion'];
	nameColumns: string[] = ['Date', 'Nom', 'Prénom', 'Adresse email', 'Groupe',  'Nombre de connexions'];
	totalElements: number;
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
			if ("TOTAL_CONNECTIONS" in graphSelected || graphSelected.includes("TOTAL_CONNECTIONS")) {
				this.getData(true, null);
			}
		});

	}

	getData(isExtended: boolean = false, _pageIndex: number | null = 1) {

		if (FiltersStorageService.userZoom) {
			this.idUser = FiltersStorageService.userZoom['id'];
		} else {
			this.idUser = null;
		}

		if(!isExtended){
			this.canShowResult = false;
		}
		
		this.dataIsReady = false;

		FiltersStorageService.specificGraphData('total_connections', { isExtended: 'true', _pageIndex: null });

		this.RequestV2Service.getRawData('total_connections', { isExtended, _pageIndex }).subscribe(
			(result: any) => {
				this.result = JSON.parse(result.data.rawData.data)['value'];
				this.dataExtended = JSON.parse(result.data.rawData.data)['dataExtended'];
				this.totalElements = JSON.parse(result.data.rawData.data)['total'];
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