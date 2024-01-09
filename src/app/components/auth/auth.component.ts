import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  title!: string;
  authForm!: FormGroup;
  errors:any;
  user: User = new User();
  isSubmitting!: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.user.login = username;
        this.postToken(this.user);
      }
    });
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.authForm.valid) {
      this.isSubmitting = true;
      this.errors = null;
      this.postToken(this.user);
    } else {
      this.errors = 'Adresse mail ou numéro téléphone non valide';
    }
  }

  postToken(user:any) {
    this.userService.login(user).subscribe(
      (result: any) => {
        if (result.data.postToken) {
          this.userService.setAuth(result.data.postToken);

        } else {
          this.errors = result.errors[0].message;
        }
      },
        (err: any) => {
        this.errors = 'Erreur de connexion';
        this.isSubmitting = false;
      }
    );
  }
}
