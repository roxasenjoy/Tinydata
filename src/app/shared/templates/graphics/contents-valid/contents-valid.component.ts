import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as echarts from 'echarts';
import { FiltersStorageService } from 'src/app/shared/consts/filtersStorage';
import { GranularitiesStorage } from 'src/app/shared/consts/granularitiesStorage';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';
import { zoomInterface } from 'src/app/shared/models/type';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';

@Component({
	selector: 'app-contents-valid',
	templateUrl: './contents-valid.component.html',
	styleUrls: ['./contents-valid.component.css']
})

/**
 * Graphique : VALIDATIONS DES CONTENUS
 * 
 * Ce graphique à une vue :
 *      Utilisateur : Affiche si les contenus sont validés, échoués ou non effectués. 
 * 
 * Rouge = % < 50%
 * Vert  = % >= 50%
 * Noir  = Non effectué
 */
export class ContentsValidComponent implements OnInit {

	nameFormationFilter = 'ContentValidFormationSelected'

	/* État des filtres - Non pris en compte pour le moment */
	isArticle = false;
	isPlay = false;
	isSound = false;
	isBrain = false;
	/*******************/

	/* Afficher le graphique/loading */
	isReadyGraphic = false;
	isReadyFormationsList = false;
	displayGraphic = false;
	/*********************************/

	category = [ // Création de toutes les catégories (Article, videos, sons, rich média)
		{
			name: 'Non validé',
			itemStyle: {
				color: '#FF404C'
			}
		},
		{
			name: 'Validé',
			itemStyle: {
				color: '#00EECA'
			}
		},
		{
			name: 'Non effectué',
			itemStyle: {
				color: '#D4D8D6'
			}
		}
	];

	/* Fonctionne du Zoom */
	isZoom: zoomInterface = {
		min: 1,
		max: 1
	};

	/* Affichage des formations */
	filterSelected: any = null;

	/* Information du graphique pour l'export */
	chart: any;
	showDetails = false;

	/* Liste des noms de toutes les granularités    */
	formationName = 'Aucune formation sélectionnée';
	domainName = '';
	skillName = '';
	themeName = '';
	acquisName = '';
	/************************************************/

	/* Total des contenus validés/échoués/Totaux */
	contentValidated: number;
	contentFailed: number;
	contentNeverDone: number;
	contentTotal: number;

	@Output() public contentsValidData = new EventEmitter<string>();
	@Output() public extendedData = new EventEmitter<any[]>();
	@Output() public additionnalData = new EventEmitter<any[]>();

	constructor(
		public granularities: GranularitiesStorage,
		private eventEmitterService: EventEmitterService,
		private RequestV2Service: RequestV2Service
	) {
	}

