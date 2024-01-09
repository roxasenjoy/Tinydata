import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as echarts from 'echarts';
import { DashboardService } from '../../../services/dashboard.service';
import { SettingsStorageService } from '../../../consts/settingsStorage';
import { COLORS } from '../../../consts/colors';
import { FiltersStorageService } from '../../../consts/filtersStorage';
import { GranularitiesStorage } from '../../../consts/granularitiesStorage';
import { User } from '../../../models/user';
import moment from 'moment';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';
import { DatePipe } from '@angular/common'
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';
import { DataType } from 'src/app/shared/models/type';



@Component({
	selector: 'app-connections',
	templateUrl: './connections.component.html',
	styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {

	user: User = new User();

	canShowGraphicsConnection = false;
	numberOfConnections: any;
	connections: any;
	connectionsGraphic: any;
	noConnectionsString: string = "* Vous pouvez réessayer en modifiant les filtres de dates";
	noData: any;
	showDetails: boolean = false;
	dailyData!: any[] | boolean;

	beginDate: any = null;
	endDate: any = null;
	organisations: any = null;

	oldBeginDate: any = null;
	oldEndDate: any = null;
	oldOrganisations: any = null;

	arrayDate: any = [];

	precision: String = "MONTH";
	userId: any = null;

	/* Si un utilisateur est choisi */
	// Défini si on doit afficher les graphiques utilisateurs(true) ou entreprise(false)
	showUserMatrixes = false;

	//Envoyer les informations au parent
	@Output() public connectionsData = new EventEmitter<string>();
	@Output() public extendedData = new EventEmitter<any[]>();
	@Output() public precisionEvent = new EventEmitter<any>();

	constructor(
		public datepipe: DatePipe,
		public dashboardService: DashboardService,
		public settingsStorageService: SettingsStorageService,
		public filters: FiltersStorageService,
		public granularities: GranularitiesStorage,
		private eventEmitterService: EventEmitterService,
		private RequestV2Service: RequestV2Service
	) {
	}

	ngOnInit(): void {

		this.precision = FiltersStorageService.precision;
		this.userId = FiltersStorageService.isUserZoom ? FiltersStorageService.userZoom.id : null
		this.organisations = FiltersStorageService.organisations;

		this.getConnections();

		this.eventEmitterService.refreshGraphics.subscribe(() => {
			this.numberOfConnections = null;
			this.beginDate = moment(FiltersStorageService.beginDate);
			this.endDate = moment(FiltersStorageService.endDate);
			this.userId = FiltersStorageService.isUserZoom ? FiltersStorageService.userZoom.id : null
			this.organisations = FiltersStorageService.organisations;
			this.canShowGraphicsConnection = false;
			this.connectionsGraphic && this.connectionsGraphic.dispose();
			this.precision = FiltersStorageService.precision;

			this.getConnections();
		});

		this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
			if ("CONNECTIONS" in graphSelected || graphSelected.includes("CONNECTIONS")) {
				this.getGraphData();
			}
		})
	}

	getGraphData() {
		const precision = this.precision;
		const groupByUser = true;

		FiltersStorageService.specificGraphData('connections', { precision, groupByUser: 'true' });

		this.RequestV2Service.getData('connections', { precision, groupByUser }).subscribe(
			(result: any) => {
				let preparedDailyData = this.prepareData(JSON.parse(result.data.graphData.data)['dataGraphic'] as DataType);
				this.extendedData.emit(preparedDailyData[0]);
				this.precisionEvent.emit(this.precision);
			}
		);
	}

	prepareData(data: any) {
		const isUserView = FiltersStorageService.userZoom !== null;

		let legendList = [];
		let series = [];
		let dataToSend: any[] = []

		let colorCpt = 0;

		for (let i in data) {
			legendList.push(data[i].name);

			let curData = Array();

			data[i].data.forEach((element: any) => {
				//  let dateElement = moment.unix(parseInt(element.date)).format(this.precision === "MONTH" ? 'MMM YYYY' : 'DD MMM YYYY');
				let newData = [parseInt(element.date), element.count, element.percentage, element.text, data[i].name, data[i].companyId, element.userFirstName, element.userLastName, element.userEmail, element.totalCount, parseInt(element.date)];
				curData.push(newData);
				dataToSend.push(newData);
			});

			series.push(
				{
					name: data[i].name,
					data: curData,
					type: 'scatter',
					symbolSize: function (data: any) {
						if (isUserView) {
							return 15;
						}
						return 10 + (data[2] / 10) * 2;
					},
					emphasis: {
						focus: 'series',
						label: {
							show: true,
							formatter: function (param: any) {
								return param.data[3];
							},
							color: localStorage.getItem('night') === "true" ? '#b2b2b2' : '#000',
							fontFamily: "Montserrat-Regular",
							fontSize: 16,
							position: 'top'
						}
					},
					itemStyle: {
						color: COLORS[colorCpt]
					}
				}
			)
			colorCpt++;
		}
		return [dataToSend, legendList, series];
	}

	formattedDate(date: any) {
		return this.datepipe.transform(date, 'dd/MM/yyyy');

	}

	getConnections(): any {

		this.eventEmitterService.callNewGraphLoading();

		const isUserView = FiltersStorageService.userZoom !== null;
		let precision = this.precision;
		let groupByUser = false;

		FiltersStorageService.specificGraphData('connections', { precision, groupByUser: 'true' });

		this.RequestV2Service.getData('connections', { precision, groupByUser }).subscribe(
			(result: any) => {
				this.getGraphData();
				this.canShowGraphicsConnection = true;
				let preparedData = this.prepareData(JSON.parse(result.data.graphData.data)['dataGraphic']);
				
				this.numberOfConnections = preparedData[0].length;
				const element = document.getElementById('connections') as HTMLElement;

				const myChart = this.connectionsGraphic = echarts.init(element);
				this.connectionsData.emit(this.connectionsGraphic);

				/*********************************
				*   Mise en place des abscisses  *
				**********************************/
				this.arrayDate = [];
				let valueData: any;
				// On range par ordre croissant tous les éléments afin de modifier leur nom par la suite
				valueData = preparedData[0].sort();

				// Récupérer toutes les dates présentes 
				valueData.forEach((element: any[]) => {

					// On modifie le format pour que ça soit compréhensible pour l'utilisateur : 16589562652 = 5 Mai 1987 (Test complétement faux) 
					element[0] = moment.unix(parseInt(element[0])).format(this.precision === "MONTH" ? 'MMM YYYY' : 'DD MMM YYYY');

					if (this.arrayDate.indexOf(element[0]) == -1) {
						this.arrayDate.push(element[0]);
					}
					/*********************************/
				});

				let option: any = {
					legend: {
						right: '1%',
						top: '1%',
						data: isUserView ? [] : preparedData[1],
						type: 'scroll',
						orient: 'horizontal',
						textStyle: {
							color: localStorage.getItem('night') === "true" ? '#b2b2b2' : '#000',
							fontFamily: "Montserrat-Regular",
							fontSize: 16
						}
					},
					grid: {
						top: '50px',
						left: '50px'
					},
					xAxis: {
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},

						data: this.arrayDate,
						axisLabel: {
							rotate: 45
						},
					},

					yAxis: {
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
						scale: true
					},
					series: preparedData[2]
				};

				if (preparedData[0].length == 0) {

					// display no connections message
					this.noData = {
						show: true,
						left: "center",
						top: "center",
						triggerEvent: false,
						textStyle: {
							color: '#a24bfe',
							fontWeight: 400,
							fontSize: 10,
							textBorderColor: "#fada5e"
						},
						subtext: `Aucune connexion entre le ${this.formattedDate(this.beginDate)} et le ${this.formattedDate(this.endDate)}`,
						subtextStyle: {
							color: "grey",
							fontSize: 20
						},
					}
					option = {
						title: this.noData
					}
				}
				window.addEventListener('resize', function () {
					myChart.resize();
				});

				// @ts-ignore
				myChart.setOption(option);

				myChart.on('click', (params: any) => {
					if (this.precision === "MONTH") {
						this.precision = "DAY";

						// save current data to localStorage for later use
						FiltersStorageService.oldBeginDate = this.beginDate;
						FiltersStorageService.oldEndDate = this.endDate;
						FiltersStorageService.oldOrganisations = this.organisations;

						var self = this;
						setTimeout(function () {
							self.beginDate = moment.unix(params.value[10]).startOf('month');
							self.endDate = moment.unix(params.value[10]).endOf('month');
							self.organisations = [params.value[5]];
							FiltersStorageService.organisations = self.organisations;
							FiltersStorageService.endDate = self.endDate;
							FiltersStorageService.beginDate = self.beginDate;
							self.eventEmitterService.callRefreshGraphics();
						}, 10);

						//this.getConnections();
					}
					else if (this.precision === "DAY") {
						this.dailyData = false;
						this.showDetails = true;
						const selectedDate = moment.unix(params.value[0]);
						let precision = this.precision;
						let groupByUser = true;

						FiltersStorageService.specificGraphData('connections', { precision: "DAY", groupByUser: "true" });
						this.RequestV2Service.getData('connections', { precision, groupByUser }).subscribe(
							(result: any) => {
								let preparedDailyData = this.prepareData(JSON.parse(result.data.graphData.data)['dataGraphic']);
								this.dailyData = preparedDailyData[0];
							});
					}
				});
				setTimeout(() => {
					myChart.resize();
				}, 0)
			},
			(error) => {
				console.log("error", error);
				this.numberOfConnections = 0;
			});
	}

	closeDetails() {
		this.showDetails = false;
	}

	backToMonth() {
		this.precision = "MONTH";
		if (!FiltersStorageService.oldBeginDate) {
			FiltersStorageService.resetBeginDate();
		}
		else {
			FiltersStorageService.beginDate = FiltersStorageService.oldBeginDate;
			FiltersStorageService.resetOldBeginDate();
		}

		if (!FiltersStorageService.oldEndDate) {
			FiltersStorageService.resetEndDate();
		}
		else {
			FiltersStorageService.endDate = FiltersStorageService.oldEndDate;
			FiltersStorageService.resetOldEndDate();
		}

		if (!FiltersStorageService.oldOrganisations) {
			FiltersStorageService.resetOrganisations();
		}
		else {
			FiltersStorageService.organisations = FiltersStorageService.oldOrganisations;
			FiltersStorageService.resetOldOrganisations();
		}

		this.eventEmitterService.callRefreshGraphics();
	}
}