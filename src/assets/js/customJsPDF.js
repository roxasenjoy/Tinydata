import moment from "moment";
import jsPDF from "jspdf";
import "./Montserrat-Regular-normal";
import { graphicsSettings } from 'src/app/shared/consts/graphicsSettings';
import {FiltersStorageService} from 'src/app/shared/consts/filtersStorage';
import autoTable from 'jspdf-autotable';
import {ProfileService} from "src/app/shared/services/profile.service.ts"


/**
 * Création de la page de garde du PDF
 */
jsPDF.API.makeFrontPage = function(){
    let currentDate = moment();
    this.addImage("../../../assets/images/export/background.png", 'PNG', 0, 0, 210, 297);
    this.addImage("../../../assets/images/export/logo.png", 'PNG', 55, 50, 100, 25);
    this.setFontSize(40);
    this.setTextColor("ffffff");
    this.setFont('Montserrat-Regular', 'normal');
    this.text(["EXPORT DES GRAPHIQUES","PEDAGOGIQUES"], 105, 160, {
        align:"center"
    });
    this.setFontSize(15);
    this.text(currentDate.format("DD/MM/YYYY"), 105, 280, {
        align:"center",
    });
};


/**
 * Création de la section pour ajouter les trois données brutes ce trouvant en haut
 * @param {} pageNumber 
 * @param {*} totalData 
 * @returns 
 */
jsPDF.API.addTotalData = function(pageNumber,totalData){
    pageNumber++;
    let pageHeight = this.internal.pageSize.getHeight();
    let x = 105;
    let y = pageHeight/7;
    this.addPage();
    totalData.forEach((value, key) => {
        this.setTextColor("171717");
        this.setFont('Montserrat-Regular', 'normal');
        this.setFontSize(20);
        this.text(graphicsSettings[key].graphTitle, x, y, {
            align:"center",
        });
        this.setFontSize(30);
        this.setTextColor("9229ff");
        this.setFont('Helvetica',"bold");
        if(typeof value === 'object'){
            this.text(`${value.value} / ${value.total}`, x, y+15, {
                align:"center",
            });
        }
        else if(['number', 'string'].includes(typeof value)){
            this.text(value.toString(), x, y+15, {
                align:"center",
            });
        }
        else{
            this.text("Who are you?", x, y+15, {
                align:"center",
            });
        }
        y += 45;
    });
    
    
    this.makeGraphPage(pageNumber, false, false);
    this.addPageNumber(pageNumber);
    return pageNumber;
};

/**
 * Création de la section pour les filtres sur la PDF
 * @param {*} pageNumber 
 * @param {*} user 
 * @returns 
 */
