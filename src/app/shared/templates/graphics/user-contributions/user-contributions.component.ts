import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';
import * as echarts from 'echarts';
import { GranularitiesStorage } from 'src/app/shared/consts/granularitiesStorage';
import { LabelsType, ResultUserContributionsType } from 'src/app/shared/models/type';
import { FiltersStorageService } from '../../../consts/filtersStorage';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';

@Component({
  selector: 'app-user-contributions',
  templateUrl: './user-contributions.component.html',
  styleUrls: ['./user-contributions.component.css']
})
export class UserContributionsComponent implements OnInit {

  /* Informations globales du graphique */
  nameFormationFilter = 'UserContributionsFormationSelected';
  graphicName: string = "USER_CONTRIBUTIONS";
  canShowGraphicsUserContributionsComponent: boolean = false; // Loader
  myChart: any;
  noData: any;
  option: any;
  data: any;
  dataDetailed: any;

  /* Informations supplémentaires */
  idUser: number | null = null;
  filterSelected: any = null;

  /* Gestion des granularités */
  zoom: number = 0;
  zoomMaxLimit: number = 5;
  zoomName: string | null;

  // Tableau avec les valeurs (Simplifier le code)
  listZoomName: Array<string | null> = [null,'formations','domaines','compétences','thèmes','acquis'];
  listMajZoomName: Array<string | null> = ['Formations', 'Domaines', 'Compétences', 'Thèmes', 'Acquis', 'Contenus'];

  /* Gestion du zoom horizontal */
  startZoom: number;
  endZoom: number;
  showCursorLeft: boolean = false;
  showCursorRight: boolean = false;

  listIdGranularity: Array<number | null> = [null, null, null, null, null, null];
  listNameGranularity: Array<string> = [];

  @Output() public userContributionsData = new EventEmitter<string>();
  @Output() public extendedData = new EventEmitter<any[]>();
  @Output() public precisionEvent = new EventEmitter<any>();

  constructor(
    public eventEmitterService: EventEmitterService,
    public granularities: GranularitiesStorage,
    public dashboardService: DashboardService,
    public settingsStorageService: SettingsStorageService,
    public RequestV2Service: RequestV2Service
  ) { }

