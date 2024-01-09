import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/shared/services/settings.service';
import {SettingsStorageService} from "../../../shared/consts/settingsStorage";

@Component({
  selector: 'app-cgu-cgv',
  templateUrl: './cgu-cgv.component.html',
  styleUrls: ['./cgu-cgv.component.css']
})
export class CguCgvComponent implements OnInit {

  titlePage: string | undefined;

  constructor(
    public settingsStorageService: SettingsStorageService,
    private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.settingsService.changeData('CGU et CGV');
    this.settingsStorageService.getStorageSettings();

  }

}
