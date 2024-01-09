import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FiltersStorageService } from 'src/app/shared/consts/filtersStorage';
import { GranularitiesStorage } from 'src/app/shared/consts/granularitiesStorage';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import * as echarts from 'echarts';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';

@Component({
	selector: 'app-rappels-memoriels',
	templateUrl: './rappels-memoriels.component.html',
	styleUrls: ['./rappels-memoriels.component.css']
})
export class RappelsMemorielsComponent implements OnInit {

	nameFormationFilter: string = "RappelsMemoFormationSelected";
	filterSelected: string | null = localStorage.getItem(this.nameFormationFilter);

	displayGraphic: boolean = false;

	/* Gestion du zoom horizontal */
	startZoom: number = 0;
	endZoom: number;
	showCursorLeft: boolean = false;
	showCursorRight: boolean = false;

	myChart: any;
	data: any;

	@Output() public rappelsMemorielsData = new EventEmitter<string>();
	@Output() public extendedData = new EventEmitter<any[]>();

	constructor(
		public dashboardService: DashboardService,
		public settingsStorageService: SettingsStorageService,
		public filters: FiltersStorageService,
		public granularities: GranularitiesStorage,
		public router: Router,
		private RequestV2Service: RequestV2Service,
		private eventEmitterService: EventEmitterService
	) {
	}

