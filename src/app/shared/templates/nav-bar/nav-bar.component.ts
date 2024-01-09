import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DashboardService} from '../../services/dashboard.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats} from '@angular/material/core';
import {Router} from '@angular/router';
import {SettingsStorageService} from "../../consts/settingsStorage";


export const MY_FORMAT: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT }
  ]
})
export class NavBarComponent implements OnInit {

  constructor(private authService: AuthService,
              private dashboardService: DashboardService,
              private _adapter: DateAdapter<any>,
              private router: Router,
              public settingsStorageService: SettingsStorageService) { }

  ngOnInit(): void {
    /** Rajoute les settings **/
    this.settingsStorageService.getStorageSettings();
  }

  logOut(): any {
    document.location.reload();
    this.authService.logOut();
  }

  navigateSettings(): any{
    this.router.navigate(['/settings/personal-informations']);
  }



}
