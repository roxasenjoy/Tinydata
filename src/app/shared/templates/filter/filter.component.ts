import { Component, OnInit, Output, EventEmitter, LOCALE_ID, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { SettingsStorageService } from '../../consts/settingsStorage';
import { GranularitiesStorage } from '../../consts/granularitiesStorage';
import { ProfileService } from '../../services/profile.service';
import { EventEmitterService } from '../../services/event-emitter.service';
import { EntrepriseService } from '../../services/entreprise.service';
import { FiltersStorageService } from '../../consts/filtersStorage';
import { FilterService } from '../../services/filter.service';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';


export const MY_FORMAT: MatDateFormats = {
	parse: {
		dateInput: 'DD/MM/YYYY',
	},
	display: {
		dateInput: 'DD/MM/YYYY',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'DD/MM/YYYY',
		monthYearA11yLabel: 'MMMM YYYY',
	},
};

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss'],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
		{ provide: LOCALE_ID, useValue: 'fr' }
	]
})
export class FilterComponent implements OnInit {

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
	organisation: any[] = [];
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

	/* Storage */
	matrixStorage: number[] = [];
	domainStorage: number[] = [];
	skillStorage: number[] = [];
	themeStorage: number[] = [];
	/* 
	 acquisitionStorage: number[] = [];
	 contentStorage: number[] = [];*/
	organisationStorage: number[] = [];


	/* Entreprise */
	companiesFilter: any[] = [];

	/* Filtres */
	matrixesFilter: any[] = [];

	showDomains = false;
	showSkills = false;
	showThemes = false;

	check = true;

	content: string[] = [];

	/**
	 * Formations storage
	 */
	getMatrix = FiltersStorageService.matrix;
	getDomain = FiltersStorageService.domain;
	getSkill = FiltersStorageService.skill;
	getTheme = FiltersStorageService.theme;
	/*
	getAcquisition = FiltersStorageService.acquisition;
	getContent = FiltersStorageService.content;*/


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

	// Quantité d'élements filtrés 
	totalNumberOfFormationsFiltered: number | null = null;
	totalNumberOrganisationsFiltered: number | null = null;


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

	constructor(
		private authService: AuthService,
		private dashboardService: DashboardService,
		private _adapter: DateAdapter<any>,
		private router: Router,
		public route: ActivatedRoute,
		private filterService: FilterService,
		public settingsStorageService: SettingsStorageService,
		public granularities: GranularitiesStorage,
		public profileService: ProfileService,
		public eventEmitterService: EventEmitterService,
		private entrepriseService: EntrepriseService,
		private dateAdapter: DateAdapter<Date>
	) {
		this.dateAdapter.setLocale('fr');
	}

	ngOnInit(): any {

		window.addEventListener('scroll', this.scrollEvent, true);

		if (FiltersStorageService.isUserZoom === true) {
			this.selectUser(FiltersStorageService.userZoom);
			this.fullnameUser = FiltersStorageService.userZoom.fullName;

			if (!this.fullnameUser && FiltersStorageService.userZoomObject) {
				this.fullnameUser = FiltersStorageService.userZoomObject.firstName + ' ' + FiltersStorageService.userZoomObject.lastName;
			}

			if (FiltersStorageService.userZoom) {
				this.fullnameUser = FiltersStorageService.userZoom['title'];
			}
		}

		/*Rajoute les settings */
		this.settingsStorageService.getStorageSettings();

		/* Initialise les filtres */
		this.initialiseFilters();


		/* Barre de recherche pour le zoom utilisateur */
		this.filtered = this.myControl.valueChanges.pipe(
			debounceTime(100),
			startWith(''),
			map(val => val.length >= 3 ? this.researchUser(val) : [])
		);

		// Récupération de l'utilisateur
		this.profileService.getUser().subscribe(
			result => {
				this.user = result.data.user;
				this.updateCompanies(); // Chercher toutes les entreprises
				this.updateGranularities();

			}
		);

		this.eventEmitterService.setZoomUserFilter.subscribe(() => {

			if (FiltersStorageService.userZoom) {
				this.fullnameUser = FiltersStorageService.userZoom.title;
				this.isResearchUp = true;
			}

			if (FiltersStorageService.userZoomObject) {
				this.fullnameUser = FiltersStorageService.userZoomObject.firstName + ' ' + FiltersStorageService.userZoomObject.lastName;
				this.isResearchUp = true;
			}
		});

		this.eventEmitterService.refreshZoomFilters.subscribe(() => {
			this.initialiseZoomValues();

		});
	}

