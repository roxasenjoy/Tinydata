import {Injectable} from '@angular/core';

@Injectable()
export class SettingsStorageService {

  nightStorage: any;
  weightStorage: any;
  textSizeStorage: any;
  descriptionContentStorage: any;

  /**
   * Class CSS
   */
  nightTextCSS = 'nightText';
  nightBackgroundCSS = 'nightBackground';
  nightFieldCSS = 'nightField';
  nightSidebarCSS = 'nightSidebar';
  nightBodyCSS = 'nightBody';

  weightCSS =  'weightText';

  textSizeLarge = 'largeText';
  textSizeMedium = 'mediumText';
  textSizeSmall = 'smallText';

  descriptionContentStorageCSS = 'descriptionContentStorage';

  getStorageSettings(): any{
    this.nightStorage = localStorage.getItem('night');
    this.weightStorage = localStorage.getItem('weight');
    this.textSizeStorage = localStorage.getItem('textSize');
    this.descriptionContentStorage = localStorage.getItem('descriptionContent');
  }

}
