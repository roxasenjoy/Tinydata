import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/shared/services/settings.service';
import {SettingsStorageService} from "../../../shared/consts/settingsStorage";

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.css']
})
export class DataProtectionComponent implements OnInit {

  dataProtection = false;
  dataSecurity = true;
  titlePage: string | undefined;

  constructor(
    public settingsStorageService: SettingsStorageService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {

  // Change le nom de la page
  this.settingsService.changeData('Politique de protection des données');

    this.settingsStorageService.getStorageSettings();
  }

  showDataProtection(): any{
    this.dataProtection = true;
    this.dataSecurity = false;
  }

  showDataSecurity(): any{
    this.dataProtection = false;
    this.dataSecurity = true;
  }

}
