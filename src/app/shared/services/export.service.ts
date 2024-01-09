import { Injectable } from '@angular/core';
import moment from 'moment';
import { jsPDF } from "jspdf";
import "../../../assets/js/customJsPDF.js";
import { graphicsSettings } from 'src/app/shared/consts/graphicsSettings';
import { FiltersStorageService } from '../../shared/consts/filtersStorage';
import { ProfileService } from 'src/app/shared/services/profile.service';
import * as ExcelJS from 'exceljs'
import { DashboardService } from 'src/app/shared/services/dashboard.service';
@Injectable({
  providedIn: 'root'
})
export class ExportService {
  graphicsSettings: any = graphicsSettings;
  apollo: any;

  listRawData = ['TOTAL_APPRENANTS', 'TOTAL_CONNECTIONS', 'TOTAL_LEARNING_TIME', 'TOTAL_CONTENTS_VALID', 'TOTAL_CONTENTS_FAILED'];

  constructor(
    private profileService: ProfileService,
    private dashboardService: DashboardService
  ) { }

    
  /**
   * Création des pages du PDF
   * @param graphList 
   * @param graphData 
   * @param graphSelected 
   * @param exportData 
   * @param companyName 
   * @param extendedData 
   * @param totalData 
   * @param pageNumber 
   * @param pdf 
   */
  makePDFPages(graphList: any, graphData: any, graphSelected: any, exportData: any, companyName: any, extendedData: boolean, totalData: any, pageNumber: any, pdf: any, additionnalData = null) {

    //Si analyse ou titre on fait la page d'analyse, sinon on passe
    if (exportData.analysis || exportData.title) {
      //@ts-ignore  
      pageNumber = pdf.makeAnalysisPage(
        pageNumber,
        companyName,
        null,
        exportData.title,
        exportData.analysis
      );
    }
    if (totalData) {
      //@ts-ignore
      pageNumber = pdf.addTotalData(pageNumber, totalData);
    }

    for (const [key, value] of Object.entries(graphSelected)) {
      if (value) {
        const chart = graphList.get(key);
        let data = graphData.get(key);

        if (this.listRawData.indexOf(key) === -1) {
          let imageJPEG = chart.getDataURL({
            type: "jpeg",
            pixelRatio: 1,
            backgroundColor: '#fff'
          });

          const width = chart.getWidth();
          const height = chart.getHeight();

          //@ts-ignore
          pageNumber = pdf.addGraph(key, pageNumber, imageJPEG, width, height, this.graphicsSettings[key].graphTitle, this.generateTableObject(key, data, extendedData), additionnalData);
        }

        if(this.listRawData.indexOf(key) !== -1){
          pageNumber = pdf.addGraph(key, pageNumber, null, 0, 0, this.graphicsSettings[key].graphTitle, this.generateTableObject(key, data, extendedData), additionnalData);
        }
        
        // Rajout de tous les emails disponibles concernant l'ouverture des comptes
        if (key === 'OPENACCOUNTS') {

          let emailList: any[] = [];
          data.forEach((value: any) => {
            value['allEmails'].forEach((email: any) => {
              emailList.push(email);
            });
          });

          pageNumber = pdf.addGraph('EMAILOPENACCOUNTS', pageNumber, null, 0, 0, this.graphicsSettings['EMAILOPENACCOUNTS'].graphTitle, this.generateTableObject('EMAILOPENACCOUNTS', emailList, extendedData), additionnalData);

        }
      }
    }
    let currentDate = moment();

    // Nom du fichier créé par l'export
    pdf.save("export_" + currentDate.format("DDMMYYYY") + "_tinycoaching");
  }

  /**
   * Gestion pour l'export PDF
   * @param graphList 
   * @param graphData 
   * @param graphSelected 
   * @param exportData 
   * @param companyName 
   * @param extendedData 
   * @param totalData 
   * @param additionnalData 
   */
  exportPDF(graphList: any, graphData: any, graphSelected: any, exportData: any, companyName: any, extendedData: boolean, totalData: any, additionnalData: any) {

    let pdf = new jsPDF({ compress: true });

    // Création de la page de garde du PDF
    //@ts-ignore
    pdf.makeFrontPage();
    let pageNumber = 0;
    let user = FiltersStorageService.userZoomObject;

    if (FiltersStorageService.isUserZoom == true && !user) {
      this.profileService.getUserById(FiltersStorageService.userZoom.id).subscribe(
        result => {
          let user = result.data.userById;
          // @ts-ignore
          pageNumber = pdf.makeFiltersPage(pageNumber, user);
          this.makePDFPages(graphList, graphData, graphSelected, exportData, companyName, extendedData, totalData, pageNumber, pdf, additionnalData);
        }
      );
    } else {
      // @ts-ignore
      pageNumber = pdf.makeFiltersPage(pageNumber, user);
      this.makePDFPages(graphList, graphData, graphSelected, exportData, companyName, extendedData, totalData, pageNumber, pdf, additionnalData);
    }
  }

