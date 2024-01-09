import { Component, OnInit } from '@angular/core';
import { Errors } from '../../shared/models/errors.model';
import { User } from '../../shared/models/user';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DashboardService } from '../../shared/services/dashboard.service';
import { ProfileService } from '../../shared/services/profile.service';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { SettingsStorageService } from '../../shared/consts/settingsStorage';
import { Router } from '@angular/router';
import { FiltersStorageService } from '../../shared/consts/filtersStorage';
import { GranularitiesStorage } from '../../shared/consts/granularitiesStorage';
import { EventEmitterService } from "../../shared/services/event-emitter.service";
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/shared/services/export.service';
import { RequestV2Service } from 'src/app/shared/services/RequestV2Service';
import { JwtService } from 'src/app/shared/services/jwt.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {

  user: User = new User(); // Stock l'utilisateur connecté
  errors!: Errors;

  userId: any;

  titleHeader = 'BIENVENUE SUR TINYDATA';

  userZoom = false; // Vu entreprise ou Utilisateur ? 
  allowNotification = false; // Envoyer une notification si la connexion est différente de d'habitude
  showSelector = false;
  public isPossibleToExportInPDF = true;
  showExportModal = false; // Voir le modal d'export des données
  showExportExplication = false; // Afficher le message qui explique l'export 
  canShowGraphics = false; // Affiche le loader des graphiques
  canShowGraphicsPerformance = false; // Affiche le graphique performance
  isNewDay!: boolean;
  showButton = true; // Affiche les boutons pour la sélection des graphs (avant export)
  exportData: any = null;

  graphList: Map<string, any> = new Map<string, any>();
  graphData: Map<string, any> = new Map<string, any>();
  additionnalData: any;
  graphDataExtended: Map<string, any> = new Map<string, any>();
  totalData: Map<string, any> = new Map<string, any>();

  companyName: any;

  graphSelected = Array();

  constructor(
    public dashboardService: DashboardService,
    private profileService: ProfileService,
    private notificationsService: NotificationsService,
    private authService: AuthService,
    public settingsStorageService: SettingsStorageService,
    public filters: FiltersStorageService,
    public granularities: GranularitiesStorage,
    private toastr: ToastrService,
    private eventEmitterService: EventEmitterService,
    private exportService: ExportService,
    public router: Router,
    private requestV2Service: RequestV2Service,
    private jwtService: JwtService
  ) {
  }


  ngOnInit(): any {

    // window.location.assign("http://localhost:8081/export");
    // Si une personne vient à se connecter avec une autre application, une alerte est envoyé */
    this.newDeviceAlert('Tinydata');
    FiltersStorageService.isDataDetails = 'dashboard';

    // Paramètre pour toutes les pages
    this.settingsStorageService.getStorageSettings();

    // Si nous sommes en zoom utilisateur, afficher le graphique PERFORMANCE GENERALE
    this.eventEmitterService.refreshGraphics.subscribe(() => {
      this.setUserZoom();
    });

    this.setUserZoom()

    // Récupération de l'utilisateur
    this.profileService.getUser().subscribe(
      result => {
        this.user = result.data.user;
        this.userId = result.data.user.id;
        this.titleHeader = result.data.user.fullName; // title sur les autres pages
        this.companyName = result.data.user.companyName;
        this.canShowGraphics = true;
      }
    );
    const todays_Date = window.localStorage.getItem('_todaysDate');
    // this.MatrixLength = this.dashboardService.fetchMatrixLength()
    const show_wlc_workflow = window.localStorage.getItem('show_wlc_workflow');
    if (todays_Date) {
      const todaysDate = new Date();
      const day = new Date(todaysDate).getDate();
      const month = new Date(todaysDate).getMonth() + 1;
      if (todays_Date === `${day}-${month}` && show_wlc_workflow === 'false') {
        this.isNewDay = false;
      } else {
        this.isNewDay = true;
        this.storeDate();
      }
    } else {
      this.isNewDay = true;
      this.storeDate();
    }
    setTimeout(() => {
      this.prepareNotification().pipe(filter(res => res === true)).subscribe(() => {
      });
    }, 500);

  }


  graphZoom(graph: string) {
    FiltersStorageService.isDataDetails = 'dataDetails';
    this.router.navigate(['graph', graph]);
  }
  setUserZoom() {
    if (FiltersStorageService.isUserZoom) {
      this.userZoom = true;
    }
    else {
      this.userZoom = false;
    }
  }
  resetGraphDataExtended() {
    this.graphDataExtended = new Map<string, any>();
  }

  /**
   * Ajouter des graphiques au PDF
   * @param key 
   * @param graph 
   */
  getChart(key: any, graph: any): void {
    this.graphList.set(key, graph);
  }

  /**
   * Ajouter les données au PDF
   * @param key 
   * @param data 
   */
  getData(key: any, data: any) {
    this.graphData.set(key, data);
  }

  /**
   * Ajouter des données addionnelles au PDF
   * @param event 
   */
  getAdditionnalData(event: any) {
    this.additionnalData = event;
  }

  canStartExport() {
    return this.graphDataExtended.size >= Object.keys(this.graphSelected).length && this.exportData !== null;
  }

  getExtendedData(key: any, data: any) {
    if (key in this.graphSelected) {
      this.graphDataExtended.set(key, data);

      setTimeout(() => {
        if (this.canStartExport()) {
          this.startExport();
        }
      }, 0);
    }
  }


  /**
   * 
   * @param exportData 
   */
  callExtendedDataAndExport(exportData: any) {

    this.exportData = exportData;
    this.resetGraphDataExtended();
    this.eventEmitterService.callExtendedGraphData(this.graphSelected);
  }

  setTotalData(key: any, data: any) {
    this.totalData.set(key, data);
  }

  /**
   * Message pour prévenir d'une connexion suspecte.
   * @param context
   * @returns 
   */
  newDeviceAlert(context: string): any {
    return new Observable(observer => {
      this.profileService.getUser().subscribe(
        result => {
          this.dashboardService.dayConnection(context).subscribe((res: any) => {
            observer.next(true);
            // observer.complete()
          });
        });
    });
  }

  prepareNotification(): any {
    return new Observable(observer => {
      this.profileService.getUser().subscribe(
        result => {
          this.allowNotification = result.data.user.allowNotification;
          if (this.allowNotification && 'Notification' in window) {
            if ((window as any).Notification.permission === 'granted') {
              this.sendNotification().pipe(filter(res => res === true)).subscribe(() => {
                observer.next(true);
                // observer.complete()
              });
            } else if ((window as any).Notification.permission === 'denied') {
              this.dashboardService.dayConnection('Tinydata').subscribe((res: any) => {
                observer.next(true);
                // observer.complete()
              });
            } else {
              this.sendNotification().pipe(filter(res => res === true)).subscribe(() => {
                observer.next(true);
                // observer.complete()
              });
            }
          } else {
            this.dashboardService.dayConnection('Tinydata').subscribe((res: any) => {
              observer.next(true);
              // observer.complete()
            });
          }
        },
        err => {
          this.errors = err;
          observer.next(true);
        }
      );
      return observer.next(false);
    });
  }

  prepareExport(): any {
    this.graphSelected = Array();
    this.showButton = false;
    this.showSelector = true;
    this.showExportExplication = false;
  }

  setGraphSelected(key: any, value: boolean) {
    this.graphSelected[key] = value;
  }

  chooseExportType() {
    this.showButton = false;
    let isAGraphSelected = false;

    const keysToCheck = ["TOTAL_CONTENTS_FAILED", "TOTAL_CONTENTS_VALID", "USER_CONTRIBUTIONS"];
    this.isPossibleToExportInPDF = false;
    
    for (const key in this.graphSelected) {
      if (keysToCheck.includes(key) && this.graphSelected.hasOwnProperty(key) && this.graphSelected[key] === true) {
        this.isPossibleToExportInPDF = true;
        break;
      }
    }


    for (const [key, value] of Object.entries(this.graphSelected)) {
      if (value) {
        this.showButton = true;
        isAGraphSelected = true;
        break;
      }
    }
    if (isAGraphSelected) {
      this.showExportModal = true;
    }
    else {
      this.toastr.error("Veuillez sélectionner au moins un graphique")
    }
  }

  cancelExportExplication() {
    this.showExportExplication = true;
  }

  cancelExport() {
    this.showButton = true;
    this.showSelector = false;
  }

  cancelExportModal() {
    this.showSelector = false;
    this.showExportModal = false;
    this.exportData = null;
  }

  async startExport() {

    switch(this.exportData.type){

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
        const url = environment.host + `export?graphs=${graphs}&type=${this.exportData.type}&filters=${filters}&specificGraphData=${encodedData}&token=${token}`;
        window.open(url, '_blank');
        break;
        
      case "PDF":
      default:
        this.exportService.exportPDF(this.graphList, this.graphDataExtended, this.graphSelected, this.exportData, this.companyName, true, this.totalData, this.additionnalData);
        break;
    }

    this.exportData = null;
    this.cancelExportModal();
  }

  
  sendNotification(): any {
    return new Observable(observer => {
      this.notificationsService.requestPermission()
        .subscribe(() => {
          this.dashboardService.dayConnection('Tinydata').subscribe((res: any) => {
            observer.next(true);
            observer.complete();
          });
        }, (error: any) => {
          this.dashboardService.dayConnection('Tinydata').subscribe((res: any) => {
            observer.next(true);
          });
        });
    });
  }

  // La fonction permet de changer la date dans le localStorage
  storeDate(): any {
    const todaysDate = new Date();
    const day = new Date(todaysDate).getDate();
    const month = new Date(todaysDate).getMonth() + 1;
    window.localStorage.setItem('_todaysDate', `${day}-${month}`);
    window.localStorage.setItem('show_wlc_workflow', 'true');
  }
}