jsPDF.API.makeFiltersPage = function(pageNumber,user) {
    this.addPage();
    pageNumber++;
    // pageTitle
    this.setTextColor("a6a6a6");
    this.setFontSize(15);
    this.setFont('Montserrat-Regular', 'normal');
    this.text("Filtres", 15, 30);

    this.setTextColor("9229ff");
    this.setFontSize(15);
    this.setFont('Montserrat-Regular', 'normal');

    let beginDate = moment(FiltersStorageService.beginDate).format(FiltersStorageService.dateFormatShort)
    let endDate = moment(FiltersStorageService.endDate).format(FiltersStorageService.dateFormatShort)

    // Formattage des données pour jspdf-autotable (chaque donnée doit être un tableau 2D)
    let formations = FiltersStorageService.filteredFormations ? 
        FiltersStorageService.filteredFormations.map(e=>e.element.title === e.parentElement.title ? [e.element.title] : [e.parentElement.title + ' > ' + e.element.title])
    : 
        []

    let organisations = FiltersStorageService.filteredOrganisations ?
        FiltersStorageService.filteredOrganisations.map(e=>e.element.name === e.parentElement.name ? [e.element.name] : [e.parentElement.name + ' > ' + e.element.name])
    :
        []
    

    let userFullNameData = user ? [[user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + ' ' + user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)]] : [];
        

    const filters = {
        "user" :
        {
            title:  "Utilisateur",
            data:  userFullNameData
        },
        "beginDate" : {
            title: "Date de début",
            data: beginDate
        },
        "endDate" : {
            title: "Date de fin",
            data: endDate
        },
        "organisations" : {
            title: "Groupes",
            data: organisations
        },
        "formations" : {
            title: "Formations",
            data: formations
        },
    }

    let pageHeight = this.internal.pageSize.getHeight();
    let y = pageHeight/4;

    const NO_FILTER_MESSAGE = 'Aucun filtre';
    
    ["user","organisations","formations"].forEach(key => {
            this.autoTable({
                startY:y+5,
                head: [[filters[key].title]],
                headStyles:{
                    fillColor:"#9229ff",
                    fontSize: 15
                },
                styles:{
                    font:"Montserrat-Regular",
                    fontSize: 11
                },
                body: filters[key].data.length > 0 ? filters[key].data : [[NO_FILTER_MESSAGE]],
                didDrawPage: (d) =>y = d.cursor.y,
            })
    });
    this.autoTable({
        startY:y+5,
        head: [[filters["beginDate"].title,filters["endDate"].title]],
        headStyles:{
            fillColor:"#9229ff",
            fontSize: 15
        },
        styles:{
            font:"Montserrat-Regular",
            fontSize: 11
        },
        body: [[filters["beginDate"].data,filters["endDate"].data]]
    });
    
    this.addPageNumber(pageNumber);
    return pageNumber;
}


/**
 * Titre de l'export + Description ajouté par l'utilisateur qui fait l'export 
 * @param {*} pageNumber 
 * @param {*} companyName 
 * @param {*} companySubName 
 * @param {*} exportTitle 
 * @param {*} exportAnalysis 
 * @returns 
 */
jsPDF.API.makeAnalysisPage = function(pageNumber,companyName, companySubName, exportTitle, exportAnalysis){
    pageNumber++;
    this.addPage();
    // Logo Tinydata
    let width = this.internal.pageSize.getWidth();
    let height = this.internal.pageSize.getHeight();
    this.addImage("../../../assets/images/export/logotype.png", 'PNG', width/4, 15, width/2, 16);
    //Nom sous-orga
    if(companySubName){
        this.setFontSize(12);//15
        this.text(companySubName, 105, 40, {
            align:"center",
        });
    }
    //Titre
    this.setTextColor("000000");
    this.setFontSize(15);
    this.text("TITRE : " + exportTitle, 15, 60, {
        maxWidth:180,
        //align:"justify"
    });

    // Analyse de la personne que a fait l'export
    this.text("ANALYSE :", 15, 75);
    this.setFillColor(217, 217, 217);
    this.roundedRect(10, 80, 190, 190, 1, 1, 'F');
    this.setFontSize(12);
    this.text(exportAnalysis, 15, 88, {
        maxWidth:180,
        //align:"justify"
    })
    this.makeGraphPage(pageNumber, false, false);
    return pageNumber;
}

/**
 * La page et ajoute le footer pour une nouvelle page
 * @param {*} pageNumber 
 * @param {*} showDivider 
 * @param {*} newPage 
 */
jsPDF.API.makeGraphPage = function(pageNumber, showDivider = false, newPage = true){
    if(newPage){
        this.addPage();
    }
    this.addPageNumber(pageNumber);
    this.addImage("../../../assets/images/export/footer.png", 'PNG', 0, 279, 210, 18);
    this.addImage("../../../assets/images/export/tiny_mood.png", 'PNG', 190, 278, 20, 20);
    if(showDivider){
        this.addGraphDivider();
    }
}

/**
 * Ajouter les graphiques + les tableaux associés sur le PDF
 * @param {*} pageNumber 
 * @param {*} imageJPEG 
 * @param {*} width 
 * @param {*} height 
 * @param {*} graphTitle 
 * @param {*} graphData 
 * @returns 
 */
