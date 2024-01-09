import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user';
import { ProfileService } from '../../shared/services/profile.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordValidation} from '../auth/reset-password/password-validation';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('cguInput') cguButtonElementRef!: ElementRef;
  @ViewChild('myNewEmaill') myNewEmaillElementRef!: ElementRef;
  @ViewChild('myEmaill') myEmaillElementRef!: ElementRef;
  // inputValue = (<HTMLInputElement>document.getElementById("myNewEmail")).value;
  user: User = new User();
  currentUser: User = new User();
  isSubmitting: boolean = false;
  currentDate: any;
  currentTime: any;
  errors: any;
  onBoardings = [];
  authError: String = '';
  authForm!: FormGroup;
  success = false;
  errorsPassword: any;
  myPassword: string = '';
  loading: Boolean = true;
  loader = [];
  isLoggedIn: Boolean = false;

  myEmail: string = '';
  id: any;
  RegisterArray : any = {};
  successResetPassword: boolean = false;
  form!: FormGroup;
  loginCGU!: boolean;

  /**
   * Paramètres dans l'url
   */
  emailUser!: String;
  tokenUser: any;
  action!: string;

  /**
   * Loading...
   *
   * Permet à l'utilisateur de voir que le système fonctionne
   */
  loadingLogin!: boolean;
  loadingResetPassword!: boolean;
  loadingCreateAccount!: boolean;
  disableCrossDuringLoading!: boolean;

  /**
   * Création de compte
   */
  signUpFirstName!: string;
  signUpLastName!: string;
  signUpPhone!: string;
  signUpPassword!: string;
  signUpVerifyPassword!: string;
  signUpCGU!: boolean;


  /**
   * Affichage des modals
   */
  modalLogin = false;
  modalEmailResetPassword = false;
  modalResetPassword = false;
  modalCreateAccount = false;

  /**
   * Gestion de l'affichage des mots de passe
   */
  displayPasswordEye = false; // Login
  displayPasswordVerficiationEye = false; // Reset Password
  displayPasswordLoginEye = false; // Reset Password
  displayPasswordCreateAccountEye = false; // Create Account
  displayVerifyPasswordCreateAccountEye = false; // Create Account

  options: AnimationOptions = {
    path: 'assets/lottie/home.json', // required
    renderer: 'svg', // required
    loop: true, // optional
    autoplay: true, // optional
 };


  constructor(
      private authService: AuthService,
      private router: Router,
      private fb: FormBuilder,
      private userService: AuthService,
      private profileService: ProfileService,
      private route: ActivatedRoute,
  ) {



    this.route.queryParams.subscribe(params => {
      this.emailUser = params['email'];
      this.tokenUser = params['token'];
      this.action = params['action'];

      // use FormBuilder to create a form group
      this.form = this.fb.group({
            // define your control in you form
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
          },
          {
            validator: PasswordValidation.ValidPassword, // your validation method

          });


      switch (this.action) {
        case 'reset-password':
          this.modalResetPassword = true;
          break;
      }

    });
  }

  ngOnInit() {
    /**prevent previous click**/
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    window.localStorage.setItem('show_wlc_workflow', 'true');

    /* Vérification du password lors du reset */
    const token = this.route.snapshot.queryParams.token;
    const email = this.route.snapshot.queryParams.email;
    if (!token || !email) {
      this.router.navigate(['login']);
    }
    this.user.resetPasswordCode = token;
    this.user.email = email;
    /*******************************************/

    if (!this.userService.isAuthenticated()) {
      this.isLoggedIn = false;
      this.currentDate = moment()
          .locale('fr')
          .format('dddd DD MMMM YYYY');

    } else {

      // Evite de se connecter si le compte n'est pas inscrit correctement
      if (!this.user.firstName && !this.user.phone) {
        localStorage.clear();
      } else {
        this.isLoggedIn = true;
        this.profileService.getUser().subscribe(
            result => {
              this.currentUser = result.data.user;
              if (this.currentUser.inscriptionDate === null) {
                this.currentDate = moment().format('dddd DD MMMM YYYY');
                this.currentTime = moment()
                    .locale('fr')
                    .format('LT');
              } else {
                this.router.navigateByUrl('/dashboard');
              }
            },
            err => {
              console.log(err);
            }
        );
      }
    }

    /* Formulaire de récupération de mot de passe */
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
    });

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

  /**
   * Réinitialisation du mot de passe
   */
  submitFormResetPassword() {
    this.loadingResetPassword = true;

    if (this.form.valid) {
      this.user.password = this.form.controls.password.value;
      if (this.passwordValidator(this.user.password)) {
        this.isSubmitting = true;
        this.errors = null;
        this.disableCrossDuringLoading = true;
        this.resetPwd(this.user); // Permet de mettre à jour le mot de passe
      } else {
        this.loadingResetPassword = false;
        this.errors = 'Veuillez saisir un mot de passe valide';
      }
    } else {
      this.loadingResetPassword = false;
      this.errors = 'Veuillez saisir un mot de passe valide';
    }
  }

  /**
   * REINITIALISATION DU MOT DE PASSE - Permet de reset le password
   *
   * @param user
   */
  resetPwd(user : any) {
    this.userService
        .resetPwd(user)
        .subscribe(
            (result: any) => {

              if ( result.data.resetPassword ) {
                this.success = true;
              } else {
                this.success = true;
                this.errors = result.errors[0].message;
              }

              this.verifyAccount(this.emailUser, this.user.password, this.loginCGU); // On se connecte directement au dashboard
              this.isSubmitting = false;
            },
            err => {
              this.errors = 'Erreur de connexion';
              this.isSubmitting = false;
            }
        );
  }

  /**
   * Vérification du compte
   * @param email
   * @param password
   * @param passwordRemember
   */
  verifyAccount(email : any, password : any, passwordRemember : any) {
    if (!passwordRemember) {
      passwordRemember = false;
    }

    /**************
     * Vérification Mot de passe
     **************/
    this.loadingLogin = true; // Loading....
    this.authService.onBoardingLoginTinydata(email, password, passwordRemember).subscribe(
        result => {

          if (result.data.login !== null) {
            this.authError = 'NO ERRORS';
            this.userService.setAuth(result.data.login.token);
            this.profileService.getUser().subscribe(
                res => {
                  if (!res.data.user.cgu && !res.data.user.inscriptionDate) {
                      this.loadingLogin = false; // Loading....
                      this.modalLogin = false;
                      this.modalCreateAccount = true;
                  } else {
                      this.router.navigateByUrl('/dashboard');
                      this.loadingLogin = false; // Loading....
                      this.modalLogin = false;
                  }
                },
                err => {
                  console.log(err);
                }
            );
          } else {
            this.loadingLogin = false;
            let errors = result.errors;
            this.authError = errors ? result.errors[0].message : "";
          }

          // LE MOT DE PASSE EST INVALIDE
          if (this.authError === 'INVALID PASSWORD') {
            this.loadingLogin = false;
          }
        },
        ({graphQLErrors, networkError})  => {
          this.authError = graphQLErrors[0].message;
          this.loadingLogin = false;
        }
    );
  }

  /**
   * Création du compte de l'utilisateur Tinydata.
   *
   * @param signUpFirstName
   * @param signUpLastName
   * @param signUpPhone
   * @param signUpPassword
   * @param signUpVerifyPassword
   * @param signUpCGU
   */
  signUpTinydata() {

    /**
     * A OPTIMISER / Toujours éviter la forêt de IF !!!
     */
    if (this.signUpPassword && this.signUpVerifyPassword && (this.signUpCGU === true)) {
        if (this.signUpPassword === this.signUpVerifyPassword) {
          if (this.passwordValidator(this.signUpPassword) === true) {

            this.errors = '';

            this.loadingCreateAccount = true;


            // UPDATE - Password
            this.authService.initializeAccount(this.myPassword, this.signUpPassword).subscribe(
                (result: any) => {
                  this.userService.setAuth(result.data.initializeAccount.token);
                  this.profileService.getUser().subscribe();
                  this.router.navigateByUrl('/dashboard');
                },
                err => {
                  this.loadingCreateAccount = false;
                  this.errors = err;
                }
            );
          } else {
            this.errors = 'Mot de passe incorrect';
          }
        } else {
          this.errors = 'Mot de passe incorrect';
        }
    } else {
      this.errors = 'FIELD EMPTY';
    }
  }

  validateEmail(email: any): any {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexEmail.test(email);
  }

  /**
   * MOT DE PASSE OUBLIE - Formulaire pour envoyer le mail
   */
  submitForm(): any {
    if (this.validateEmail(this.user.email)){
        this.isSubmitting = true;
        this.errorsPassword = null;
        this.resetPassword(this.user);
    } else {
      this.errorsPassword = 'Adresse mail non valide';
    }

  }

  /**
   * MOT DE PASSE OUBLIE - Permet de reset le mot de passe.
   * @param user
   */
  resetPassword(user : any) {
    const resetPassword = document.getElementById('resetPassword');
    resetPassword!.style.display = 'none';
    this.successResetPassword = true;

    this.userService
        .forgotPwd(user)
        .subscribe(
            (result: any) => {

              if ( result.data.forgotPassword === true ) {
                this.successResetPassword = false;
                this.success = true;

              } else {
                resetPassword!.style.display = 'none';
                this.successResetPassword = false;
                this.errorsPassword = "Adresse mail non valide";

              }
              this.isSubmitting = false;
            },
            err => {
              this.errorsPassword = 'Une erreur est survenue, veuillez recommencer';
              this.isSubmitting = false;
            }
      );
  }

  /**
   * Cache tous les modals dès qu'on clique sur une croix.
   */
  hideAllModals() {

    const urlHome = 'http://localhost:4200/#/home';

    // Listes des modals
    this.modalLogin = false;
    this.modalEmailResetPassword = false;
    this.modalResetPassword = false;
    this.modalCreateAccount = false;

    // Gestion de l'affichage des mots de passe
    this.displayPasswordEye = false;
    this.displayPasswordVerficiationEye = false;
    this.displayPasswordLoginEye = false;

    if (this.action === 'reset-password') {
      window.location.href = urlHome;
      document.location.reload();
    }
    localStorage.clear();
  }

  displayModalPassword() {
    this.modalCreateAccount = false;
    this.errorsPassword = false;
    this.authError = 'NO ERRORS';

    if (this.modalEmailResetPassword) {
      this.modalEmailResetPassword = false;
    } else {
      this.modalEmailResetPassword = true;
      this.modalLogin = false;
    }
  }

  displayModalConnexion() {
    this.modalLogin = !this.modalLogin;
  }

  /**
   * Cache / Affiche le mot de passe
   *
   * Attention, ce code n'est pas opti
   */
  displayPassword() {this.displayPasswordEye = !this.displayPasswordEye; }
  displayVerifyPassword() {this.displayPasswordVerficiationEye = !this.displayPasswordVerficiationEye; }
  displayPasswordLogin() {this.displayPasswordLoginEye = !this.displayPasswordLoginEye; }
  displayPasswordCreateAccount() {this.displayPasswordCreateAccountEye = !this.displayPasswordCreateAccountEye; }
  displayVerifyPasswordCreateAccount() {this.displayVerifyPasswordCreateAccountEye = !this.displayVerifyPasswordCreateAccountEye; }
}
