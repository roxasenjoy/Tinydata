import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable()
export class FiltersStorageService {

  static get matrix() {
    return this.getArrayInStorage("matrix");
  }

  static set matrix(matrix: number[]) {
    if (matrix.length === 0) {
      this.resetMatrix();
    }
    else {
      localStorage.setItem("matrix", JSON.stringify(matrix));
    }
  }

  static get domain() {
    return this.getArrayInStorage("domain");
  }

  static set domain(domain: number[]) {
    if (domain.length === 0) {
      this.resetDomain();
    }
    else {
      localStorage.setItem("domain", JSON.stringify(domain));
    }
  }

  static get skill() {
    return this.getArrayInStorage("skill");
  }

  static set skill(skill: number[]) {
    if (skill.length === 0) {
      this.resetSkill();
    }
    else {
      localStorage.setItem("skill", JSON.stringify(skill));
    }
  }

  static get theme() {
    return this.getArrayInStorage("theme");
  }

  static set theme(theme: number[]) {
    if (theme.length === 0) {
      this.resetTheme();
    }
    else {
      localStorage.setItem("theme", JSON.stringify(theme));
    }
  }

  static get acquisition() {
    return this.getArrayInStorage("acquisition");
  }

  static set acquisition(acquisition: number[]) {
    if (acquisition.length === 0) {
      this.resetAcquisition();
    }
    else {
      localStorage.setItem("acquisition", JSON.stringify(acquisition));
    }
  }

  static get content() {
    return this.getArrayInStorage("content");
  }

  static set content(content: number[]) {
    if (content.length === 0) {
      this.resetContent();
    }
    else {
      localStorage.setItem("content", JSON.stringify(content));
    }
  }

  static get organisations() {
    return this.getArrayInStorage("organisations");
  }

  static set organisations(organisations: number[]) {
    if (organisations.length === 0) {
      this.resetOrganisations();
    }
    else {
      localStorage.setItem("organisations", JSON.stringify(organisations));
    }
  }

  static get beginDate() {
    let date = localStorage.getItem('beginDate');
    if (!date) {
      this.resetBeginDate();
    }

    //can't be empty here, just for prevent tslint exception
    return localStorage.getItem('beginDate') || '';
  }

  static set beginDate(date: string | Date) {
    let dateType = moment(date).hours(0).minutes(0).seconds(0);
    localStorage.setItem("beginDate", dateType.format(this.dateFormat));
  }

  static get endDate() {
    let date = localStorage.getItem('endDate');
    if (!date) {
      this.resetEndDate();
    }

    //can't be empty here, just for prevent tslint exception
    return localStorage.getItem('endDate') || '';
  }

  static set endDate(date: string | Date) {
    let dateType = moment(date).hours(23).minutes(59).seconds(59);
    localStorage.setItem("endDate", dateType.format(this.dateFormat));
  }

  static get userZoom() {
    return this.getArrayInStorage("userZoom");
  }

  static set userZoom(userZoom: any) {
    localStorage.setItem("userZoom", JSON.stringify(userZoom));
  }

  static get userZoomObject() {
    return this.getArrayInStorage("userZoomObject");
  }

  static set userZoomObject(userZoomObject: any) {
    localStorage.setItem("userZoomObject", JSON.stringify(userZoomObject));
  }

  static get isUserZoom() {
    return this.getArrayInStorage("userZoom") !== null;
  }

  static set isDataDetails(isDataDetails: string) {
    localStorage.setItem("isDataDetails", isDataDetails);
  }

  static get isDataDetails() {
    const isDataDetails = localStorage.getItem('isDataDetails');
    return isDataDetails === 'dashboard' ? 'dashboard' : 'dataDetails';
  }

  static get formationZoom() {
    const formationZoom = localStorage.getItem('formationZoom');
    return formationZoom ? parseInt(formationZoom) : 0;
  }

  static set formationZoom(formationZoom: any) {
    localStorage.setItem("formationZoom", formationZoom);
  }


  static set matrixSelected(idFormation: string) {
    localStorage.setItem('matrixSelected', idFormation);
  }

  static get matrixSelected() {

    return this.getArrayInStorage("matrixSelected");
  }

  /*****/

  /**********
 * Filtres spécifiques au graphique : FEEDBACK
  *********/

  static set feedbackSelected(idFormation: number) {
    localStorage.setItem('feedbackSelected', idFormation.toString());
  }

  static get feedbackSelected() {
    return this.getArrayInStorage('feedbackSelected');
  }

  static resetFeedbackSelected() {
    localStorage.removeItem('feedbackSelected');
  }


  /* Zoom */
  static set feedbackZoom(idFormation: number) {
    localStorage.setItem('feedbackZoom', idFormation.toString());
  }

