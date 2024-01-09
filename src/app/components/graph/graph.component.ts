import { MatSort, Sort } from '@angular/material/sort';
import { AfterViewInit, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { GranularitiesStorage } from 'src/app/shared/consts/granularitiesStorage';
import { graphicsSettings } from 'src/app/shared/consts/graphicsSettings';
import { User } from 'src/app/shared/models/user';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';
import { ExportService } from 'src/app/shared/services/export.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { SettingsStorageService } from "../../shared/consts/settingsStorage";
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FiltersStorageService } from 'src/app/shared/consts/filtersStorage';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

import { Apollo } from 'apollo-angular';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';
import { JwtService } from 'src/app/shared/services/jwt.service';

import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterViewInit {

	user = new User();
	companyName: any;

	myColor = 'rgba(191,170,143,0.15)'; //Couleur des boutons d'exportation
	titleHeader = '';
	pageExist = true;
	showModal = false;
	activeModal = false;
	isEndReached = true;
	rightPosition: any;
	emailOpenAccounts: any;
	openAccountdisplayedColumns: string[] = ['Roles', 'Groupe principal', 'Groupe', 'Formation', 'Prénom', 'Nom', 'Adresse email', "Date de la première connexion"]; setIndex = 0;
	allEmailOpenAccounts: any;

	links = [{
		title: "Graphique",
		icon: "show_chart",
		name: "GRAPH"
	},
	{
		title: "Données",
		icon: "table_chart",
		name: "DATA"
	}];

	activeLink = this.links[0];

	graphToShow: any;
	currentGraph: any;
	extendedData: boolean = false;

	columns: any;
	displayedColumns: any = [];
	dataSource: MatTableDataSource<any> = new MatTableDataSource();
	dataLoading: boolean = true;
	precision: string = "MONTH";

	//Export arrays
	graphList: Map<string, any> = new Map<string, any>();
	graphData: Map<string, any> = new Map<string, any>();
	additionnalData: any;
	graphSelected = Array();
	secondHeaderRow: any;

	public isPossibleToExportInPDF = true;

	// PAGINATION ET TRI DU TABLEAU
	@ViewChild('paginatorLegal') paginatorLegal: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		public settingsStorageService: SettingsStorageService,
		public route: ActivatedRoute,
		public router: Router,
		private exportService: ExportService,
		private profileService: ProfileService,
		private dashboardService: DashboardService,
		private apollo: Apollo,
		private eventEmitterService: EventEmitterService,
		public granularities: GranularitiesStorage,
		private _liveAnnouncer: LiveAnnouncer,
		private requestV2Service: RequestV2Service,
		private jwtService: JwtService
	) { }

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginatorLegal;
		this.dataSource.sort = this.sort;
	}

	ngOnInit(): void {

		/** Rajoute les settings **/
		this.graphToShow = this.route.snapshot.paramMap.get('graphName');

		if (!['CONNECTIONS', 'PERFORMANCE', 'ANALYTICS_TIME', 'CONTENTS_VALID', 'GENERAL_PROGRESSION', 'FEEDBACK', 'OPENACCOUNTS', 'USER_CONTRIBUTIONS', 'TOTAL_APPRENANTS', 'TOTAL_CONNECTIONS_EXTENDED', 'TOTAL_LEARNING_TIME', 'TOTAL_CONTENTS_VALID', 'TOTAL_CONTENTS_FAILED', 'RAPPELS_MEMO'].includes(this.graphToShow)) {
			this.pageExist = false;
			return;
		}

		this.isPossibleToExportInPDF = this.graphToShow === 'USER_CONTRIBUTIONS';

		// Récupération de l'utilisateur
		this.profileService.getUser().subscribe(
			result => {
				this.user = result.data.user;
				this.companyName = result.data.user.companyName;
			}
		);

		if(this.graphToShow === 'CONNECTIONS'){
			setTimeout(() => {
				this.chooseColumn();
			}, 100)
		}

		//Vérification
		this.verifyIfUserIsNeeded();

		//@ts-ignore
		this.currentGraph = graphicsSettings[this.graphToShow]
		this.titleHeader = this.currentGraph.zoomTitle;
		this.settingsStorageService.getStorageSettings();
		this.columns = this.currentGraph.dataColumns;
		this.displayedColumns = this.filterColumn(this.columns);

		this.eventEmitterService.newGraphLoading.subscribe(() => {
			// d'abord changer la valeur des variables...
			this.extendedData = true;
			this.dataLoading = true;
			// ensuite récupérer les données
			setTimeout(() => {
				// this.chooseColumn();
			}, 100)
		})

		this.eventEmitterService.refreshGraphics.subscribe(() => {
			this.verifyIfUserIsNeeded();
			this.goToGraphTab();
		   }
		);

		// Permet de filtrer les éléments grâce à la barre de recherche
		this.dataSource.filterPredicate = (data: any, filter: string) => {

			switch (this.graphToShow) {
				case "PERFORMANCE":
					return (
						data.title.toLowerCase().includes(filter) || // Titre
						data.companyName.toLowerCase().includes(filter) || // Groupe
						data.firstname.toLowerCase().includes(filter) || // Prénom
						data.lastname.toLowerCase().includes(filter) || // Nom
						data.email.toLowerCase().includes(filter) || // Email
						data.value.toString().includes(filter)                            // Pourcentage
					);

				case "CONNECTIONS":
					// 4 0 7 6 8 1 9
					return (
						data[4].toLowerCase().includes(filter) || // Groupe
						moment.unix(data[0]).format("DD/MM/YYYY").includes(filter) || // Date
						data[7].toLowerCase().includes(filter) || // Nom
						data[6].toLowerCase().includes(filter) || // Prénom
						data[8].toLowerCase().includes(filter) || // Email
						data[1].toString().includes(filter) || // Nb Connexions du mois
						data[9].toString().includes(filter)                            // Nb Connexions total
					);
				case "ANALYTICS_TIME":
					let lastInteraction = data.lastInteraction != null ? data.lastInteraction : "";
					return (
						lastInteraction.toLowerCase().includes(filter) || // Groupe
						data.firstName.toLowerCase().includes(filter) || // Prénom
						data.lastName.toLowerCase().includes(filter) || // Nom
						data.email.toLowerCase().includes(filter)                         // Email
					);

				case "FEEDBACK":
					return (
						data.code.toLowerCase().includes(filter) ||  // Code du contenu
						data.firstName.toLowerCase().includes(filter) || // Prénom de l'utilisateur
						data.lastName.toLowerCase().includes(filter) || // Nom de l'utilisateur
						data.levelContent.toString().includes(filter) ||  // Niveau du contenu
						data.email.toLowerCase().includes(filter) ||   // Email de l'utilisateur
						data.title.toLowerCase().includes(filter) ||  // Nom du contenu
						data.message.toLowerCase().includes(filter)                 // Message de l'utilisateur
					);

				case "USER_CONTRIBUTIONS":
					return (
						data.message.toLowerCase().includes(filter) ||
						data.firstName.toLowerCase().includes(filter) ||
						data.lastName.toLowerCase().includes(filter) ||
						data.groupePrincipal.toString().includes(filter) ||
						data.groupe.toLowerCase().includes(filter) ||
						data.message.toLowerCase().includes(filter) ||
						data.nameMatrix.toLowerCase().includes(filter) ||  // Nom de la formation
						data.nameDomain.toLowerCase().includes(filter) ||  // Nom du domaine
						data.nameSkill.toLowerCase().includes(filter) || // Nom de la compétence
						data.nameTheme.toLowerCase().includes(filter) || // Nom du thème
						data.nameAcquis.toLowerCase().includes(filter) ||  // Nom de l'acquis
						data.nameContent.toLowerCase().includes(filter)                 // Nom du contenu
					);

				case "OPENACCOUNTS":
					return (
						data.name.toLowerCase().includes(filter) || // Nom de l'entreprise
						data.formationName.toLowerCase().includes(filter)            // Nom de la formation
					);

				case "CONTENTS_VALID":
					return (
						data.nameMatrix.toLowerCase().includes(filter) ||  // Nom de la formation
						data.nameDomain.toLowerCase().includes(filter) ||  // Nom du domaine
						data.nameSkill.toLowerCase().includes(filter) || // Nom de la compétence
						data.nameTheme.toLowerCase().includes(filter) || // Nom du thème
						data.nameAcquis.toLowerCase().includes(filter) ||  // Nom de l'acquis
						data.nameContent.toLowerCase().includes(filter) ||   // Nom du contenu
						data.email.toLowerCase().includes(filter)                  // Statut du contenu
					);

				case 'RAPPELS_MEMO':
					return (
						data.firstName.toLowerCase().includes(filter) ||
						data.lastName.toLowerCase().includes(filter) ||
						data.email.toLowerCase().includes(filter) 		||
						data.groupePrincipal.toString().includes(filter) ||
						data.groupe.toLowerCase().includes(filter) ||
						data.matrixName.toLowerCase().includes(filter) ||  // Nom de la formation
						data.acquisName.toLowerCase().includes(filter) ||  // Nom de la formation
						data.current_box.toString().includes(filter) ||
						data.memory_retention_rate.toString().includes(filter) ||
						data.percentage_failed.toString().includes(filter)
					);

				default:
					return true;
			}

		}
		this.secondHeaderRow = this.columns.map((c: any) => c.columnDef + '_low');
	}

	// Tri du tableau
	announceSortChange(sortState: Sort) {
		if (sortState.direction) {
			this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
		} else {
			this._liveAnnouncer.announce('Sorting cleared');
		}
	}

	// Obtenir tous les emails qui ont un compte ouverte pour l'entreprise cliquée
	getEmailOnBoarded(rowData: any) {
		if (this.graphToShow === 'OPENACCOUNTS') {
			this.activeModal = true;
			this.emailOpenAccounts = rowData.allEmails;
		}

	}

	// Set le nouvel index pour l'affichage des bonnes informations lorsqu'on clique sur un élément
	onPaginateChange(e: any) {
		this.setIndex = e.pageIndex * e.pageSize;
		if (e.pageIndex === 0) {
			this.setIndex = e.pageSize;
		}
	}

	closeModal() {
		this.activeModal = false;
	}

	getCurrentGranularity() {
		let granularity = this.dataSource.data[0]["__typename"];
		if (this.graphToShow === 'FEEDBACK' || this.graphToShow === 'PERFORMANCE') {
			return this.dataSource.data[0]["depth"].toLowerCase();
		}
		return granularity.toLowerCase();
	}

	goToGraphTab() {
		this.activeLink = this.links[0];
	}

	/**
	 * Détermine si on a touché le fond de la scrollbar horizontal
	 * @param event 
	 */
	@HostListener('window:scroll', ['$event'])
	onScroll(event?: Event) {
		const table = document.querySelector('#table__graphExtended') as HTMLElement;

		let difference = function (num1: number, num2: number) {
			return Math.abs(num1 - num2);
		}

		this.isEndReached = difference(Math.trunc(table.scrollLeft), (table.scrollWidth - table.clientWidth)) < 10 ? true : false;

		const right = table.scrollLeft - 50;
		this.rightPosition = -right;

	}

	onClickTab(link: any) {
		this.activeLink = link;
		if (link.name === "GRAPH") {
			let graph = this.graphList.get(this.graphToShow);

			if (graph) {
				setTimeout(function () {
					window.dispatchEvent(new Event('resize'));
				}, 0)
			}
		}
	}

	getChart(graphName: any, graph: any) {
		this.graphList.set(this.graphToShow, graph);
		//If export here, it's only and obligatory this graph 
		this.graphSelected[this.graphToShow] = true;
	}

	/**
	 * Ajouter des données addionnelles au PDF
	 * @param event 
	 */
	getAdditionnalData(event: any) {
		this.additionnalData = event;
	}

	/**
	 * Ajouter les données aux PDF
	 * @param data 
	 */
	getData(data: any) {
		this.dataLoading = false;
		this.dataSource.data = data;
		this.graphData.set(this.graphToShow, data);
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	setPrecision(data: any) {
		this.precision = data;
		if (this.precision !== "MONTH") {
			this.columns = this.currentGraph.dataColumns.filter((e: any) => e.columnDef !== 'count');
		}
		setTimeout(() => {
			this.displayedColumns = this.filterColumn(this.columns);
		}, 0)

	}
	makeExport() {
		this.showModal = true;
	}

	changeDataType(event: any) {
		this.dataLoading = true;
		this.chooseColumn();
	}

	chooseColumn() {
		this.eventEmitterService.callExtendedGraphData([this.graphToShow]);
		this.columns = this.currentGraph.dataColumns;
		this.displayedColumns = this.filterColumn(this.columns);
	}

	filterColumn(columns: any) {

		return columns.filter(function (c: any) {

			if (c.condition) {
				return c.condition();
			}

			return true;

		}).map((c: any) => c.columnDef);
	}

	async startExport(exportData: any) {

		switch (exportData.type) {
			case "PNG":
				this.exportService.exportPNG(this.graphList, this.graphSelected);
				break;
			case "CSV":
			case "EXCEL":
				const resultats = Object.keys(this.graphSelected).filter((cle: any) => this.graphSelected[cle] === true);
				const graphs = encodeURIComponent(JSON.stringify(resultats));
				const filters = encodeURIComponent(JSON.stringify(this.requestV2Service.setFilterType()));
				const specificGraphData = localStorage.getItem('export');
				const encodedData = specificGraphData ? encodeURIComponent(specificGraphData) : '';
				const token = this.jwtService.getToken();
				const url = environment.host + `export
							?graphs=${graphs}
							&type=${exportData.type}
							&filters=${filters}
							&specificGraphData=${encodedData}
							&token=${token}`;
				window.location.assign(url);
				break;
			case "PDF":
			default:
				this.exportService.exportPDF(this.graphList, this.graphData, this.graphSelected, exportData, this.companyName, this.extendedData, null, this.additionnalData);
				break;
		}
		
		this.cancelExportModal();
	}

	cancelExportModal() {
		this.showModal = false;
	}

	// Vérifier si le filtre utilisateur est présent. Si ce n'est pas le cas, on retourne au dashboard
	verifyIfUserIsNeeded() {
		if (['CONTENTS_VALID', 'GENERAL_PROGRESSION'].includes(this.graphToShow)) {
			if (!FiltersStorageService.userZoom) {
				this.goToDashboard();
			}
		}
	}

	goToDashboard() {
		this.router.navigate(['dashboard']);
	}
}