  prepareWorksheet(worksheet: ExcelJS.Worksheet, data: any, dataColumns: Array<any>): ExcelJS.Worksheet {
    let COLUMN_WIDTH = 30;

    worksheet.columns = Object.keys(data[0]).map((data: string) => {
      return {
        header: data,
        key: data,
      }
    });

    let row = worksheet.getRow(1);

    // for _, index in range(row.cellCount)
    for (let i = 0; i < row.cellCount; i++) {

      let cell = row.getCell(i + 1);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: '9229FF' },
      }
      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" }
      }
    }

    for (let d of data) {
      worksheet.addRow(d);
    }

    /**
     * Loop over all columns and adjust width according to cell content 
     */
    for (let key of Object.keys(data[0])) {// loop over columns
      let column = worksheet.getColumn(key);
      let cWidth = COLUMN_WIDTH;
      column.eachCell(function (cell: any, rowNumber: any) {
        // @ts-ignore
        let width = cell.value.toString().length
        if (width > cWidth) {
          cWidth = width
        }

        let type = dataColumns.find((e: any) => e.header === key)?.type;
        if (type === Number) {
          cell.numFmt = "#,#";
        }
      })
      column.width = cWidth;
    }
    return worksheet;
  }

  exportCSV(graphData: any, graphSelected: any, extendedData: boolean, totalData: any) {

    for (let [key, value] of Object.entries(graphSelected)) {
      if (value) {
        //Récupération des valeurs et mise en forme
        let data = graphData.get(key);
        data = this.generateTableObject(key, data, extendedData);
        data.body.unshift(data.headers);
        //Création du lien pour téléchargement
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = 'data:text/csv;charset=utf-8,' + data.body.map((e: any) => e.join(",")).join("\n");
        let currentDate = moment();
        //@ts-ignore
        a.download = this.graphicsSettings[key].exportTitle + "_" + currentDate.format("DDMMYYYY") + "_tinycoaching" + ".csv";
        a.click();

        /**
         * Rajouter les emails pour le cas du graphique MAN
         */
        if (key === 'OPENACCOUNTS') {
          this.addCSVOpenAccounts(key, graphData, extendedData);
        }
      }
    }

    // Données brutes dans un fichier 
    // if (totalData) {
    //   totalData.forEach((value: any, key: any) => {
    //     let data = this.generateTableObject(key, [value], false);
    //     data.body.unshift(data.headers);
    //     var a = document.createElement("a");
    //     document.body.appendChild(a);
    //     a.style.display = "none";
    //     a.href = 'data:text/csv;charset=utf-8,' + data.body.map((e: any) => e.join(",")).join("\n");

    //     let currentDate = moment();
    //     //@ts-ignore
    //     a.download = this.graphicsSettings[key].exportTitle + "_" + currentDate.format("DDMMYYYY") + "_tinycoaching" + ".csv";
    //     a.click();
    //   });
    // }
  }
  /**
   * 
   * @param key The key in graph Settings list eg: PERFORMANCE
   * @param data the full data object
   */
  generateTableObject(key: string, data: any, extendedData: boolean) {

    let retData = {
      headers: Array(),
      body: Array()
    };

    //@ts-ignore
    const graphSettings = this.graphicsSettings[key];
    const columns = this.filterColumn(graphSettings.dataColumns);

    var isAvailable = columns.some(function(obj: any) {
      return obj.header === "Nombre total d'apprenants actifs";
    });

    key = 'TOTAL_APPRENANTS' && isAvailable ? columns.shift() : '';

    retData.headers = columns.map((c: any) => c.header);

    if (key === "CONNECTIONS") {
      let secondHeader = Array();
      columns.forEach((column: any) => {
        secondHeader.push(column.description);
      });
      retData.body.push(secondHeader);
    }

    data = key === "GENERAL_PROGRESSION" ? data.data : data; // Résolution d'un problème sur le graphique GENERAL PROGRESSION 
    if (data === undefined) {
      data = [];
    }

    data.forEach((element: any) => {
      let row = Array();
      columns.forEach((column: any) => {
        row.push(column.cell(element));
      });
      retData.body.push(row);
    });

    return retData;
  }

  /**
   * 
   * @param key The key in graph Settings list eg: PERFORMANCE
   * @param data the full data object
   * 
   * 
   * Generates array of JSONObjects for n headers 
   * eg:
   * [
   *    {
   *     Organisation : "Tiny",
   *     Date : "02/08/2022",
   *     Nombre de connexions : "13" // pendant le mois 
   *     Nombre de connexions. : "80" // période filtrée
   *    },
   *    {
   *     Organisation : "Google",
   *     Date : "04/12/2021",
   *     Nombre de connexions : "15"
   *     Nombre de connexions. : "5"
   *    },
   * ]
   */
  generateArrayOfObjects(key: string, data: any, extendedData: boolean) {
    //@ts-ignore
    const graphSettings = this.graphicsSettings[key];
    const columns = this.filterColumn(graphSettings.dataColumns);

    let array = [];

    if (key === "CONNECTIONS") {
      let o: any = {}
      columns.forEach((column: any) => {
        if (column.header in o) {
          o[column.header + "."] = column.description;
        } else {
          o[column.header] = column.description;
        }
      });
      array.push(o);
    }

    for (let d of data) {
      let o: any = {}
      for (let c of columns) {
        // if key exists (Nombre de connexions est un duplicat)
        if (c.header in o) {
          o[c.header + "."] = c.type === Number ? +c.cell(d) : c.cell(d);
        } else {
          o[c.header] = c.type === Number ? +c.cell(d) : c.cell(d); // convert to number of type == Number (adding "+" converts string to number)
        }
      }
      array.push(o);
    }


    return {
      array: array,
      columns: columns
    };
  }


  exportPNG(graphList: any, graphSelected: any) {
    for (const [key, value] of Object.entries(graphSelected)) {
      if (value) {
        const chart = graphList.get(key);
        let imagePNG = chart.getDataURL({
          type: "png",
          pixelRatio: 1,
          backgroundColor: '#fff'
        });

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = 'data:application/octet-stream;' + imagePNG;
        let currentDate = moment();

        //@ts-ignore
        a.download = this.graphicsSettings[key].exportTitle + "_" + currentDate.format("DDMMYYYY") + ".png";
        a.click();
      }
    }
  }

  filterColumn(columns: any) {
    return columns.filter(function (c: any) {

      if (c.condition) {
        return c.condition();
      }

      return true;

    });
  }


  /**
   * 
   * @param key 
   * @param graphData 
   * @param extendedData 
   */
  addCSVOpenAccounts(key: string, graphData: any, extendedData: any) {
    let data = graphData.get(key);
    key = 'EMAILOPENACCOUNTS';
    let emailList: any[] = [];

    data.forEach((value: any) => {
      value['allEmails'].forEach((email: any) => {
        emailList.push(email);
      });
    });

    //Récupération des valeurs et mise en forme;
    data = this.generateTableObject(key, emailList, extendedData);
    data.body.unshift(data.headers);
    //Création du lien pour téléchargement
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = 'data:text/csv;charset=utf-8,' + data.body.map((e: any) => e.join(",")).join("\n");
    let currentDate = moment();
    //@ts-ignore
    a.download = this.graphicsSettings[key].exportTitle + "_" + currentDate.format("DDMMYYYY") + "_tinycoaching" + ".csv";
    a.click();
  }

  updateToFrenchTitle(name: string) {

    const FRENCH_LIST = ['TOTAL CONNEXIONS', 'APPRENANTS ACTIFS', 'TOTAL CONTENUS VALIDÉS', 'TOTAL CONTENUS NON VALIDÉS', 'TOTAL TEMPS APPRENTISSAGE', 'TEMPS APPRENTISSAGE', 'PROGRESSION GÉNÉRALE', 'CONTRIBUTION À L\'AMÉLIORATION', 'FEEDBACK', 'EMAILOPENACCOUNTS', 'OUVERTURE DE COMPTES', 'CONTENUS VALIDÉS', 'PERFORMANCE', 'CONNEXIONS'];

    let graph_title_list = Object.keys(this.graphicsSettings);
    let key = graph_title_list.lastIndexOf(name);

    return FRENCH_LIST[key];

  }

}