jsPDF.API.addGraph = function(graphType, pageNumber, imageJPEG, width, height, graphTitle, graphData, additionnalData){

    // Enlever la longueur des entreprises pour que ca puisse rentrer dans l'export PDF
    graphData = cropTooLongString(graphData, graphType);

    this.addPage();
    let startY = 45;
    if(imageJPEG){
        startY = 150;
        if(width > 600){
            const oldWidth = width;
            width = 600;
            height = (width/oldWidth) * height
        }
        if(height > 400){
            const oldHeight = height;
            height = 400;
            width = (height/oldHeight) * width
        }
        //210 -> la largeur A4
        //width*0.25 -> la largeur du graph
        //la différence divisée par 2 (pour qu'il y ait autant à gauche qu'a droite)
        const marginLeft = (210-(width*0.3))/2;
        this.addImage(imageJPEG, 'JPEG', marginLeft, 45, width*0.3, height*0.3, null, "NONE");
    }
    this.setTextColor("a6a6a6");
    this.setFontSize(15);
    this.setFont('Montserrat-Regular', 'normal');

    // Ajout du titre du graphique
    this.text(graphTitle, 15, 30);

    // Graphique - CONTENUS VALIDES
    // Ajoute un tableau en dessous du graphique pour préciser
    if(graphType === 'CONTENTS_VALID'){
        this.addAdditionnalData(additionnalData);
    }

    let fontSize = 6;
    let count = 0;
    let indexCount = 0;
    let grey = [];
    let white = [];

    if(graphType === "USER_CONTRIBUTIONS"){
        fontSize =5;

        // Supprimer la dernière colonne du header
        // Recréer une ligne après chaque élément pour y mettre le commentaire
        // Créer une boucle qui tape sur tous les éléments afin de rajouter une array entre chaque.
        const data = graphData.body;
        let newGraphData = [];
        
        graphData['headers'].shift(); // Suppression du dernier élément
        graphData.headers.shift();
        graphData.headers.shift();
        graphData.headers.shift();

        let secondHeader = ['Prénom', 'Nom', 'Adresse email', 'Commentaire'];

        newGraphData.push(secondHeader);

        data.forEach(element => {
            const feedback = element.shift(); // Le dernier élément de la liste -> Feedback utilisateur

            // Afficher les éléments dans un format différent afin d'afficher les commentaires sur une seule ligne. Le problème vient du header qui bloque la width du commentaire.
            newGraphData.push(
                [
                {'content': element[3]},
                {'content': element[4]},
                {'content': element[5]},
                {'content': element[6]},
                {'content': element[7]},
                {'content': element[8]},
                {'content': element[9]},
                {'content': element[10]},
                {'content': element[11]},
                {'content': element[12]},
                {'content': element[13]},
                '',
                ''
            ]
                
            ); // On rajoute l'élément
            newGraphData.push(
                [
                    {'content': element[0], 'colSpan': 1},
                    {'content': element[1], 'colSpan': 1},
                    {'content': element[2], 'colSpan': 1},
                    // {'content': 'Commentaire : ', 'colSpan': 1, styles: { fontStyle: 'bold' }},
                    {'content': feedback, 'colSpan': 9}
                ]); // On rajoute le feedback
            newGraphData.push([]);
            graphData.body = newGraphData;

            // Mettre des couleurs 2 éléments par 2 éléments
            switch(count){
                case 0:
                    if(indexCount !== 0){
                        indexCount += 2;
                    } else {
                        indexCount++;
                    }
                    white.push(indexCount);
                    indexCount++;
                    white.push(indexCount);
                    indexCount+= 2;
                    count++;
                    break;
                case 1:
                    grey.push(indexCount);
                    indexCount++;
                    grey.push(indexCount);
                    count = 0;
                    break;
            }
        });
    }

    this.autoTable({
        startY:startY,
        head: graphTitle.includes('USER_CONTRIBUTIONS') ? '' : [graphData.headers],
        theme: graphTitle.includes('USER_CONTRIBUTIONS') ? 'plain' : 'striped',
        headStyles:{
            fillColor:"#9229ff",
            fontSize: 6,
            textColor: 'white'
        },

        // Changement du design avant qu'il s'affiche
        // Border-bottom des commentaires en version douille car le paramètre n'existe pas.
        willDrawCell: function(data){
            if(data.row.raw.length === 0 && graphTitle.toLowerCase().includes('feedback')){
                data.row.height = 0.2; 
                data.cell.height = 0.2;
                data.cell.styles.fillColor = "#9229ff";
            }
        },

        // Une fois que le design est présent, qu'est ce qu'on fait ?
        didParseCell: function (data) {

            let index = data.row.index;

            // if (index === 0 && data.row.section !== "head" && (graphTitle.toLowerCase().includes("connexion"))) {
            //     data.cell.styles.textColor = "#00BBCE";
            //     data.cell.styles.fontStyle = 'italic';
            // }
            if(index === 0 && (graphType === 'USER_CONTRIBUTIONS')){
                data.cell.styles.fillColor = "#9229ff";
                data.cell.styles.textColor = '#FFF';
            }


            if(grey.indexOf(index) !== -1){
                data.cell.styles.fillColor = '#f5f5f5';
            }

            if(white.indexOf(index) !== -1){
                data.cell.styles.fillColor = 'white';
            }
        
        },
        
        margin:{
            bottom:25
        },

        styles:{
            font:"Montserrat-Regular",
            fontSize: fontSize
        },
        didDrawPage:()=>{
            pageNumber++;
            this.makeGraphPage(pageNumber, false, false);
        },
        body: graphData.body
      });  

      return pageNumber;
}




