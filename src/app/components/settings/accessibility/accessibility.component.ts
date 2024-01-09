import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/shared/services/settings.service';
import {SettingsStorageService} from "../../../shared/consts/settingsStorage";

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.css']
})
export class AccessibilityComponent implements OnInit {

  color = 'primary';
  nightChecked = false;
  weightChecked = false;
  textSizeChecked = false;
  descriptionContentCheckeded = false;

  nightStorage = localStorage.getItem('night');
  weightStorage = localStorage.getItem('weight');
  textSizeStorage = localStorage.getItem('textSize');
  descriptionContentStorage = localStorage.getItem('descriptionContent');

  titlePage: any;

  constructor(
    public settingsStorageService: SettingsStorageService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {

    this.settingsService.changeData('Accessibilité');

    this.settingsStorageService.getStorageSettings();

    if (this.nightStorage != null) {
      this.nightChecked = JSON.parse(this.nightStorage);

    }

    if (this.weightStorage != null) {
      this.weightChecked = JSON.parse(this.weightStorage);

    }

    if (this.textSizeStorage != null) {
      this.textSizeChecked = JSON.parse(this.textSizeStorage);

    }

    if (this.descriptionContentStorage != null) {
      this.descriptionContentCheckeded = JSON.parse(this.descriptionContentStorage);

    }


  }


  accessibilitySettings(value: any, key: any): any{
    if (!value){
      // Activé
      localStorage.setItem(key, JSON.parse('true'));
      this.settingsStorageService.getStorageSettings();
    } else {
      // Désactivé
      localStorage.setItem(key,  JSON.parse('false'));
      this.settingsStorageService.getStorageSettings();
    }
  }


}
