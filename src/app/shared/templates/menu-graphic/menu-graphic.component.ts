// @ts-ignore
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { SettingsStorageService } from 'src/app/shared/consts/settingsStorage';

@Component({
  selector: 'menu-graphic',
  templateUrl: './menu-graphic.component.html',
  styleUrls: ['./menu-graphic.component.css']
})
export class MenuGraphicComponent implements OnInit {

  @Output() public clickMore = new EventEmitter<boolean>();
  @Output() public clickInformations = new EventEmitter<boolean>();

  constructor(
    public settingsStorageService: SettingsStorageService,
  ) {}

  ngOnInit(): any {

  }

  seeInformations(){
    this.clickInformations.emit();
  }
  
  seeMore(){
    this.clickMore.emit();
  }
}


