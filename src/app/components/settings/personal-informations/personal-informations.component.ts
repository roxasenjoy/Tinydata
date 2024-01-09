import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../shared/services/profile.service';
import { SettingsStorageService } from '../../../shared/consts/settingsStorage';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal-informations',
  templateUrl: './personal-informations.component.html',
  styleUrls: ['./personal-informations.component.css']
})
export class PersonalInformationsComponent implements OnInit {


  /**
   * Changement d'état des inputs
   */
  firstNameField = false;
  lastNameField = false;

  /**
   * Stockage des informations de base de l'utilisateur
   */

  firstNameMemory = '';
  lastNameMemory = '';

  /**
   * User informations
   */
  lastName = '';
  firstName = '';
  company = '';

  idAccount!: number;
  isLoading = true;

  titlePage: string | undefined;

  constructor(
    private profileService: ProfileService,
    public settingsService: SettingsService,
    public settingsStorageService: SettingsStorageService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): any {

    // Change le nom de la page
    this.settingsService.changeData('Informations personnelles');

    this.settingsStorageService.getStorageSettings();

    /**
     * Récupère les données de l'utilisateur qui se trouve en storage
     */
    this.settingsService.getUserAccount().subscribe(
      result => {
        const user = result.data.account[0];
        this.firstName = this.firstNameMemory = user.firstName;
        this.lastName = this.lastNameMemory = user.lastName;
        this.company = user.organisation.name;
        this.idAccount = user.id;

        this.isLoading = false;
      }
    );
  }


  /**
   * Changement en base de données des éléments de l'utilisateur
   * @param value
   * @param type
   */
  verifyInformation(value: any, type: any): any {
    this.isLoading = true;
    this.profileService.verifyUser(this.idAccount, value, type).subscribe(
      result => {
        this.isLoading = false;
        this.toastr.success("Modification effectuée avec succès");
        this.changeField(type);

      },
      err => {
        this.isLoading = false;
        this.toastr.error("Une erreure est survenue lors de la modification des informations");
        this.changeField(type);

      }
    );
  }

  /**
   * Changer l'état des input (False ou True)
   */
  changeField(elementField: any): any {
    switch (elementField) {
      case 'firstName':
        this.firstNameField = !this.firstNameField;
        break;
      case 'lastName':
        this.lastNameField = !this.lastNameField;
        break;
    }
  }

  /**
   * Si l'utilisateur cancel sa modification, on revient avec le nom de départ
   */
  cancelField(element: any, elementMemory: any, elementFieldName: any): any {
    switch (elementFieldName) {
      case 'firstName':
        this.firstName = elementMemory;
        break;
      case 'lastName':
        this.lastName = elementMemory;
        break;
    }

    this.changeField(elementFieldName);

  }


}