	initialiseFilters() {
		this.setDateStorage();
		this.initialiseZoomValues();
		this.initArrayInStorage();
		this.totalNumberOfFormationsFiltered = this.countElementsInFilter('formations');
		this.totalNumberOrganisationsFiltered = this.countElementsInFilter('organisations');
	}

	/**
	 * Mets en place toutes les entreprises disponibles pour l'utilisateur (Dans le filtre ORGANISATION)
	 */
	updateCompanies() {
		this.companiesFilter = [];

		this.authService.getCompanies().subscribe(result => {
			this.companiesFilter = this.buildCompanyTree(result.data.company, this.getOrganisations);
		});
	}

	buildCompanyTree(companies: any[], getOrganisations: any[], parentCompleted: boolean = false, level: number = 0): any[] {
		const showChildProperty = `showChild${level}`;

		return companies.map((company: any) => {
			const completed = parentCompleted || (getOrganisations ? getOrganisations.includes(Number(company.id)) : false);
			const childCompanies = company.childs ? this.buildCompanyTree(company.childs, getOrganisations, completed, level + 1) : [];

			return {
				id: Number(company.id),
				name: company.name,
				completed: completed,
				color: 'primary',
				[showChildProperty]: false,
				childs: childCompanies
			};
		});
	}

	/** Update le filtre formation en fonction de la page index */
	updateGranularities() {

		this.userId = FiltersStorageService.userZoom ? FiltersStorageService.userZoom['id'] : null;

		this.dashboardService.getGranularities(null, null, this.userId).subscribe(
			result => {

				this.isUpdateGranularities = true;

				this.matrixesFilter = result.data.granularities.map((matrix: any) => ({
					title: matrix.name,
					completed: this.getMatrix ? this.getMatrix.includes(matrix.id) : false,
					color: 'primary',
					showDomains: false,
					id: matrix.id,
					domains: matrix.domains ? matrix.domains.map((domain: any) => ({
						id: domain.id,
						title: domain.title,
						completed: matrix.completed ? true : this.getDomain ? this.getDomain.includes(domain.id) : false,
						color: 'primary',
						showSkills: false,
						skills: domain.skills ? domain.skills.map((skill: any) => ({
							id: skill.id,
							title: skill.title,
							completed: matrix.completed ? true : this.getSkill ? this.getSkill.includes(skill.id) : false,
							color: 'primary',
							showThemes: false,
							themes: skill.themes ? skill.themes.map((theme: any) => ({
								id: theme.id,
								title: theme.title,
								completed: matrix.completed ? true : this.getTheme ? this.getTheme.includes(theme.id) : false,
								color: 'primary',
								showAcquisitions: false
							})) : []
						})) : []
					})) : []
				}));

				this.isUpdateGranularities = true;
			}
		);
	}

	initialiseZoomValues() {
		this.zoomUserValue = FiltersStorageService.isUserZoom ? FiltersStorageService.userZoom.id : null;

		if (this.zoomUserValue != null) {
			let userExist = false;
			this.users.forEach((user: any) => {
				if (user.id === this.zoomUserValue) {
					userExist = true;
				}
			});

			if (!userExist) {
				this.users.push({
					id: this.zoomUserValue,
					fullName: FiltersStorageService.userZoom.title
				})
			}
		}

		this.zoomFormationValue = FiltersStorageService.formationZoom;
	}

