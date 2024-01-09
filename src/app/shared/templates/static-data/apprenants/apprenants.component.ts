import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FiltersStorageService } from 'src/app/shared/consts/filtersStorage';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';


@Component({
	selector: 'app-apprenants',
	templateUrl: './apprenants.component.html',
	styleUrls: ['./apprenants.component.css']
})
export class ApprenantsComponent implements OnInit {

	/* User ou entreprise ? */
	userZoom = false;

	canShowResult = false;
	result: any;
	idUser: any;

	displayedColumns: string[] = ['groupePrincipal', 'groupe', 'email', 'firstName', 'lastName', 'lastConnection'];
	nameColumns: string[] = ['Groupe principal', 'Groupe','Adresse email', 'Prénom', 'Nom', 'État'];
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
		public RequestV2Service: RequestV2Service,
	) { }

	ngOnInit(): void {
		/* Est ce qu'on a la vision utilisateur ou entreprise ? */
		this.eventEmitterService.refreshGraphics.subscribe(() => {
			this.setUserZoom();
		});

		this.setUserZoom();

		this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
			if ("TOTAL_APPRENANTS" in graphSelected || graphSelected.includes("TOTAL_APPRENANTS")) {
				this.getData(true, null);
			}
		});

	}

	getData(isExtended: boolean = false, _pageIndex: number | null = 1) {

		this.dataIsReady = false;

		if (FiltersStorageService.userZoom) {
			this.idUser = FiltersStorageService.userZoom['id'];
		} else {
			this.idUser = 0;
		}

		FiltersStorageService.specificGraphData('total_apprenants', { isExtended: 'true', _pageIndex });

		this.RequestV2Service.getRawData('total_apprenants', { isExtended, _pageIndex }).subscribe(
			(result: any) => {
				this.result = JSON.parse(result.data.rawData.data);
				this.dataExtended = JSON.parse(result.data.rawData.data)['dataExtended'];
				this.totalElements = this.result['total'];
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
		this.getData(true, event.pageIndex+1);
	}

}