  ngOnInit(): void {

    this.idUser = FiltersStorageService.isUserZoom ? FiltersStorageService.userZoom.id : null;

    //Obtenir les données du graphique
    FiltersStorageService.userContributionsZoom = 0;
    this.listNameGranularity = [];

    this.filterSelected = localStorage.getItem(this.nameFormationFilter);
    this.filterSelected = this.filterSelected !== null ? parseInt(this.filterSelected) : null;

    this.eventEmitterService.refreshGraphics.subscribe(() => {
      this.canShowGraphicsUserContributionsComponent = false;
    });

    this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
      ;
      if ("USER_CONTRIBUTIONS" in graphSelected || graphSelected.includes("USER_CONTRIBUTIONS")) {
        this.getData(this.listIdGranularity[this.zoom], this.idUser, this.zoom, this.filterSelected);
      }
    })
  }

  /**
   * Travail avec : list-formation.component.ts pour la gestion du filtre
   * @param graphicFormationFilterID 
   */
  updateData(graphicFormationFilterID: any) {

    this.filterSelected = localStorage.getItem(this.nameFormationFilter);
    if (graphicFormationFilterID !== this.filterSelected) {
      this.myChart ? this.myChart.dispose() : '';
      this.canShowGraphicsUserContributionsComponent = false;
      this.resetGraphicVariables();
      this.filterSelected = graphicFormationFilterID;
      this.getData(null, this.idUser, 0, graphicFormationFilterID);
    }
  }

  /**
   * Afficher le graphique avec les données récupérées précédemment.
   * @param data : Array<string | number>
   */
  getGraphic(data: Array<string | number>, comment: Array<string | number>) {

    const element: any = document.getElementById('userContributionComponent') as HTMLElement;
    const myChart = this.myChart = echarts.init(element);

    this.userContributionsData.emit(this.myChart);
    this.extendedData.emit(comment);

    let xName: Array<String> = [];
    let xValue: Array<Number> = [];

    data.forEach((e: any) => {
      xName.push(e['name']);
      xValue.push(e['total']);
    });

    let xAxisName = data.map((element: any) => {
      return element.name;
    });

    let idFormation = data.map((element: any) => {
      return element.idGranularityFeedback;
    });

    // Affiche un message qui prévient qu'il n'y a aucune information disponible.
    if (data.length === 0) {
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
        subtext: `Aucune contribution disponible.`,
        subtextStyle: {
          color: "grey",
          fontSize: 20
        },
      }
    } else {
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
        subtext: ``,
        subtextStyle: {
          color: "grey",
          fontSize: 20
        },
      }
    }

    myChart.resize();

    this.option = {
      title: this.noData,
      xAxis: {
        type: 'category',
        name: this.listMajZoomName[this.zoom],
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
        },
        data: xAxisName
      },

      tooltip: {
        textStyle: {
          fontFamily: "Montserrat-Regular"
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
      },
      series: [
        {
          itemStyle: {
            color: '#9229FF'
          },



          data: xValue,
          type: 'bar'
        }
      ]
    };

    myChart.resize();

    /** Zoom lors d'un clique sur une formation **/
    myChart.on("click", (params: any) => {
      // Si clic il y a, on passe à la granularité suivante
      if (this.zoom != this.zoomMaxLimit) {
        myChart.dispose();
        this.zoom++;
        FiltersStorageService.userContributionsZoom = this.zoom; // Set zoom pour les feedbacks
        this.zoomName = this.listZoomName[this.zoom]; // Bouton de retour

        this.listIdGranularity[this.zoom] = idFormation[params.dataIndex]; // Ajout des IDs
        this.listNameGranularity[this.zoom] = xAxisName[params.dataIndex]; // Ajout des noms 

        /* Gestion des flèches sur les côtés du graphique */
        this.showCursorLeft = false;
        this.showCursorRight = false;
        this.endZoom = 100;
        this.startZoom = 0;
        /**************************************************/

        this.getData(this.listIdGranularity[this.zoom], this.idUser, this.zoom, this.filterSelected);
      }
    });

    myChart.on('dataZoom', 'click', (params: any) => {

      this.startZoom = params.batch[0].start;
      this.endZoom = params.batch[0].end;

      this.startZoom === 0 ? this.showCursorLeft = false : this.showCursorLeft = true;
      this.endZoom === 100 ? this.showCursorRight = false : this.showCursorRight = true;

    });

    /* Responsive du graphique */
    window.addEventListener('resize', function () {
      myChart.resize();
    });

    this.option && this.myChart.setOption(this.option);
  }

  /**
 * Récupérer les données du graphique
 */
  getData(idGranularity: number | null, idUser: number | null, formationZoom: number | null, setFormationSelected: number | null) {

    if (this.myChart) {
      this.myChart.dispose();
    }
    this.canShowGraphicsUserContributionsComponent = false;

    FiltersStorageService.specificGraphData('user_contributions', { idGranularity, formationZoom, setFormationSelected });

    this.RequestV2Service.getData('user_contributions', { idGranularity, formationZoom, setFormationSelected }).subscribe(
      (result: any) => {
        this.canShowGraphicsUserContributionsComponent = true;

        this.data = JSON.parse(result.data.graphData.data).data;
        this.dataDetailed = JSON.parse(result.data.graphData.data).dataExtended;

        // Temporisation pour afficher le graphique, sinon problème d'affichage avec Echarts
        setTimeout(() => {
          this.endZoom = 2 * 100 / Object.keys(this.data).length;
          /** Afficher les cursors droite gauche */
          2 * 100 / Object.keys(this.data).length >= 100 ? this.showCursorRight = false : this.showCursorRight = true;
          this.getGraphic(this.data, this.dataDetailed);
          this.myChart.resize();
        }, 10);
      }
    )
  }

  goBackGranularity() {
    // Si clic il y a, on passe à la granularité suivante
    if (this.zoom != 0) {
      this.myChart.dispose();
      this.listIdGranularity[this.zoom] === null;
      this.zoom--;
      FiltersStorageService.userContributionsZoom = this.zoom; // Set zoom pour les feedbacks
      this.zoomName = this.listZoomName[this.zoom]; // Bouton de retour
      this.listNameGranularity.pop();
      this.getData(this.listIdGranularity[this.zoom], this.idUser, this.zoom, this.filterSelected);
    }
  }

  resetGraphicVariables() {
    this.idUser = FiltersStorageService.isUserZoom ? FiltersStorageService.userZoom.id : null;

    /* Gestion des flèches sur les côtés du graphique */
    this.showCursorLeft = false;
    this.showCursorRight = false;
    this.endZoom = 100;
    this.startZoom = 0;
    /**************************************************/

    this.zoom = 0;
    FiltersStorageService.userContributionsZoom = 0;
    this.listIdGranularity = [null, null, null, null, null, null];
    this.listNameGranularity = [];
  }

  rightArrow() {

    this.startZoom += 25;
    this.endZoom += 25;

    this.startZoom <= 0 ? this.showCursorLeft = false : this.showCursorLeft = true;
    this.endZoom >= 100 ? this.showCursorRight = false : this.showCursorRight = true;

    this.myChart.dispose();
    this.getGraphic(this.data, this.dataDetailed);
  }

  leftArrow() {
    this.startZoom -= 25;
    this.endZoom -= 25;

    this.startZoom <= 0 ? this.showCursorLeft = false : this.showCursorLeft = true;
    this.endZoom >= 100 ? this.showCursorRight = false : this.showCursorRight = true;

    this.myChart.dispose();
    this.getGraphic(this.data, this.dataDetailed);
  }
}