	ngOnInit(): void {
		this.eventEmitterService.refreshGraphics.subscribe((isPerfectData: boolean) => {
			if (!isPerfectData) {
				this.displayGraphic = false;
				this.isReadyGraphic = false;
			} else {
				this.getGraphicData();
			}
		});

		this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
			if ("CONTENTS_VALID" in graphSelected || graphSelected.includes("CONTENTS_VALID")) {
				this.getGraphicData();
			}
		});
	}

	/**
  * Travail avec : list-formation.component.ts pour la gestion du filtre
  * @param graphicFormationFilterID 
  */
	updateData(graphicFormationFilterID: any) {
		this.filterSelected = graphicFormationFilterID;
		this.getGraphicData();
	}


	/**
	 * On récupère les données que nous allons devoir utiliser.
	 */
	getGraphicData() {

		this.displayGraphic = false;
		this.isReadyGraphic = false; 
		this.isReadyFormationsList = true;

		const isExtended = false;
		const setFormationSelected = this.filterSelected;

		FiltersStorageService.specificGraphData('contents_valid', { setFormationSelected, isExtended: 'true' });

		// Si idMatrix = null, on choisit une formation random parmis celles dispo
		this.RequestV2Service.getData('contents_valid', { setFormationSelected, isExtended }).subscribe((result: any) => {

			

			result = JSON.parse(result.data.graphData.data);
			this.formationName = result.dataGraphics.nameMatrix;
			this.contentValidated = result.dataGraphics.contentValidated;
			this.contentFailed = result.dataGraphics.contentFailed;
			this.contentNeverDone = result.dataGraphics.contentNeverDone;
			this.contentTotal = result.dataGraphics.contentTotal;

			this.isReadyGraphic = true;


			this.getGraphic(result);
			this.updateDisplayGraphic();

		});
	}

	/**
	 * Affiche ou non le loader en fonction de deux éléments
	 *  - La liste des formations
	 * 	- Les données du graphique
	 */
	updateDisplayGraphic() {
		this.isReadyFormationsList === true && this.isReadyGraphic === true ? this.displayGraphic = true : this.displayGraphic = false;
	}

	/**
	 * Deuxième étape : On affiche le graphique les données que nous venons de récupérer via la fonction getGraphicData()
	 */
	getGraphic(data: any) {
		const chartDom = document.getElementById('contentsValidData') as HTMLElement;
		var myChart = this.chart = echarts.init(chartDom);

		

		this.contentsValidData.emit(this.chart);
		this.extendedData.emit(data.dataExtended);
		this.additionnalData.emit(data.dataGraphics);

		// Permet d'afficher le graphique, sinon il ne ressemble à rien.
		setTimeout(() => {
			myChart.resize();
		}, 2000)

		// Taille du graphique
		let width = this.setGraphicWidth(myChart);
		FiltersStorageService.isDataDetails === 'dataDetails' ? this.isZoom = { min: 0.01, max: 5 } : { min: 0.01, max: 5 };

		var option: any;
		option = {
			// title: {
			// 	text: data.nameMatrix,
			// 	top: 'bottom',
			// 	left: 'right'
			// },
			tooltip: {},
			series: [
				{
					type: 'graph',
					layout: 'force',
					animation: true,
					cursor: "move",
					zoom: this.setZoomGraphic(this.contentTotal), /* Gérer le zoom en fonction du nombre de contenus totaux */
					roam: FiltersStorageService.isDataDetails === 'dataDetails',
					center: [width, 250],

					// // On peut les bouger à la main
					draggable: FiltersStorageService.isDataDetails === 'dataDetails',

					// // Zoom avec la molette
					scaleLimit: { min: 0.01, max: 5 },

					// Design des liens entre les nodes
					lineStyle: {
						curveness: 0.1,
						opacity: 0.35
					},

					// Element HOVER des points
					tooltip: {
						trigger: 'item',
						formatter: (params: any) => { // Design quand on passe la souris sur une valeur du graphique

							this.domainName = params.data.nameDomain;
							this.skillName = params.data.nameSkill;
							this.themeName = params.data.nameTheme;
							this.acquisName = params.data.nameAcquis;

							// On enlève le hover des liens
							if (params.data.source) {
								return ``;
							}

							return `
							<div style=" display: flex; justify-content:center; align-item:center;">
								<div style="background-color: ${params.color}; border-radius:50%; width:20px; height: 20px; margin-right:10px;"></div>
								<p style="margin:initial !important;">${params.data.nameContent} : <strong>${this.setContentStatut(params)}</strong></p>
							</div>
							`
						}
					},

					// Suppression des textes à côté de chaque nodes
					label: {
						position: 'right',
						formatter: ''
					},

					// Gravité des éléments + taille des liens
					force: {
						edgeLength: 150,
						repulsion: 150,
						gravity: 0.05
					},

					links: data.dataGraphics.link, // Lien entre les nodes
					data: data.dataGraphics.data, // Création des nodes
					categories: this.category, // Les types de couleur pour les nodes
				}
			]
		};

		option && myChart.setOption(option);

		// myChart.on('click', (params: any) => {
		// });

	}


	/**
	 * Responsive du graphique - Gere le X du graphique
	 * @param myChart 
	 * @returns Number
	 */
	setGraphicWidth(myChart: any): number {
		let width: number | void = 700;

		width = window.addEventListener('resize', function () {
			myChart.resize();
			let w = window.innerWidth;
			w -= 250;
		});

		if (width === undefined) {
			width = 600;
		}

		return width;

	}


	/**
	 * Gère le Zoom par défaut du graphique
	 * @param contentTotal 
	 * @returns 
	 */
	setZoomGraphic(contentTotal: number): number {

		if (contentTotal >= 1100) {
			return 0.10;
		} else if (contentTotal >= 900) {
			return 0.15;
		} else if (contentTotal >= 600) {
			return 0.20;
		} else if (contentTotal >= 300) {
			return 0.30;
		} else if (contentTotal <= 300) {
			return 0.40;
		}
		return 1;
	}

	setContentStatut(params: any): String {
		var categorySymbol = 'Non effectué --';

		switch (params.data.category) {
			case 1:
				categorySymbol = 'Validé ✅';
				break;
			case 0:
				categorySymbol = 'Non validé ❌';
				break;
		}

		return categorySymbol;
	}

}
