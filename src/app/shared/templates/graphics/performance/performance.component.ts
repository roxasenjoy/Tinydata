import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { SettingsStorageService } from '../../../consts/settingsStorage';
import { FiltersStorageService } from '../../../consts/filtersStorage';
import { GranularitiesStorage } from '../../../consts/granularitiesStorage';
import { EventEmitterService } from '../../../services/event-emitter.service';
import * as echarts from 'echarts';
import { COLOR_MATRIX, COLOR_DOMAIN, COLOR_SKILL, COLOR_THEME } from 'src/app/shared/consts/colors';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';

@Component({
	selector: 'app-performance',
	templateUrl: './performance.component.html',
	styleUrls: ['./performance.component.css']
})
export class PerformanceComponent implements OnInit {

	nameFormationFilter: string = "PerformanceFormationSelected";
	filterSelected: string | null = localStorage.getItem(this.nameFormationFilter);

	canShowGraphicPerformance: boolean = false;

	// Profondeur de l'utilisateur
	depthList: Array<string> = ['matrix', 'domain', 'skill', 'theme'];
	depthIndex: number = 0; // Emplacement de l'utilisateur dans la liste depthList
	depthClickedID: number | null = null;

	// Gestion des retours en arrière
	listZoomName: Array<string | null> = [null, 'Retour aux formations', ' Retours aux domaines', 'Retour aux compétences'];
	backMessage: string | null;

	// Liste des textes se trouvant au milieu du cercle
	listTextCenter: Array<string> = ['Formation', 'Domaine', 'Compétences', 'Thèmes'];

	// Fil d'ariane à droite du graphique
	listIdGranularity: Array<number | null> = [null, null, null, null];
	listNameGranularity: Array<string | null> = [];

	//Affichage de la modal avec tous les utilisateurs
	showDetails: boolean = false;

	userData!: any[] | boolean;
	isUser = false;
	myChart: any;


	/* Palette de couleurs (Change à chaque étapes) */
	colorPalette = [COLOR_MATRIX, COLOR_DOMAIN, COLOR_SKILL, COLOR_THEME]


	// Envoyer les informations au parent
	@Output() public performanceData = new EventEmitter<string>();
	@Output() public extendedData = new EventEmitter<any[]>();

	constructor(
		public dashboardService: DashboardService,
		public settingsStorageService: SettingsStorageService,
		public filters: FiltersStorageService,
		public granularities: GranularitiesStorage,
		private eventEmitterService: EventEmitterService,
		private RequestV2Service: RequestV2Service
	) {
	}

	ngOnInit(): any {

		this.eventEmitterService.refreshGraphics.subscribe(() => {
			this.canShowGraphicPerformance = false;
		});
	}

	/**
   * S'effectue à chaque fois que list-formation subit un changement
   * @param graphicFormationFilterID 
   */
	updateData(graphicFormationFilterID: any) {
		this.filterSelected = localStorage.getItem(this.nameFormationFilter);
		if (graphicFormationFilterID !== this.filterSelected) {
			this.myChart ? this.myChart.dispose() : '';
			this.resetGraphicVariables();
			this.getData();
		}
	}

