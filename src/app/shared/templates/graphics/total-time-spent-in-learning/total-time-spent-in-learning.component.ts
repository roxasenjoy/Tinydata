import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as echarts from 'echarts';
import { DashboardService } from '../../../services/dashboard.service';
import { FiltersStorageService } from '../../../consts/filtersStorage';
import { GranularitiesStorage } from '../../../consts/granularitiesStorage';
import { User } from '../../../models/user';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';



@Component({
  selector: 'app-total-time-spent-in-learning',
  templateUrl: './total-time-spent-in-learning.component.html',
  styleUrls: ['./total-time-spent-in-learning.component.css']
})
export class TotalTimeSpentInLearningComponent implements OnInit {

  user: User = new User();
  organisations: any = null;
  userId: any = null;
  // Variable qui détermine si on affiche ou non le graphique
  canShowGraphicsTotalTimeSpentInLearningComponent = false;
  timeSpentGraphic: any;

  /* Si un utilisateur est choisi */
  // Défini si on doit afficher les graphiques utilisateurs(true) ou entreprise(false)
  showUserMatrixes = false;

  //Envoyer les informations au parent
  @Output() public analyticsTimeData = new EventEmitter<string>();
  @Output() public extendedData = new EventEmitter<any[]>();
  @Output() public precisionEvent = new EventEmitter<any>();

  constructor(
    public dashboardService: DashboardService,
    public filters: FiltersStorageService,
    public granularities: GranularitiesStorage,
    private eventEmitterService: EventEmitterService,
    public globalService: GlobalService,
    private RequestV2Service: RequestV2Service
  ) {
  }

  ngOnInit(): void {
    this.userId = FiltersStorageService.isUserZoom ? FiltersStorageService.userZoom.id : null
    this.organisations = FiltersStorageService.organisations;
    this.getGraphData();
    this.setGraphTotalTimeSpentInLearning();

    this.eventEmitterService.refreshGraphics.subscribe((isPerfectData: boolean) => {

      if(!isPerfectData){
        this.userId = FiltersStorageService.isUserZoom ? FiltersStorageService.userZoom.id : null
        this.organisations = FiltersStorageService.organisations;
        this.canShowGraphicsTotalTimeSpentInLearningComponent = false;
        this.timeSpentGraphic && this.timeSpentGraphic.dispose();
        this.getGraphData();
        this.setGraphTotalTimeSpentInLearning();
      } else {
        this.getGraphData();
        this.setGraphTotalTimeSpentInLearning();
      }
    });

    this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
      if("ANALYTICS_TIME" in graphSelected || graphSelected.includes("ANALYTICS_TIME")){
        this.getGraphData();
      }
    });
  }


  /**
   * Obtenir les informations à afficher dans notre graphique setGraphTotalTimeSpentInLearning
   */
  getGraphData() {
    let preparedData: any;
    let isExtended = true;

    FiltersStorageService.specificGraphData('analytics_time', { isExtended: 'true' });

    this.RequestV2Service.getData('analytics_time', { isExtended }).subscribe(
      (result: any) => {
        preparedData = this.prepareData(JSON.parse(result.data.graphData.data), isExtended);
        this.extendedData.emit(preparedData)
      }
    )
  }

  prepareData(data: any, extended: boolean) {
    let res: any = [];

    if (extended) {
      data['dataExtended'].forEach((element: any) => {
        res.push({
          /**
           * Liste des éléments qui vont se trouver dans l'export
           */
          firstName: element.firstName,
          lastName: element.lastName,
          time: this.globalService.secondsToHms(element.total),
          email: element.email,
          lastInteraction: element.lastInteraction
        })
      });
    }
    else {
      data.forEach((element: any, index: any) => {
        res.push({
          month: data.name[index],
          time: this.globalService.secondsToHms(element),
        })
      });
    }
    return res;
  }


  /**
   * Création du graphique qui va s'afficher pour l'utilisateur
   */
  setGraphTotalTimeSpentInLearning() {

    let userId = null;

    if (FiltersStorageService.userZoom) {
      userId = FiltersStorageService.userZoom['id'];
    }

    let isExtended = false;

    FiltersStorageService.specificGraphData('analytics_time', { isExtended: 'true' });

    this.RequestV2Service.getData('analytics_time', { isExtended }).subscribe(
      (result: any) => {

        let data = JSON.parse(result.data.graphData.data);
        this.canShowGraphicsTotalTimeSpentInLearningComponent = true;
        const element = document.getElementById('totalTimeSpentInLearningComponent') as HTMLElement;
        const myChart = this.timeSpentGraphic = echarts.init(element);
        this.analyticsTimeData.emit(this.timeSpentGraphic);
        var option;

        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // Use axis to trigger tooltip
              type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
          legend: {},
          label: {
            show: false
          },
          xAxis: {
            type: 'value',
            name: "Temps",
            nameLocation: "middle",
            nameGap: 30,
            trigger: 'axis',
            axisLabel: {
              formatter: '50',
              align: 'center',
              show: false
            },
          },
          yAxis: {
            type: 'category',
            data: data.name, // A CHANGER EN FONCTION DES FILTRES DATES
          },
          series: [
            {
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series'
              },
              label: {
                show:true,
                color: "rgba(255, 255, 255, 1)",
                formatter: (params: any) => { // A partir d'ici on peut régler l'affiche heure/minute
                  return this.globalService.secondsToHms(params.data);
                }
              },
              data: data.data, // A CHANGER AVEC LE TEMPS TOTAL PASSE DANS L'APPRENTISSAGE
              color: "#9229ff",
              tooltip: {
                trigger: 'item',
                formatter: (params: any) => { // A partir d'ici on peut régler l'affiche heure/minute
                  return this.globalService.secondsToHms(params.data);
                }
              },
            }
          ]
        };

        // tslint:disable-next-line:only-arrow-functions
        window.addEventListener('resize', function () {
          myChart.resize();
        });

        // @ts-ignore
        myChart.setOption(option);
        setTimeout(() => {
          myChart.resize();
        }, 0)
      }
    );

  }
}
