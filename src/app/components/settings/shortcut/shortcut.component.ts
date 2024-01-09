import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/shared/services/settings.service';
import {SettingsStorageService} from "../../../shared/consts/settingsStorage";

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.css']
})
export class ShortcutComponent implements OnInit {

  titleHeader = 'Créer un raccourci';

  constructor(
    public settingsStorageService: SettingsStorageService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {

    this.settingsService.changeData('Raccourcis');
    this.settingsStorageService.getStorageSettings();
  }

}
