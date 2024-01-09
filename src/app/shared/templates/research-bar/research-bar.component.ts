import {Component, OnInit, ViewChild} from '@angular/core';

import {map, startWith, debounceTime} from 'rxjs/operators';
import {User} from '../../models/user';
import {Errors} from '../../models/errors.model';
import {Observable} from 'rxjs';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DashboardService} from '../../services/dashboard.service';
import {ProfileService} from '../../services/profile.service';
import {SettingsStorageService} from "../../consts/settingsStorage";
import {EventEmitterService} from "../../services/event-emitter.service";
import { FiltersStorageService } from '../../consts/filtersStorage';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-research-bar',
  templateUrl: './research-bar.component.html',
  styleUrls: ['./research-bar.component.css']
})

export class ResearchBarComponent implements OnInit {
  user: User = new User();
  errors!: Errors;
  date: Date = new Date();
  loading = true;

  

  returnValues: string[] = [];

  // Permet de savoir si il existe des champs dans la barre de recherche
  numberFilterEmpty = 0;
  errorResearch!: boolean;
  cancelResearchButton!: boolean;

  // Loading de la barre de recherche
  isSearching = false;

  /**
   * Champ entré par l'utilisateur
   */
  myControl = new FormControl('', [Validators.required]);

  /**
   * Design des éléments qui ont besoin d'etre affichés en cliquant sur un bouton
   */
  settingsOpen = false;
  filtered!: Observable<any>;

  /* RESEARCH BAR - Reactualise les données en fonction de ce qu'on recherche */
  storageMatrix: any[] = [];
  storageDomain: any[] = [];
  storageSkill: any[] = [];
  storageTheme: any[] = [];
  valueStorage: any;

  id: string[] = [];
  title: string[] = [];
  type: string[] = [];
  document: any;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete!: MatAutocompleteTrigger;
  
  scrollEvent = (event: any): void => {
    if(this.autoComplete.panelOpen)
      // this.autoComplete.closePanel();
      this.autoComplete.updatePosition();
  };

  constructor(
      private router: Router,
      public dashboardService: DashboardService,
      private profileService: ProfileService,
      public settingsStorageService: SettingsStorageService,
      private eventEmitterService: EventEmitterService
  ) {
  }

  ngOnInit(): any {
    
    window.addEventListener('scroll', this.scrollEvent, true);

    /** Rajoute les settings **/
    this.settingsStorageService.getStorageSettings();

    /* Permet de charger les données de l'utilisateur */
    this.profileService.getUser().subscribe(
        result => {
          this.user = result.data.user;
        }
    );

    this.filtered = this.myControl.valueChanges.pipe(
        debounceTime(100),
        startWith(''),
        map(val => val.length >= 3 ? this.filterValue(val) : [])
    );
  }

  

  removeAutocompleteFocus() {
    let element = this.document.querySelector('.mat-autocomplete-panel');
    if (element) {
       element.parentNode.removeChild(element);
    }
 }

  /**
   * ETAPE 2
   */
  refreshGraphics(): any{
    this.eventEmitterService.callRefreshGraphics();
  }

  refreshZoomFilters(): any{
    this.eventEmitterService.callRefreshZoomFilters();
  }

  // tslint:disable-next-line:no-shadowed-variable
  pushElement(element: any): any {
    this.returnValues.push(element);

  }

  displayObjectName(val: any): any {
    return val ? val.title : val
  }

  filterValue(value: string): any {
    this.dashboardService.researchBar(this.myControl.value.toLowerCase()).subscribe(
        result => {
          // tslint:disable-next-line:no-shadowed-variable
          result.data.researchBar.forEach((element: any) => this.pushElement(element));

          // Si la barre de recherche ne trouve pas de résultat, elle affiche un message d'erreur
          if (result.data.researchBar.length === 0) {
            this.errorResearch = true;
            this.cancelResearchButton = true;
          } else {
            this.errorResearch = false;
            this.cancelResearchButton = false;
          }
          this.returnValues = [];
        }
    );

    return this.returnValues;

  }


