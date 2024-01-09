import { Injectable, EventEmitter } from '@angular/core';
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  resetGraphicsDashboardComponent() {
    throw new Error('Method not implemented.');
  }

  refreshGraphics = new EventEmitter() ;
  filterReseted = new EventEmitter();
  refreshZoomFilters = new EventEmitter();
  setZoomUserFilter = new EventEmitter();
  changeFormationFilter = new EventEmitter();
  changeOrganisationFilter = new EventEmitter();
  detailledDataWithUser = new EventEmitter();
  getExtendedGraphData = new EventEmitter();
  newGraphLoading = new EventEmitter();

  constructor() { }

  callRefreshGraphics(isPerfectData: boolean = false): any {
    this.refreshGraphics.emit(isPerfectData);
  }

  callFilterReseted(): any {
    this.filterReseted.emit();
  }

  callRefreshZoomFilters(): any {
    this.refreshZoomFilters.emit();
  }

  callExtendedGraphData(graphToCall: any): any {
    this.getExtendedGraphData.emit(graphToCall);
  }

  callNewGraphLoading(): any {
    this.newGraphLoading.emit();
  }

  callChangeOrganisationFilter(): any{
    this.changeOrganisationFilter.emit();
  }

  callSetZoomUserFilter(): any{
    this.setZoomUserFilter.emit();
  }

  callChangeFormationFilter(): any{
    this.changeFormationFilter.emit();
  }

}