	ngOnInit(): void {

		this.eventEmitterService.refreshGraphics.subscribe(() => {
			this.displayGraphic = false;
		});

		this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
			if ("RAPPELS_MEMO" in graphSelected || graphSelected.includes("RAPPELS_MEMO")) {
				this.getData();
			}
		});
	}

	/**
	 * Récupération des données
	 */
	getData() {

		const filterSelected = this.filterSelected;

		FiltersStorageService.specificGraphData('rappels_memo', { filterSelected });

		this.RequestV2Service.getData('rappels_memo', { filterSelected }).subscribe(
			(result: any) => {
				this.data = JSON.parse(result.data.graphData.data);
				this.displayGraphic = true;

				// Temporisation pour afficher le graphique, sinon problème d'affichage avec Echarts
				setTimeout(() => {

					this.endZoom = 2 * 100 / Object.keys(this.data).length;

					/** Afficher les cursors droite gauche */
					this.endZoom >= 100 || Object.keys(this.data.dataExtended).length <= 5 ? this.showCursorRight = false : this.showCursorRight = true;
					this.getGraphics(this.data);
				});
			}
		);
	}

	/**
	 * Update du graphique en fonction de la formation sélectionnée
	 * @param idSelected number
	 */
	updateData(graphicFormationFilterID: any) {
		this.displayGraphic = false;
		this.filterSelected = localStorage.getItem(this.nameFormationFilter);
		if (graphicFormationFilterID !== this.filterSelected) {
			localStorage.setItem('RappelsMemoFormationSelected', graphicFormationFilterID);
			this.resetGraphicVariables();
			this.getData();

		}
	}

	/**
	 * Création du graphique avec les données adéquates.
	 * @param data 
	 */
	getGraphics(data: any) {

		const chartDom: any = document.getElementById('rappelsMemoriels');
		const myChart = this.myChart = echarts.init(chartDom);

		let option;

		// Exporter les données pour le graphique
		this.rappelsMemorielsData.emit(this.myChart);
		this.extendedData.emit(data.dataExtended);

		// Labels
		const lineName = 'Taux d\'échec';
		const barName = 'Taux de mémorisation';

		// option
		option = {
			backgroundColor: 'white',
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				},
				formatter: (params: any) => { // Design quand on passe la souris sur une valeur du graphique
					return `
					<p> ${params[0].name} </p>
				<div style="display: flex;align-items: center;">
					<div style="background-color: ${params[0].color}; border-radius:50%; width:15px; height: 15px; margin-right:10px"></div>
					<div>
						<span style="padding-right: 20px"><strong>${params[0].data} %</strong> • ${params[0].seriesName}</span>  <br>
					</div>
				</div>
				
				<div style="display: flex;align-items: center;">
					<div style="background-color: #FFBE00; border-radius:50%; width:15px; height: 15px; margin-right:10px"></div>
					<div>
						<span style="padding-right: 20px"><strong>${params[1].data} %</strong> • ${params[1].seriesName}</span>  <br>
					</div>
				</div>
				`;
				}
			},

			/* Légende */
			legend: {
				data: [barName, lineName],
				textStyle: {
					color: '#b2b2b2'
				}
			},

			grid: {
				top: 100
			},

			/* Abscisse */
			xAxis: {
				data: data.acquisData,
				axisLine: {
					lineStyle: {
						color: '#b2b2b2'
					}
				},
				name: "Acquis essentiel",
				nameTextStyle: {
					align: "left",
					verticalAlign: "middle",
					fontSize: 14,
					fontWeight: "bold",
					color: "rgba(34, 12, 12, 1)"
				},
				axisLabel: {
					interval: 0,
					rotate: 0, // facultatif, pour tourner les étiquettes si nécessaire
					formatter: function (value: string) {
						var ret = "";// le texte de retour
						var words = value.split(" ");// diviser le texte en mots
						for (var i = 0; i < words.length; i++) {
							ret += words[i];
							if ((i + 1) % 3 == 0 && i < words.length - 1) {// ajouter un saut de ligne après chaque deuxième mot
								ret += "\n";
							}
							else if (i < words.length - 1) {
								ret += " ";
							}
						}
						return ret;
					}
				}
			},

			/* Ordonnées */
			yAxis: {
				min: 0,
				max: 100,
				axisLabel: {
					formatter: '{value}%'
				},
				axisLine: {
					lineStyle: {
						color: '#b2b2b2',
						fontSize: 10,
					}
				}
			},
			series: [

				/**
				 * Ligne
				 */
				{
					name: lineName,
					type: 'line',
					smooth: true,
					showAllSymbol: true,
					symbol: 'circle',
					symbolSize: 15,
					symbolStyle: { color: 'red' },
					lineStyle: { color: '#FF404C' },
					itemStyle: {
						color: '#FF404C',
					},

					data: data.lineData
				},

				/**
				 * Bars
				 */
				{
					name: barName,
					type: 'bar',
					barWidth: 20,
					itemStyle: {
						borderRadius: 4,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#FFBE00' },
						])
					},

					label: {
						show: true,
						position: 'outside',
						formatter: function (value: any) {
							return value.data === 100 ? '{image| }' : '';
						},


						rich: {
							image: {
								height: 40, // Hauteur de l'image
								align: 'center',
								backgroundColor: {
									image: "../../../../assets/icons/graphics/brain.png" // Chemin vers votre image
								}
							}
						},

					},

					data: data.barData
				},

			],

			dataZoom: [
				{
					type: "inside",
					zoomOnMouseWheel: false, // Disabled l'event de la molette
					start: this.startZoom,
					end: this.endZoom
				}
			],
		};

		myChart.on('dataZoom', 'click', (params: any) => {

			this.startZoom = params.batch[0].start;
			this.endZoom = params.batch[0].end;
	  
			this.startZoom === 0 ? this.showCursorLeft = false : this.showCursorLeft = true;
			this.endZoom === 100 ? this.showCursorRight = false : this.showCursorRight = true;
	  
		  });


		setTimeout(() => {
			myChart.resize();
		}), 20;

		/* Responsive du graphique */
		window.addEventListener('resize', function () {
			myChart.resize();
		});

		option && this.myChart.setOption(option);


	}


	rightArrow() {
		this.startZoom += 25;
		this.endZoom += 25;

		this.startZoom <= 0 ? this.showCursorLeft = false : this.showCursorLeft = true;
		this.endZoom >= 100 ? this.showCursorRight = false : this.showCursorRight = true;

		this.myChart.dispose();
		this.getGraphics(this.data);
	}

	leftArrow() {
		this.startZoom -= 25;
		this.endZoom -= 25;

		this.startZoom <= 0 ? this.showCursorLeft = false : this.showCursorLeft = true;
		this.endZoom >= 100 ? this.showCursorRight = false : this.showCursorRight = true;

		this.myChart.dispose();
		this.getGraphics(this.data);
	}

	resetGraphicVariables() {

		/* Gestion des flèches sur les côtés du graphique */
		this.showCursorLeft = false;
		this.showCursorRight = false;
		this.endZoom = 100;
		this.startZoom = 0;
		/**************************************************/
	  }

}