  /***************************************************************/
  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms));
  }

  research(): any {
    this.isSearching = true;
    this.dashboardService.researchBar(this.myControl.value.title).subscribe(
        result => {
          // tslint:disable-next-line:no-shadowed-variable
          result.data.researchBar.forEach((element: any) => this.getElement(element));
        }
    );
  }

  selectItem(data:any) {
    this.getElement(data);
  }


  // tslint:disable-next-line:no-shadowed-variable
  getElement(element: any): any {
    this.isSearching = false;

    // On vérifie si les éléments correspondent à la barre de recherche
    if ((element.title === this.myControl.value.title) && (element.objectId === this.myControl.value.objectId)) {
      // On vérifie si les éléments existent
      if (element.title && element.objectId) {
        
        /*
          Pour chaque recherche il faut modifier : 
            - Le ZOOM
            - Le filtre
            - Mettre à jour le filtre pour que les éléments correspondent
            - Le localstorage (Si existant ou non)
        */

            /** NE PAS RECHERCHER L'UTILISATEUR EN FONCTION DE SON USER ID MAIS DE SON USER_CLIENT ID */
        switch(element.type) {
          // REGROUPER LES DEUX CASES EN UN SEUL
          case 'UTILISATEUR':
          case 'EMAIL':
           // element.id = element.objectId;
           let userObject;
           this.profileService.getUserById(element.objectId).subscribe(
             result => {
               userObject = result.data.userById;
               FiltersStorageService.userZoomObject = userObject;
               this.eventEmitterService.callSetZoomUserFilter();
             }
           );
            FiltersStorageService.userZoom = {
              ...element,
              id:element.objectId
            };
            this.refreshGraphics();
            this.refreshZoomFilters();
            this.eventEmitterService.callSetZoomUserFilter();

            break;
          
          case 'FORMATIONS':
            this.setResearch(FiltersStorageService.matrix, element, 0);
            FiltersStorageService.resetFilterFormations();
            break;

          case 'DOMAINE':
            this.setResearch(FiltersStorageService.domain, element, 1);
            FiltersStorageService.resetFilterFormations();
            break;

          case 'COMPÉTENCE':
            this.setResearch(FiltersStorageService.skill, element, 2);
            FiltersStorageService.resetFilterFormations();
            break;

          case 'THEME':
            this.setResearch(FiltersStorageService.theme, element, 3);
            FiltersStorageService.resetFilterFormations();
            break;

          default:
            this.router.navigate([element.type.toLowerCase() + '/' + element.objectId]);
            break;
        }
      } else {
        this.errorResearch = true;
      }
    }
  }


  /**
   * 
   * @param storage Quel élément dans le localStorage ? 
   * @param researchBarElement L'élement qui est recherché dans la barre de rechercher
   * @param zoomFormation La granularité de l'élément sélectionné
   *  // 0 = Matrice
      // 1 = Domaine 
      // 2 = Compétence 
   */
  setResearch(storage: any, researchBarElement: any, zoomFormation: Number){

    // On créer un tableau vide pour stocker / rajouter les éléments du localStorage
    let storageElement = storage;

    // Si le localStorage est vide, 
    if(storageElement === null){
      storageElement = [];
    }

    // Détermine si l'élement est déjà présent, si ce n'est pas le cas, on le rajoute.
    const indexDomain = storageElement.indexOf(researchBarElement.objectId); // Index de l'élément (-1 si inexistant)

    if (indexDomain === -1){
      storageElement.push(researchBarElement.objectId); // Element pas présent
    }

    // On rajoute l'information dans le filtre correspondant
    // On se base sur ce qui se trouve dans le filtre.component.ts
    switch(zoomFormation){
      case 0: // Matrices
        FiltersStorageService.matrix = storageElement;
        break;

      case 1: // Domaines
        FiltersStorageService.domain = storageElement;
        break;

      case 2: // Compétences
        FiltersStorageService.skill = storageElement;
        break;

      case 3: // Thèmes
        FiltersStorageService.theme = storageElement;
        break;
    }

      /*
        On refresh tous les filtres pour que les informations correspondent.
        Et on affiche les graphiques en prenant en compte les nouveaux filtres.
      */
      FiltersStorageService.formationZoom = zoomFormation; 
      this.eventEmitterService.callRefreshZoomFilters();
      this.refreshGraphics(); // Refresh tous les graphiques
      this.refreshZoomFilters(); // Refresh tous le filtre ZOOM Formation
  }


}
