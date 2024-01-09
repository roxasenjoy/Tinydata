import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { SettingsStorageService } from '../../consts/settingsStorage';
import { GranularitiesStorage } from '../../consts/granularitiesStorage';
import { ProfileService } from '../../services/profile.service';
import { EventEmitterService } from '../../services/event-emitter.service';
import { FiltersStorageService } from '../../consts/filtersStorage';
import { Observable } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';

@Component({
	selector: 'app-item-organisation',
	templateUrl: './item-organisation.component.html',
	styleUrls: ['./item-organisation.component.css']
})
export class ItemOrganisationComponent implements OnInit {

	myColor = 'rgba(191,170,143,0.15)';
	user: any;
	users: any = [];
	userId: any;
	modalFilterFormations = false;
	modalFilterOrganisation = false;
	modalFilterDate = true;


	/** Zoom Utilisateur */
	filtered!: Observable<any>;
	myControl = new FormControl('', [Validators.required]);
	returnUsers: string[] = [];
	userFilter = "";
	isResearchUp = false;
	fullnameUser: String | null | undefined;
	isUpdateGranularities = false;

	/**
	 * Pagination
	 **/
	totalGranularities = 0;

	zoomUserValue: any = null;
	formationText: any;
	zoomFormationValue: any = null;
	beginDate: string = '';
	endDate: string = '';
	objectifsArray: any[] = [];
	levelsArray: any[] = [];
	organisationsArray: any[] = []; // Storage
	orgaFilter = "";
	formaFilter = "";
	organisationsList = [
		{
			name: '',
			completed: false,
			color: '',
			id: ''
		}
	];


	organisationStorage: number[] = [];
	/* Entreprise */
	companiesFilter: any[] = [];

	check = true;

	/**
	 * Organisation storage
	 */
	getOrganisations = FiltersStorageService.organisations;

	/**
	 * Date storage
	 */
	// Récupère les deux dates du localstorage
	getDateBegin = FiltersStorageService.beginDate;
	getDateEnd = FiltersStorageService.endDate;

	// Affiche les dates dans l'input
	serializedDateBegin: any;
	serializedDateEnd: any;

	// Gestion du nombre de formations
	startIndex: any;
	endIndex: any;
	totalFormations: any;


	// La barre de recherche ne bouge plus 
	@ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
	autoComplete!: MatAutocompleteTrigger;

	@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
	@ViewChild('paginatorGSTN') paginatorGSTN: MatPaginator;

	scrollEvent = (event: any): void => {
		if (this.autoComplete.panelOpen)
			// this.autoComplete.closePanel();
			this.autoComplete.updatePosition();
	};

	@Input() organisation: any;
	@Input() level: number = 1;


	constructor(
		private router: Router,
		public settingsStorageService: SettingsStorageService,
		public granularities: GranularitiesStorage,
		public profileService: ProfileService,
		public eventEmitterService: EventEmitterService,
		private dateAdapter: DateAdapter<Date>) {
		this.dateAdapter.setLocale('fr');
	}

	ngOnInit(): any {
	}

	filterOrga(orga: any, orgaFilter: any) {

		if (orgaFilter && orgaFilter != "") {
			return orga.name.toLowerCase().includes(orgaFilter.toLowerCase());

		}
		return true;
	}


	addOrganisationInStorage(array: any, element: any, parentElement: any, e: { checked: any; }): any {

		this.organisationStorage = FiltersStorageService.organisations ? FiltersStorageService.organisations : [];

		if (e.checked) {
			FiltersStorageService.addFilteredOrganisation(element, parentElement);
		} else {
			FiltersStorageService.removeFilteredOrganisation(element);
		}

		switch (array) {
			case 'parent':
				this.removeValueToAnArray(this.organisationStorage, element, e);
				FiltersStorageService.organisations = this.organisationStorage;
				this.toggleCheckbox(element, "childs", e.checked);
				break;
			case 'childs':
				this.removeValueToAnArray(this.organisationStorage, element, e);
				FiltersStorageService.organisations = this.organisationStorage;
				this.checkIfOrganisationCheckParents(array, parentElement, element, e);
				break;
		}
	}

