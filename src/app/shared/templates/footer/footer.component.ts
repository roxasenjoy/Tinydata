// @ts-ignore
import {Component, OnInit} from '@angular/core';
import { SettingsStorageService } from '../../consts/settingsStorage';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  year: number;

  constructor(
    public settingsStorageService: SettingsStorageService,
  ) {}

  ngOnInit(): any {
    this.year = new Date().getFullYear();
  }
}