jsPDF.API.addAdditionnalData = function(additionnalData){

    const validated = additionnalData.contentValidated + ' / ' + additionnalData.contentTotal;
    const failed = additionnalData.contentFailed + ' / ' + additionnalData.contentTotal;
    const neverDone = additionnalData.contentNeverDone + ' / ' + additionnalData.contentTotal;

    var headerTitle = ['Validés','Non validés', 'Non effectués'];
    var bodyData = [validated, failed, neverDone];

    this.autoTable({
        margin: { top:130, bottom: 50, left: 14.1, right: 14.1 },
        head: [headerTitle],
        headStyles:{
            fillColor:"#9229ff",
            fontSize:10
        },
        styles:{
            font:"Montserrat-Regular",
            fontSize:10
        },
        body: [bodyData],
    });
}

/**
 * Séparation entre les pages du PDF
 * @param {*} pageNumber 
 */
jsPDF.API.addGraphDivider = function(pageNumber){
    this.addImage("../../../assets/images/export/divider.png", 'PNG', 52.5, 140, 105, 17.5);
}

/**
 * Ajouter le numéro de la page sur les PDF
 * @param {*} pageNumber 
 */
jsPDF.API.addPageNumber = function(pageNumber){
    this.setTextColor("000000");
    this.setFontSize(12);
    this.setFont('Montserrat-Regular', 'normal');
    this.text(pageNumber+"", 200, this.internal.pageSize.getHeight()-25);
}

/*
Dans le PDF, crop les éléments trop long pour que ca rentre dans le tableau PDF
*/
function cropTooLongString(graphData, graphType){
    // Récupérer toutes les dates présentes 
    graphData.body.forEach((element) =>{

        switch(graphType){

            case "PERFORMANCE":
                if(element[2].length > 13){
                    element[2] = element[2].substring(0, 13) + "...";
                }
                break;

            case "CONNECTIONS":
                if(element[0].length > 13){
                    element[0] = element[0].substring(0, 13) + "...";
                }
                break;

            case "EMAILOPENACCOUNTS":
                if(element[1].length > 16){
                    element[1] = element[1].substring(0, 16) + "...";
                }
                break;
        }
        
        
    });

    return graphData;
}