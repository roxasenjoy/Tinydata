import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EntrepriseService} from "../../shared/services/entreprise.service";
import {SettingsStorageService} from "../../shared/consts/settingsStorage";
import {ProfileService} from "../../shared/services/profile.service";

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  /* Récupération des éléments pour l'entreprise */
  idCompany: string | null = '';

  dateFrom: string = 'XXXX-XX-XX';
  dateTo: string = 'XXXX-XX-XX';
  typeContract: string = '';
  numberUsers: number = 0;
  usersActive: number = 0;
  formations: string[] = [];
  parcours: string[] = [];

  titleHeader = 'ENTREPRISE';



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entrepriseService: EntrepriseService,
    public settingsStorageService: SettingsStorageService,
    public profileService: ProfileService,
  )
  { }

  ngOnInit(): void {
    /** Rajoute les settings **/
    this.settingsStorageService.getStorageSettings();

    this.idCompany = this.route.snapshot.paramMap.get('id');

    this.profileService.getUser().subscribe(
      result => {
        // Obtenir toutes les entreprises de l'utilisateur
        // Si l'utilisateur possède l'id d'une des entreprises, il peut accéder à la page.
        this.profileService.getAllCompaniesName(Number(this.idCompany)).subscribe(
          (result: any) => {
            if(result.data.companiesNames.inCompany === true){
              this.getCompanyInformations();
            } else {
              this.router.navigateByUrl('/dashboard');
            }
          }
        );
      }
    );
  }

  goToDashboard(){
    this.router.navigate(['/dashbaord']);
  }

  getCompanyInformations(): any{
    this.entrepriseService.getCompanies(Number(this.idCompany)).subscribe(
      result => {
        this.titleHeader = result.data.companyInformation[0].name;
        this.dateFrom = result.data.companyInformation[0].beginContract;
        this.dateTo = result.data.companyInformation[0].endContract;
        this.numberUsers = result.data.companyInformation[0].number_users;
        this.usersActive = result.data.companyInformation[0].users_active;
        this.typeContract = result.data.companyInformation[0].typeContract;
        // @ts-ignore
        result.data.companyInformation[0].formations.forEach((element) => this.pushFormations(element));
        // @ts-ignore
        result.data.companyInformation[0].parcours.forEach((element) => this.pushParcours(element));
      }
    );
  }


  pushFormations(element: any): any {
    // @ts-ignore
    this.formations.push(element);
  }

  pushParcours(element: any): any {
    // @ts-ignore
    this.parcours.push(element);
  }


}
