import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AuthService } from 'src/app/shared/services/auth.service';
import { JwtService } from 'src/app/shared/services/jwt.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import {SettingsStorageService} from "../../shared/consts/settingsStorage";
import { environment } from 'src/environments/environment';

interface pageType {
  name: string;
  url: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // Afficher les informations de l'administrateur
  showAdminPanel = false;

  showSettingsBack = false;
  myTemplateRef: any;

  titlePage: string | undefined;
  pageSelected: string;


  // Création de toutes les pages ADMINs
  // adminPages = [
  //   {
  //     name: 'Gestion des comptes',
  //     url: 'admin/gestion-des-comptes'
  //   }
  // ];

  // Création de toutes les pages utilisateurs
  userPages = [
    {
      name: 'Informations personnelles',
      url: 'personal-informations'
    },
    {
      name: 'Informations du compte',
      url: 'mon-compte'
    },
    {
      name: 'Politique de protection des données',
      url: 'politique-de-protection-des-données'
    },
    {
      name: 'CGU et CGV',
      url: 'cgu-cgv'
    },
    {
      name: 'Accessibilité',
      url: 'accessibilite'
    },
    {
      name: 'Raccourcis',
      url: 'raccourcis'
    },
  ]


  @ViewChild('template') template: TemplateRef<any> | undefined;
  @ViewChild('trigger') trigger: TemplateRef<any> | undefined;

  constructor(
    private router: Router,
    public settingsStorageService: SettingsStorageService,
    public route: ActivatedRoute,
    public authService: AuthService,
    private settingsService: SettingsService,
    public jwtService: JwtService
  ) {}

  ngOnInit(): void {

    // Permet de recevoir les données des enfants - Changer le titre de la page
    this.settingsService.titlePage$.subscribe((res: string | undefined) => this.titlePage = res) 

    // Vérifier la page actuelle
    this.verifyActualPage(this.userPages);

    this.authService.checkUserIsSuperAdminClient().subscribe(result => {
      this.showAdminPanel = result.data.userIsSuperAdminClient;
    });

    
    this.myTemplateRef = this.trigger;
    setTimeout(() => {
      this.myTemplateRef = this.template;

    }, 0);

    // @ts-ignore
    this.router.events.subscribe((routerEvent: Event) => {
      this.myTemplateRef = this.trigger;
      setTimeout(() => {
        this.myTemplateRef = this.template;
      }, 0);
    });
  }

  /**
   * Au moment de rafraichir la page, on récupére la page sur laquelle on se trouve pour mettre la section en bleue
   * @param array: pageType[]
   */
  verifyActualPage(array: pageType[]){

    const actualURL = window.location.href;

    array.forEach((element) =>{
      if(actualURL.includes(element.url)){
        this.pageSelected = element.url;
      }
    });

  }

  goToSettings(childPage: any): any{

    this.showSettingsBack = false;

    if (childPage === '') {
      this.router.navigate(['settings']);
    } else {
      this.showSettingsBack = true;
      this.pageSelected = childPage;
      this.router.navigate([childPage], {relativeTo: this.route});
    }
  }

  /**
   * Récupération du Token pour réussir la connexion à la Tinysuite sans problème.
   */
  goToTinySuite(){
    // Ouvrir la Tinysuite avec le token
    this.jwtService.getTinysuiteToken().subscribe(
      (result: any)=> {
        var token = result.data.tinysuiteToken;
		    window.open(environment.tinysuite + 'admin/redirect/' + token, '_blank');
      }
    );
  }

  goToDashboard(){
    this.router.navigate(['dashboard']);
  }

}