	/**
	
	* @param granularity 
	* @param parentElement 
	* @param element 
	* @param e 
	* @returns 
	*/
	checkIfOrganisationCheckParents(granularity: string, parentElement: any, element: any, e: any) {

		if (e.checked) {
			return;
		}

		if (granularity === "childs") {
			const isRemainingChild = parentElement.childs.filter((child: any) => child.completed === true).length > 0;

			if (!isRemainingChild) {
				this.removeValueToAnArray(this.organisationStorage, parentElement, { checked: false });
				FiltersStorageService.organisations = this.organisationStorage;
			}
		}
	}

	/**
	* Permet de déterminersi la
	* 
	* @param element 
	* @param granularityType 
	* @param checked 
	*/
	toggleCheckbox(element: any, granularityType: string, checked: boolean) {
		if (element[granularityType]) {
			element[granularityType].forEach((subElement: any) => {
				subElement.completed = checked;
				switch (granularityType) {
					case "childs":
						this.removeValueToAnArray(this.organisationStorage, subElement, { checked });
						FiltersStorageService.organisations = this.organisationStorage;
						break;
				}

				this.toggleCheckbox(subElement, this.getSubElement(granularityType), checked);
			});
		}
	}

	getSubElement(granularityType: string) {
		return "childs";
	}

	someComplete(element: any, granularityType: string): boolean {
		const subGranularity = this.getSubElement(granularityType);
		if (element[subGranularity] == null) {
			return false;
		}

		return element[subGranularity].filter((subElement: any) => this.isSomeoneChecked(subElement, subGranularity)).length > 0 && element[subGranularity].filter((subElement: any) => this.isSomeoneChecked(subElement, subGranularity, false)).length > 0;
	}

	isSomeoneChecked(element: any, granularityType: string, checked = true): boolean {
		const subGranularity = this.getSubElement(granularityType);

		if ((element.completed && checked) || (!element.completed && !checked)) {
			return true;
		}

		if (element[subGranularity]) {
			return element[subGranularity].filter((subElement: any) => this.isSomeoneChecked(subElement, subGranularity, checked)).length > 0
		}

		return false;
	}

	/**
	* Ajoute / delete grâce au checkbox
	* @param array
	* @param storage
	* @param element
	* @param e
	* @param type
	*/
	removeValueToAnArray(storage: any, element: any, e: any): any {

		// Si la case est cochée, on rajoute dans l'array
		if (e.checked === true) {
			element.completed = true;
			storage.push(element.id);
		} else {
			// Si l'utilisateur change d'avis, on delete l'élement
			element.completed = false;
			this.removeItem(element.id, storage);
		}
	}

	/**
	* Delete les items qui ne sont pas sélectionnés
	*/
	removeItem(item: string, value: any): any {
		for (let i = 0; i < value.length; i++) {
			if (value[i] === item) {
				value.splice(i, 1);
				i--;
			}
		}
	}

	/**
	* Changer de page pour observer les détails d'une entreprise (Dans le filtre Organisations)
	* @param element
	*/
	navigateToCompany(element: { id: string; }): any {
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
			this.router.navigate(['/entreprise/', element.id]));

	}

	setOrganisationsStorage(element: any): any {
		const organisationCheckON = {
			name: element.name,
			completed: element.completed,
			color: element.color,
			id: element.id
		};



		if (this.getOrganisations !== null) {
			this.getOrganisations.forEach((organisationsStorage: any) => {
				if (parseInt(organisationCheckON.id) === organisationsStorage) {
					organisationCheckON.completed = true;
				}
			});
		}

		this.organisationsList.push(organisationCheckON);

	}
}