  static get feedbackZoom() {
    return this.getArrayInStorage('feedbackZoom');
  }

  static resetFeedbackZoom() {
    localStorage.removeItem('feedbackZoom');
  }

  /**********
* Filtres spécifiques au graphique : USER_CONTRIBUTIONS
*********/

  static set userContributionsSelected(idFormation: number) {
    localStorage.setItem('userContributionsSelected', idFormation.toString());
  }

  static get userContributionsSelected() {
    return this.getArrayInStorage('userContributionsSelected');
  }

  static resetUserContributionsSelected() {
    localStorage.removeItem('userContributionsSelected');
  }

  /* Zoom */
  static set userContributionsZoom(idFormation: number) {
    localStorage.setItem('userContributionsZoom', idFormation.toString());
  }

  static get userContributionsZoom() {
    return this.getArrayInStorage('userContributionsZoom');
  }

  static resetUserContributionsZoom() {
    localStorage.removeItem('userContributionsZoom');
  }

  static resetMatrixSelected() {
    localStorage.removeItem('matrixSelected');
  }

  /*****/


  /*********************
   * Reset des filtres
   ********************/

  static resetMatrix() {
    localStorage.removeItem('matrix');
  }

  static resetDomain() {
    localStorage.removeItem('domain');
  }

  static resetSkill() {
    localStorage.removeItem('skill');
  }

  static resetTheme() {
    localStorage.removeItem('theme');
  }

  static resetAcquisition() {
    localStorage.removeItem('acquisition');
  }

  static resetContent() {
    localStorage.removeItem('content');
  }

  static resetOrganisations() {
    localStorage.removeItem('organisations');
  }

  static resetBeginDate() {
    //today less 6 months at 00:00:00
    let date = moment().subtract(6, 'months');
    FiltersStorageService.beginDate = date.format(this.dateFormat);
  }

  static resetEndDate() {
    FiltersStorageService.endDate = moment().format(this.dateFormat);
  }

  static resetUserZoom() {
    localStorage.removeItem('userZoom');
    localStorage.removeItem('userZoomObject');
  }

  static resetIsDataDetails() {
    localStorage.removeItem('isDataDetails');
  }

  static resetFormationZoom() {
    localStorage.removeItem('formationZoom');
  }

  static resetFilters() {

    this.resetBeginDate();
    this.resetEndDate();

    this.resetUserZoom();
    this.resetFormationZoom();

    this.resetOldBeginDate();
    this.resetOldEndDate();
    this.resetOldOrganisations();

    // Graphique Feedback
    this.resetFeedbackSelected();
    this.resetFeedbackZoom();

    // Graphique USER_CONTRIBUTIONS
    this.resetUserContributionsSelected();

    this.resetIsDataDetails();

  }

  static resetFilterFormationsID() {
    this.resetMatrixID();
    this.resetDomainID();
    this.resetSkillID();
    this.resetThemeID();
  }

  static resetFilterFormations() {
    this.resetMatrix();
    this.resetDomain();
    this.resetSkill();
    this.resetTheme();

    this.resetAcquisition();
    this.resetContent();

  }

  static specificGraphData(graphName: string, specificData: any) {
    const getExport = localStorage.getItem('export');
    let actualData = [];

    if (getExport) {
      actualData = JSON.parse(getExport);

      const keyToCheck = graphName;
      const newValue = specificData;

      const existingItemIndex = actualData.findIndex((item: any) => item.key === keyToCheck);

      if (existingItemIndex !== -1) {
        actualData[existingItemIndex].value = newValue;
      } else {
        actualData.push({
          "key": keyToCheck,
          "value": newValue
        });
      }
    } else {
      const data = [
        {
          key: graphName,
          value: specificData
        }
      ];
      actualData = data;
    }

    localStorage.setItem('export', JSON.stringify(actualData));

  }

  static dateFormat = 'YYYY-MM-DD HH:mm:ss';
  static dateFormatShort = 'DD-MM-YYYY'

  static getArrayInStorage(type: any): any {
    let storageData = localStorage.getItem(type);
    if (storageData != null) {
      storageData = JSON.parse(storageData);
    }
    return storageData;
  }

  /**
   * Filtres pour stocker les variables temporaries graph connexion
   */
  static get oldBeginDate(): any {
    let data: any = localStorage.getItem("oldBeginDate");
    if (data != null)
      data = Date.parse(data);

    return data;
  }

  static set oldBeginDate(data: any) {
    let date = moment(data).hours(0).minutes(0).seconds(0);
    localStorage.setItem("oldBeginDate", date.format(this.dateFormat));
  }

  static get oldEndDate() {
    let data: any = localStorage.getItem("oldEndDate");
    if (data != null)
      data = Date.parse(data);

    return data;
  }

