import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../shared/models/user";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-reset',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    title!: string;
    authForm!: FormGroup;
    errors:any;
    user: User = new User();
    isSubmitting!: boolean;
    success: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {

    }

    ngOnInit() {

        // this.activatedRoute.queryParams.subscribe(params => {
        //     let username = params['username'];
        //     if(username){
        //         this.user.login = username;
        //         this.postToken(this.user);
        //     }
        // });
        // use FormBuilder to create a form group
        this.authForm = this.fb.group({
            'email': ['', Validators.required],
        });
    }
    submitForm() {
        if (this.authForm.valid) {
            this.isSubmitting = true;
            this.errors = null;
            this.resetPassword(this.user);
        } else {
            this.errors = 'Adresse mail non valide';
        }
    }

    resetPassword(user:any) {
        this.userService
            .forgotPwd(user)
            .subscribe(
              (result: any) => {

                    if ( result.data.forgotPassword === true ) {
                        this.success = true;
                    } else {
                        this.errors = result.errors[0].message;
                    }
                    this.isSubmitting = false;
                },
                err => {
                    this.errors = 'Une erreur est survenue, veuillez ressayer Svp.';
                    this.isSubmitting = false;
                }
            );
    }
}
