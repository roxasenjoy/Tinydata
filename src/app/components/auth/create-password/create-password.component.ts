import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import { User } from '../../../shared/models/user';
@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent implements OnInit {
  pwdForm!:FormGroup
  title!: string;
  authForm!: FormGroup;
  errors:any;
  user: User = new User();
  isSubmitting!: boolean;
  success: boolean = false;
  constructor( private fb: FormBuilder,
    private userService: AuthService,) { }

  ngOnInit() {
    this.pwdForm = this.fb.group({
      'email': ['', Validators.required],
  });
  }
  submit() {
    if (this.pwdForm.valid) {
        this.isSubmitting = true;
        this.errors = null;
        this.resetPassword(this.user);
    }
    else {
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
              this.errors = "Une erreur est survenue, veuillez ressayer Svp.";
              this.isSubmitting = false;
          }

      );
}

}