	getData() {
		this.canShowGraphicPerformance = false;
		this.myChart ? this.myChart.dispose() : '';

		const nameDepth = this.depthList[this.depthIndex];
		const depthClickedID = this.depthClickedID;
		const filterSelected = this.filterSelected;
		const depthIndex = this.depthIndex;

		FiltersStorageService.specificGraphData('performance', { nameDepth, depthClickedID, filterSelected, depthIndex });

		this.RequestV2Service.getData('performance', { nameDepth, depthClickedID, filterSelected, depthIndex }).subscribe(
			(result: any) => {
				result = JSON.parse(result.data.graphData.data);
				this.getGraphic(result.dataGraphic, result.dataExtended);
				this.canShowGraphicPerformance = true;
			}
		)

		this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
			if ("PERFORMANCE" in graphSelected || graphSelected.includes("PERFORMANCE")) {
				this.getData();
			}
		});
	}

	goBackGranularity() {

		if (this.depthIndex != 0) {
			this.myChart.dispose();
			this.listIdGranularity[this.depthIndex] = null; // Ajout des IDs
			this.depthIndex--;

			// Ajouter le retour bouton pour revenir à la granularité précédente
			this.backMessage = this.listZoomName[this.depthIndex];

			// Update le graphique sur la formation que nous venons de cliquer
			this.depthClickedID = this.listIdGranularity[this.depthIndex];

			// Ajouter la granularité précédente à droite
			this.listNameGranularity.pop();

			this.getData();
		}
	}

	resetGraphicVariables() {
		this.depthClickedID = null;
		this.depthIndex = 0;
	}

	getGraphic(dataGraphic: any, dataExtended: any) {

		this.myChart = this.myChart ? this.myChart.clear() : '';

		if (!this.myChart) {
			const element: any = document.getElementById('performanceData') as HTMLElement;
			const myChart: any = this.myChart = echarts.init(element);

			this.performanceData.emit(this.myChart);
			this.extendedData.emit(dataExtended);
			myChart.resize();

			let option;

			option = {

				/* Texte au milieu du cercle */
				title: dataGraphic.length === 0 ? this.setMessageWhenNoData() : this.setGranulrityAtTheCenter(),
				tooltip: {
					trigger: 'item'
				},

				/*  Détermine ce qu'on doit afficher et comment */
				series: [
					{
						type: 'pie',				// Type -> Quel graphique on utilise ? 
						radius: ['40%', '70%'],		// Vu que c'est un pie, quel radius doit-il avoir ? 
						center: ['50%', '50%'],
						textAlign: 'center',
						triggerEvent: true,
						color: this.colorPalette[this.depthIndex],	// Couleurs -> voir la palette de couleurs (colors.ts)
						label: {
							normal: {
								trigger: 'item',
								show: true,
								color: localStorage.getItem('night') === "true" ? '#b2b2b2' : '#000',
								formatter: function (params: { data: { value: any; name: any; }; }) {
									return params.data.value + '% • ' + params.data.name;
								},
							},					// Changement du format pour l'écriture qui se trouve hors du cercle

							textStyle: {
								fontSize: 20	// Taille du texte en dehors du cercle
							},

						},

						data: dataGraphic.filter((data: any) => {
							return data.value > 0 // A CHANGER EN 0
						}),
					},
					{

						// On refait le graphique pour permettre la création pour avoir le reste du graphique
						type: 'pie',
						radius: ['40%', '70%'],
						center: ['50%', '50%'],
						textAlign: 'center',
						label: {
							normal: {
								show: true,
								position: 'center',
								formatter: 'Total', // Je ne sais pas où
								align: 'center',
								verticalAlign: 'middle',
								textStyle: {
									fontSize: 0
								},
							},
						},

						tooltip: {
							trigger: 'item',
							formatter: (params: any) => { // Design quand on passe la souris sur une valeur du graphique
								return `
							<div style="
					  display: flex;
					  align-items: center;
				  ">
			   <div style="background-color: ${params.color}; border-radius:50%; width:15px; height: 15px; margin-right:10px"></div>
					<div>
						<span style="padding-right: 20px"><strong>${params.data.value} %</strong> • ${params.data.name}</span>  <br>
					</div>
					</div>`;
							}
						},

						data: dataGraphic.filter((data: any) => {
							return data.value > 0 // A CHANGER EN 0
						}),
					},

				]
			};

			// Action dès qu'on clique sur un endroit du graphique (Hors légende)
			this.myChart.on('click', (params: any) => {
				if (this.depthIndex < 3) {
					this.myChart.dispose();

					// Ajouter le retour bouton pour revenir à la granularité précédente
					this.depthIndex++;
					this.backMessage = this.listZoomName[this.depthIndex];

					// Ajouter la granularité précédente à droite
					this.listIdGranularity[this.depthIndex] = params.data.granularityID; // Ajout des IDs
					this.listNameGranularity[this.depthIndex] = params.data.name; // Ajout des noms 

					// Update le graphique sur la formation que nous venons de cliquer

					this.depthClickedID = params.data.granularityID;
					this.getData();
				}

			});

			window.addEventListener('resize', function () {
				myChart.resize();
			});

			// Setup toutes les options pour la graphique
			// @ts-ignore
			this.myChart.setOption(option);

			setTimeout(() => {
				myChart.resize();
			}, 0)
		}


	}


	/**
	 * Permet de mettre le texte se trouvant au center du cercle
	 * + permet de set le bouton retour
	 */
	setGranulrityAtTheCenter() {
		return {
			text: this.listTextCenter[this.depthIndex],
			textStyle: {
				fontSize: 16,
				color: localStorage.getItem('night') === "true" ? '#b2b2b2' : '#000',
			},
			x: 'center',
			y: 'center',
		}
	}

	/*
	* Message qui prévient que le graphique n'a aucune donnée
	*/
	setMessageWhenNoData() {
		return {
			// text: this.backData,
			show: true,
			left: "center",
			top: "center",
			triggerEvent: true,
			textStyle: {
				color: '#a24bfe',
				fontWeight: 400,
				fontSize: 10,
			},
			subtext: 'Aucune donnée disponible',
			subtextStyle: {
				color: "grey",
				fontSize: 20
			}
		}
	}
}
