import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { PasswordValidation } from './password-validation';
import {AuthService} from "../../../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../shared/models/user";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    form: FormGroup;
    isSubmitting: Boolean = false;
    errors: any;
    private user: User = new User();
    success: boolean = false;


    constructor(private fb: FormBuilder,
                private userService: AuthService,
                private route: ActivatedRoute,
                public router: Router
        ) {

          // use FormBuilder to create a form group
          this.form = this.fb.group({
              // define your control in you form
              password: ['', Validators.required],
              confirmPassword: ['', Validators.required],
      },
              {
                  validator: PasswordValidation.ValidPassword, // your validation method

              })

      }

    ngOnInit() {
        var token = this.route.snapshot.queryParams.token;
        var email = this.route.snapshot.queryParams.email;
        if(!token || !email){
            this.router.navigate(['login']);
        }
        this.user.resetPasswordCode = token;
        this.user.email = email;
    }

    submitForm()
    {
        if (this.form.valid) {
            this.isSubmitting = true;
            this.errors = null;
            this.user.password = this.form.controls.password.value;
            this.restPwd(this.user);
      } else {
            this.errors = 'Veuillez saisir un mot de passe valide';
      }
    }

    restPwd(user: any) {
        this.userService
            .resetPwd(user)
            .subscribe(
              (result: any) => {
                    if ( result.data.resetPassword ) {
                        this.success = true;
                    } else {
                        this.errors = result.errors[0].message;
                    }
                    this.isSubmitting = false;
                },
                err => {
                    this.errors = 'Erreur de connexion';
                    this.isSubmitting = false;
                }
            );
    }

}