  static set oldEndDate(data: any) {
    let date = moment(data).hours(0).minutes(0).seconds(0);
    localStorage.setItem("oldEndDate", date.format(this.dateFormat));
  }

  static get oldOrganisations() {
    return this.getArrayInStorage("oldOrganisations");
  }

  static set oldOrganisations(data: any) {
    localStorage.setItem("oldOrganisations", JSON.stringify(data));
  }

  static resetOldBeginDate() {
    localStorage.removeItem('oldBeginDate');
  }
  static resetOldEndDate() {
    localStorage.removeItem('oldEndDate');
  }
  static resetOldOrganisations() {
    localStorage.removeItem('oldOrganisations');
  }


  /**
   * Filtres pour stocker les variables temporaries graph performance
   */
  static get matrixID(): any {
    let data = localStorage.getItem("matrixID");
    if (data) {
      return parseInt(data);
    }
    return null;
  }

  static set matrixID(data: any) {
    localStorage.setItem("matrixID", data);
  }

  static get domainID(): any {
    let data = localStorage.getItem("domainID");
    if (data) {
      return parseInt(data);
    }
    return null;
  }

  static set domainID(data: any) {
    localStorage.setItem("domainID", data);
  }

  static get skillID(): any {
    let data = localStorage.getItem("skillID");
    if (data) {
      return parseInt(data);
    }
    return null;
  }

  static set skillID(data: any) {
    localStorage.setItem("skillID", data);
  }

  static get themeID(): any {
    let data = localStorage.getItem("themeID");
    if (data) {
      return parseInt(data);
    }
    return null;
  }

  static set themeID(data: any) {
    localStorage.setItem("themeID", data);
  }

  static resetMatrixID() {
    localStorage.removeItem('matrixID');
  }

  static resetDomainID() {
    localStorage.removeItem('domainID');
  }

  static resetSkillID() {
    localStorage.removeItem('skillID');
  }

  static resetThemeID() {
    localStorage.removeItem('themeID');
  }

  /**
   * Organisations
   */
  static get filteredOrganisations() {
    return this.getArrayInStorage("filteredOrganisations");
  }

  static set filteredOrganisations(data: any[]) {
    localStorage.setItem("filteredOrganisations", JSON.stringify(data));
  }


  /**
   * Formations
   */
  static get filteredFormations() {
    return this.getArrayInStorage("filteredFormations");
  }

  static set filteredFormations(data: any[]) {
    localStorage.setItem("filteredFormations", JSON.stringify(data));
  }

  /******************************/

  static addFilteredOrganisation(element: any, parentElement: any) {

    if (this.filteredOrganisations !== null) {
      this.filteredOrganisations = this.filteredOrganisations
        .concat([
          {
            "element": element,
            "parentElement": parentElement
          }
        ]);
    } else {
      this.filteredOrganisations = [
        {
          "element": element,
          "parentElement": parentElement
        }
      ]
    }

  }

  static addFilteredFormation(element: any, parentElement: any) {
    if (this.filteredFormations !== null) {
      this.filteredFormations = this.filteredFormations
        .concat([
          {
            "element": element,
            "parentElement": parentElement
          }
        ]);
    } else {
      this.filteredFormations = [
        {
          "element": element,
          "parentElement": parentElement
        }
      ]
    }
  }

  static removeFilteredOrganisation(element: any) {
    this.filteredOrganisations = this.filteredOrganisations.filter(e => e.element.name !== element.name)
  }

  static removeFilteredFormation(element: any) {
    this.filteredFormations = this.filteredFormations.filter(e => e.element.title !== element.title)
  }

  static resetFilteredFormations() {
    localStorage.removeItem('filteredFormations');
  }
  static resetFilteredOrganisations() {
    localStorage.removeItem('filteredOrganisations');
  }

  /**
 * Est ce que le filtre de date se base sur une seule journée ?
 * Si oui, return true
 * Si non, return false
 * @returns 
 */
  static get isFilterDateOnOneDay(): boolean {
    //Récupération des valeurs et mise en forme
    var now = moment(FiltersStorageService.beginDate); //todays date
    var end = moment(FiltersStorageService.endDate); // another date
    var duration = moment.duration(end.diff(now));

    var years = duration.asYears();
    var months = duration.asMonths();
    var days = duration.asDays();

    if (years >= 0 && months >= 0 && days >= 1) {
      return false;
    }

    return true;

  }

  static get precision(): string {
    let beginDate = moment(FiltersStorageService.beginDate);
    let endDate = moment(FiltersStorageService.endDate);
    let diffTim = endDate.diff(beginDate, 'days');

    if (diffTim < 93) {
      return "DAY";
    } else {
      return "MONTH";
    }
  }

}