	filterOrga(orga: any, orgaFilter: any) {

		if (orgaFilter && orgaFilter != "") {
			return orga.name.toLowerCase().includes(orgaFilter.toLowerCase());

		}
		return true;
	}

	filterFormationThemes(theme: any, formaFilter: any) {
		if (formaFilter && formaFilter != "") {
			return theme.title.toLowerCase().includes(formaFilter.toLowerCase());
		}
		return true;
	}

	/**
	 * Permet de setup les array via les informations dans le storage
	 */
	initArrayInStorage(): any {
		/* Organisations */
		if (this.getOrganisations) {
			this.getOrganisations.forEach((element: any) => this.organisationStorage.push(element));
		}

		/* Formations */
		if (this.getMatrix) {
			this.getMatrix.forEach((element: any) => this.matrixStorage.push(element));
		}

		if (this.getDomain) {
			this.getDomain.forEach((element: any) => this.domainStorage.push(element));
		}

		if (this.getSkill) {
			this.getSkill.forEach((element: any) => this.skillStorage.push(element));
		}

		if (this.getTheme) {
			this.getTheme.forEach((element: any) => this.themeStorage.push(element));
		}
	}


	addOrganisationInStorage(array: any, element: any, parentElement: any, e: { checked: any; }): any {

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

	addFormationInStorage(array: any, element: any, parentElement: any, e: { checked: any; }): any {
		if (e.checked) {
			FiltersStorageService.addFilteredFormation(element, parentElement);
		} else {
			FiltersStorageService.removeFilteredFormation(element);
		}
		switch (array) {
			case 'matrix':
				this.removeValueToAnArray(this.matrixStorage, element, e);
				FiltersStorageService.matrix = this.matrixStorage;
				this.toggleCheckbox(element, "domains", e.checked);
				break;
			case 'domain':
				this.removeValueToAnArray(this.domainStorage, element, e);
				FiltersStorageService.domain = this.domainStorage;
				this.toggleCheckbox(element, "skills", e.checked);
				this.checkIfUnCheckParents(array, parentElement, element, e);
				break;
			case 'skill':
				this.removeValueToAnArray(this.skillStorage, element, e);
				FiltersStorageService.skill = this.skillStorage;
				this.toggleCheckbox(element, "themes", e.checked); // A rajouter dès qu'on rajoute un élément
				this.checkIfUnCheckParents(array, parentElement, element, e);
				break;
			case 'theme':
				this.removeValueToAnArray(this.themeStorage, element, e);
				FiltersStorageService.theme = this.themeStorage;
				this.checkIfUnCheckParents(array, parentElement, element, e);
				//  
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

	checkIfUnCheckParents(granularity: string, parentElement: any, element: any, e: any) {
		//Si on vient de cocher la checkbox pas besoin d'uncheck au dessus
		if (e.checked) {
			return;
		}

		if (granularity === "domain") {
			const isRemainingChild = parentElement.domains.filter((domain: any) => domain.completed === true).length > 0;
			if (!isRemainingChild) {
				this.removeValueToAnArray(this.matrixStorage, parentElement, { checked: false });
				FiltersStorageService.matrix = this.matrixStorage;
			}
		}

		if (granularity === "skill") {
			let domainParent: any;
			parentElement.domains.forEach((domain: any) => {
				domain.skills.forEach((skill: any) => {
					if (skill.id == element.id) {
						domainParent = domain;
					}
				});
			});
			if (!domainParent) {
				return;
			}
			const isRemainingChild = domainParent.skills.filter((skill: any) => skill.completed === true).length > 0;
			if (!isRemainingChild) {
				this.removeValueToAnArray(this.domainStorage, domainParent, { checked: false });

				FiltersStorageService.domain = this.domainStorage;

				this.checkIfUnCheckParents("domain", parentElement, domainParent, e);

			}
		}

		if (granularity === "theme") {
			let skillParent: any;
			parentElement.domains.forEach((domain: any) => {
				domain.skills.forEach((skill: any) => {
					skill.themes.forEach((theme: any) => {
						if (theme.id == element.id) {
							skillParent = domain;
						}
					});
				});
			});
			if (!skillParent) {
				return;
			}

			const isRemainingChild = skillParent.themes.filter((theme: any) => theme.completed === true).length > 0;
			if (!isRemainingChild) {
				this.removeValueToAnArray(this.skillStorage, skillParent, { checked: false });
				FiltersStorageService.skill = this.skillStorage;
				this.checkIfUnCheckParents("skill", parentElement, skillParent, e);
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

					case "domains":
						this.removeValueToAnArray(this.domainStorage, subElement, { checked });
						FiltersStorageService.domain = this.domainStorage;
						break;
					case "skills":
						this.removeValueToAnArray(this.skillStorage, subElement, { checked });
						FiltersStorageService.skill = this.skillStorage;
						break;
					case "themes":
						this.removeValueToAnArray(this.themeStorage, subElement, { checked });
						FiltersStorageService.theme = this.themeStorage;
						break;
				}

				this.toggleCheckbox(subElement, this.getSubElement(granularityType), checked);
			});
		}
	}

	getSubElement(granularityType: string) {
		switch (granularityType) {
			case "matrixes":
				return "domains";
			case "domains":
				return "skills";
			case "skills":
				return "themes";

			case "parent":
				return "childs";
			case "childs":
				return "childs";
		}

		return "matrixes";
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

	/**
	 * Filtre qui permet de trier toutes les données
	 */
	filterContent(): any {
		this.refreshGraphics();
	}

	refreshOrganisationFilter(): any {
		this.eventEmitterService.callChangeOrganisationFilter();
	}

	refreshFormationName(): any {
		this.eventEmitterService.callChangeFormationFilter();
	}

	refreshGraphics(): any {
		this.eventEmitterService.callRefreshGraphics();
	}

	filterReseted(): any {
		this.eventEmitterService.callFilterReseted();
	}

	/**
	 * Ajout des contenus dans le filtres
	 */
	addBeginDate(value: any): any {
		this.beginDate = value;
		FiltersStorageService.beginDate = this.beginDate;
	}

	addEndDate(value: any): any {
		this.endDate = value;
		FiltersStorageService.endDate = this.endDate;
	}

	/**
	 * Mettre les informations dans le storage
	 * 
	 * UTILISE moment.js POUR LES DATES (CA CHANGE TOUT LE BACK PIOU PIOU)
	 */
	setDateStorage(): any {
		this.getDateBegin = FiltersStorageService.beginDate;
		this.serializedDateBegin = new FormControl(new Date(this.getDateBegin).toISOString());

		this.getDateEnd = FiltersStorageService.endDate;
		this.serializedDateEnd = new FormControl(new Date(this.getDateEnd).toISOString());
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

	/**
	 * Permet de compter le nombre d'éléments dans les filtres
	 * @param filterName 
	 * @returns 
	 */
	countElementsInFilter(filterName: string): number | null {

		const returnIfEmpty = 0;
		let total = 0;

		switch (filterName) {
			case 'organisations':
				total += FiltersStorageService.organisations ? FiltersStorageService.organisations.length : returnIfEmpty;
				break;
			case 'formations':
				total += FiltersStorageService.matrix ? FiltersStorageService.matrix.length : returnIfEmpty;
				break;
		}

		return total === 0 ? null : total;
	}


	resetFilter(needAllFilters: boolean = false, filterName: string = '' ): any {
		FiltersStorageService.resetFilters();

		this.resetPrivateFilter(filterName, false, needAllFilters);

		this.getDateBegin = FiltersStorageService.beginDate;
		this.getDateEnd = FiltersStorageService.endDate;
		this.setDateStorage();

		this.zoomUserValue = "";
		this.isResearchUp = false;
		this.userFilter = "";

		this.zoomFormationValue = 0;

	}

	resetPrivateFilter(filterName: string, needToDisplayModals: boolean = false, needAllFilters: boolean = true) {
		if(filterName === 'organisations' || needAllFilters){
			FiltersStorageService.resetOrganisations();
			FiltersStorageService.resetFilteredOrganisations();

			this.getOrganisations = [];
			this.organisation = [];
			this.organisationStorage = [];

			this.organisationsList.forEach((element: any) => {
				element.completed = false;
			});

			this.updateCompanies();

			if(this.modalFilterOrganisation){
				needToDisplayModals ? this.displayModalOrganisations() : '';
			}

			// needToDisplayModals ? this.displayModalOrganisations() : '';
		}
		
		if (filterName === 'formations' || needAllFilters){
			FiltersStorageService.resetFilterFormations();
			FiltersStorageService.resetFilterFormationsID();
			FiltersStorageService.resetFilteredFormations();

			this.getMatrix = [];
			this.getDomain = [];
			this.getSkill = [];
			this.getTheme = [];

			this.matrixStorage = [];
			this.domainStorage= [];
			this.skillStorage = [];
			this.themeStorage = [];

			this.matrixesFilter.forEach((matrix: any) => {
				matrix.completed = false;
				matrix.domains.forEach((domain: any) => {
					domain.completed = false;
					domain.skills.forEach((skill: any) => {
						skill.completed = false;
						skill.themes.forEach((theme: any) => {
							theme.completed = false;
						});
					});
				});
			});

			if(this.modalFilterFormations){
				needToDisplayModals ? this.displayModalFormations() : '';
			}

		}

		this.totalNumberOfFormationsFiltered = this.countElementsInFilter('formations');
		this.totalNumberOrganisationsFiltered = this.countElementsInFilter('organisations');
		this.refreshGraphics();
	}

	/**
	 * Liste des modals
	 */
	displayModalFormations(): any {
		this.modalFilterFormations = !this.modalFilterFormations;
	}

	updateFilterFormations(): any {
		this.displayModalFormations();

		//Si on referme la modal, on rafraichit les filtres
		if (this.modalFilterFormations === false) {
			this.refreshGraphics();
			this.totalNumberOfFormationsFiltered = this.countElementsInFilter('formations');
		}
	}

	updateFilterOrganisations(): any {
		this.displayModalOrganisations();

		//Si on referme la modal, on rafraichit les filtres
		if (this.modalFilterOrganisation === false) {
			this.refreshOrganisationFilter();
			this.refreshGraphics();
			this.totalNumberOrganisationsFiltered = this.countElementsInFilter('organisations');
		}
	}

	displayModalOrganisations(): any {
		this.modalFilterOrganisation = !this.modalFilterOrganisation;
	}

	displayModalDate(): any {
		this.modalFilterDate = !this.modalFilterDate;
	}


	/**
	 * Selection de la langue (Pour les dates)
	 */
	french(): any {
		this._adapter.setLocale('fr');
	}

	/***************************************
	 * PARTIE SUR LES SLIDERS (ZOOM) 
	 ***************************************/

	/************* UTILISATEUR ************/

	/* Permet d'obtenir la saisie de l'utilisateur */
	researchUser(value: any) {
		this.returnUsers = [];
		this.filterService.researchUsers(value.toLowerCase()).subscribe(
			result => {
				result.data.researchUsers.forEach((element: any) => {
					this.returnUsers.push(element);
				});

				this.returnUsers = [];
			}
		)
		return this.returnUsers;
	}

	/* Afficher les valeurs */
	displayObjectName(val: any): any {
		return val ? val.fullName : val
	}

	/* Que se passe t-il quand on clique sur une valeur ? */
	selectUser(value: any) {
		FiltersStorageService.userZoom = value;
		this.isResearchUp = true;
		this.fullnameUser = value.fullName;

	}

	/* On souhaite changer d'utilisateur */
	deselectUser(event: any) {
		this.isResearchUp = false;
		this.userFilter = "";
		FiltersStorageService.resetUserZoom();
		event.stopPropagation();
		this.refreshGraphics();
	}
	/*********************************************************/
}
