import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {SettingsStorageService} from "../../../shared/consts/settingsStorage";
import {ProfileService} from "../../../shared/services/profile.service";
import {AuthService} from "../../../shared/services/auth.service";
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  /**
   * Changement d'état des inputs
   */
  emailField = false;

  /**
   * Stockage des informations de base de l'utilisateur
   */
  emailMemory = '';

  /**
   * User informations
   */
  email = '';
  actualPassword = ''; // Mot de passe actuel
  newPassword = ''; // Nouveau mot de passe
  newVerifyPassword = ''; // Vérification du nouveau mot de passe

  /**
   * Afficher les mots de passe
   */

  displayPassword = false;
  displayNewPassword = false;
  displayNewVerifyPassword = false;

  loadingPassword = false;
  loadingNewPassword = false;


  /**
   * Afficher les sections pour les mots de passe
   */
  showActualPassword = false;
  showChangePassword = false;

  errors = '';
  passwordValid = false;

  idAccount!: number;
  isLoading = true;

  titlePage: string | undefined;

  constructor(
    public settingsStorageService: SettingsStorageService,
    private profileService: ProfileService,
    private authService: AuthService,
    private userService: AuthService,
    private toastr: ToastrService,
    private settingsService: SettingsService
    ) { }

  ngOnInit(): void {

    // Change le nom de la page
    this.settingsService.changeData('Informations du compte');

    this.settingsStorageService.getStorageSettings();

    /**
     * Récupère les données de l'utilisateur qui se trouve en storage
     */
    this.profileService.getUser().subscribe(
      result => {
        this.email = this.emailMemory = result.data.user.email;
        this.idAccount = result.data.user.id;
        this.isLoading = false;
      }
    );
  }

  /**
   * Condition pour que le mot de passe soit correct :
   *  - 1 Chiffre
   *  - 1 Majucule
   *  - 1 Minisule
   *  - 8 Caractères minimum
   * @param userPassword
   */
  passwordValidator(userPassword: any): any {
    if (userPassword.match( /[0-9]/g) &&
      userPassword.match( /[A-Z]/g) &&
      userPassword.match(/[a-z]/g) &&
      userPassword.match( /[^a-zA-Z\d]/g) &&
      userPassword.length >= 8) {
      return true;
    }
    return false;
  }

  changePassword(): any{

    this.loadingNewPassword = true;

    const passwordValid = this.passwordValidator(this.newPassword);
    const passwordVerifyValid = this.passwordValidator(this.newVerifyPassword);

    if (this.newPassword === this.newVerifyPassword){
      if (passwordValid === true && passwordVerifyValid === true)
      {
        this.profileService.updatePassword(this.actualPassword, this.newPassword).subscribe(
          result => {
              localStorage.setItem('jwtToken', result.data.updatePassword.token);
              this.loadingNewPassword = false;
              this.toastr.success("Mot de passe modifié avec succès");
          },
          err => {
            this.loadingNewPassword = false;
            this.toastr.error("Une erreur est survenue lors de la modification du mot de passe");
          }
        );
      } else {
        this.errors = 'Mot de passe incorrect';
        this.loadingNewPassword = false;
      }
    } else {
      this.errors = 'INVALID_SAME_PASSWORD';
      this.loadingNewPassword = false;
    }
  }

  /**
   * Changement en base de données des éléments de l'utilisateur
   * @param value
   * @param type
   */
  verifyInformation(value: any, type: any): any{
    this.profileService.verifyUser(this.idAccount, value, type).subscribe(
      result => {
          localStorage.setItem('jwtToken', result.data.verifyUser.token);
          this.loadingNewPassword = false;
          this.toastr.success("Adresse mail modifiée avec succès");
      },
      err => {
        this.loadingNewPassword = false;
        this.toastr.error("Une erreure est survenue lors de la modification de l'adresse mail");

      }
    );
    this.changeField(type);
  }

  /**
   * Changer l'état des input (False ou True)
   */
  changeField(elementField: any): any{
    switch (elementField){
      case 'email':
        this.emailField = !this.emailField;
        break;
    }
  }

  /**
   * Si l'utilisateur cancel sa modification, on revient avec le nom de départ
   */
  cancelField(element: any, elementMemory: any, elementFieldName: any): any{
    switch (elementFieldName){
      case 'email':
        this.email = elementMemory;
        break;
    }
    this.changeField(elementFieldName);
  }

  displayActualPasswordSection(): any{
    this.showActualPassword = !this.showActualPassword;
  }

  /*
  Affiche / Cache les mots de passe
   */
  displayActualPassword(): any{this.displayPassword = !this.displayPassword; }
  displayNewPwd(): any{this.displayNewPassword = !this.displayNewPassword; }
  displayNewVerifyPwd(): any{this.displayNewVerifyPassword = !this.displayNewVerifyPassword; }

}
