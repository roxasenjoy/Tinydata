import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/services/event-emitter.service';
import * as echarts from 'echarts';
import { GranularitiesStorage } from 'src/app/shared/consts/granularitiesStorage';
import { feedbackReturnType, LabelsType } from 'src/app/shared/models/type';
import { FiltersStorageService } from '../../../consts/filtersStorage';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';
import * as moment from 'moment';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  /* Informations globales du graphique */
  nameFormationFilter = 'FeedbackFormationSelected';
  graphicName: string = "FEEDBACK";
  canShowGraphicsFeedbackComponent: boolean = false; // Loader
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
  listZoomName: Array<string | null> = [null, 'formations', 'domaines', 'compétences', 'thèmes', 'acquis'];
  listMajZoomName: Array<string | null> = ['Formations', 'Domaines', 'Compétences', 'Thèmes', 'Acquis', 'Contenus'];

  /* Gestion du zoom horizontal */
  startZoom: number;
  endZoom: number;
  showCursorLeft: boolean = false;
  showCursorRight: boolean = false;

  listIdGranularity: Array<number | null> = [null, null, null, null, null, null];
  listNameGranularity: Array<string> = [];

  @Output() public feedbackData = new EventEmitter<string>();
  @Output() public extendedData = new EventEmitter<any[]>();
  @Output() public precisionEvent = new EventEmitter<any>();

  constructor(
    public eventEmitterService: EventEmitterService,
    public granularities: GranularitiesStorage,
    public dashboardService: DashboardService,
    public settingsStorageService: SettingsStorageService,
    public RequestV2Service: RequestV2Service,
  ) { }

  ngOnInit(): void {

    this.idUser = FiltersStorageService.isUserZoom ? FiltersStorageService.userZoom.id : null;

    // Supprimer toutes les données
    this.resetGraphicVariables();

    //Obtenir les données du graphique
    FiltersStorageService.feedbackZoom = 0;
    this.listNameGranularity = [];

    this.filterSelected = localStorage.getItem(this.nameFormationFilter);
    this.filterSelected = this.filterSelected !== null ? parseInt(this.filterSelected) : null;
    // this.getData(null, this.idUser, 0, this.filterSelected);

    this.eventEmitterService.refreshGraphics.subscribe(() => {
      this.canShowGraphicsFeedbackComponent = false;
    });

    this.eventEmitterService.getExtendedGraphData.subscribe((graphSelected) => {
      if ("FEEDBACK" in graphSelected || graphSelected.includes("FEEDBACK")) {
        this.getData(this.listIdGranularity[this.zoom], this.idUser, this.zoom, this.filterSelected);
      }
    });

  }

  /**
   * Travail avec : list-formation.component.ts pour la gestion du filtre
   * @param graphicFormationFilterID 
   */
  updateData(graphicFormationFilterID: any) {
    this.filterSelected = localStorage.getItem(this.nameFormationFilter);
    if (graphicFormationFilterID !== this.filterSelected) {
      this.myChart ? this.myChart.dispose() : '';
      this.canShowGraphicsFeedbackComponent = false;
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
    const element: any = document.getElementById('feedbackComponent') as HTMLElement;
    const myChart = this.myChart = echarts.init(element);

    this.feedbackData.emit(this.myChart);
    this.extendedData.emit(comment);

    myChart.resize();

    let response: any = {
      "labels": this.setupLabel(),
      "stacks": Object.values(data)
    }

    let xAxisName = response.stacks.map(function (element: any): string {
      return element.name;
    });

    let idFormation = response.stacks.map(function (element: any): number {
      return element.idGranularityFeedback;
    });

    // On boucle sur tous les labels disponibles
    let arr = response.labels.map((label: any) => {

      let data: Array<number | undefined> = [];
      let index = 0;

      // On ajoute toutes les valeurs dans une Array
      response.stacks.forEach((e: any) => {
        if (index !== -1) {
          data.push(e[label]);
        } else {
          data.push(undefined);
        }

        index++;
      });

      return {
        name: label,
        type: "bar",
        // stack: "stack",
        emphasis: {
          focus: "series"
        },
        label: {
          show: true,
          formatter: (params: any) => {
            if (params.data === 0) {
              return '';
            }
            return params.data + '%';
          }
        },
        itemStyle: {
          color: this.getLabelColor(label)
        },
        barGap: 0,
        data: data
      };
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
        subtext: `Aucun feedback disponible.`,
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

    // Configuration des labels qui se trouvent dans les barres
    let config = {
      rotate: 0,
      align: 'left',
      // verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15
    };

    // Options des labels
    const labelOption = {
      show: true,
      distance: config.distance,
      rotate: config.rotate,
      fontSize: 16,
      color: "rgba(255, 255, 255, 1)",
      textStyle: {
        fontFamily: "Montserrat-Regular"
      },
    };

    /* Gestion des options */
    this.option = {
      title: this.noData,
      barCategoryGap: '20%',
      label: labelOption,
      roam: false,


      legend: {
        data: response.labels,
        textStyle: {
          fontFamily: "Montserrat-Regular"
        },

        itemGap: 20,
        bottom: "0%",
        padding: 10
      },
      grid: {
        containLabel: true,
        y: 100
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        splitLine: { show: false },
        textStyle: {
          fontFamily: "Montserrat-Regular"
        },
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        textStyle: {
          fontFamily: "Montserrat-Regular"
        },
      },

      // X
      xAxis: {
        type: "category",
        data: xAxisName,
        splitLine: { show: false },
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
          },

          splitLine: { show: false },
        },
        textStyle: {
          fontFamily: "Montserrat-Regular"
        },
      },

      dataZoom: [
        {
          type: "inside",
          zoomOnMouseWheel: false, // Disabled l'event de la molette
          start: this.startZoom,
          end: this.endZoom
        }
      ],
      series: arr
    };

    myChart.resize();

    /** Zoom lors d'un clique sur une formation **/
    myChart.on("click", (params: any) => {
      // Si clic il y a, on passe à la granularité suivante
      if (this.zoom != this.zoomMaxLimit) {
        myChart.dispose();
        this.zoom++;
        FiltersStorageService.feedbackZoom = this.zoom; // Set zoom pour les feedbacks
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

    this.myChart.setOption(this.option, true);
  }

  /**
   * Récupérer les données du graphique
   */
  getData(
    idGranularity: number | null,
    idUser: number | null,
    formationZoom: number | null,
    setFormationSelected: number | null
  ) {
    this.canShowGraphicsFeedbackComponent = false;

    FiltersStorageService.specificGraphData('feedback', { idGranularity, formationZoom, setFormationSelected });

    this.RequestV2Service.getData('feedback', { idGranularity, formationZoom, setFormationSelected }).subscribe(
      (result: any) => {
        if (this.myChart) {
          this.myChart.dispose();
        }

        this.canShowGraphicsFeedbackComponent = true;

        this.data = JSON.parse(result.data.graphData.data).data;
        this.dataDetailed = JSON.parse(result.data.graphData.data).dataExtended;

        // Temporisation pour afficher le graphique, sinon problème d'affichage avec Echarts
        setTimeout(() => {

          this.endZoom = 2 * 100 / Object.keys(this.data).length;

          /** Afficher les cursors droite gauche */
          2 * 100 / Object.keys(this.data).length >= 100 ? this.showCursorRight = false : this.showCursorRight = true;
          this.getGraphic(this.data, this.dataDetailed);
          this.myChart.resize();
        });

      }
    )
  }

  goBackGranularity() {
    // Si clic il y a, on passe à la granularité suivante
    if (this.zoom != 0) {
      this.myChart.dispose();
      this.listIdGranularity[this.zoom] === null;
      this.zoom--;
      FiltersStorageService.feedbackZoom = this.zoom; // Set zoom pour les feedbacks
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
    FiltersStorageService.feedbackZoom = 0;
    this.listIdGranularity = [null, null, null, null, null, null];
    this.listNameGranularity = [];
    this.zoomName = null;
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

  /** Changer les couleurs des barres */
  getLabelColor(label: LabelsType) {
    switch (label) {
      case "Neutre":
        return '#d4d6d8';
      case "Bien":
        return '#00BBCE';
      case "Difficile":
        return '#FF404C';
      case "Facile":
        return '#FC90B7';
      case 'Long':
        return '#CE3699';
    }
  }

  /* 
  Changer les labels en fonction de la date filtrée par l'utilisateur 
  - Le feedback "Trop long" n'est plus disponible depuis le 01 Juin 2023, l'ajout de "Neutre" a fait son apparition à la même date
  */
  setupLabel(): string[] | undefined {

    const DayWeAddNeutral = moment("2023-06-01").format("YYYY-MM-DD HH:mm:ss");
    const beginDate = FiltersStorageService.beginDate;
    const endDate = FiltersStorageService.endDate; // Vous devez également obtenir la date de fin

    // Convertissez vos dates en timestamp pour la comparaison
    let beginTimestamp = moment(beginDate).valueOf();
    let endTimestamp = moment(endDate).valueOf();
    let compareTimestamp = moment(DayWeAddNeutral).valueOf();

    let result;

    if (beginTimestamp > compareTimestamp) {
      result = ["Bien", 'Difficile', 'Facile', 'Neutre'];
    } else if (beginTimestamp < compareTimestamp && endTimestamp > compareTimestamp) {
      result = ["Bien", 'Difficile', 'Facile', 'Neutre', 'Long'];
    } else if (beginTimestamp < compareTimestamp && endTimestamp < compareTimestamp) {
      result = ["Bien", 'Difficile', 'Facile', 'Long'];
    }

    return result;
  }
}

