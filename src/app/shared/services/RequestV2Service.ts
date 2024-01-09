import {Apollo} from 'apollo-angular';

import {FiltersStorageService} from '../consts/filtersStorage';
import { GET_DATA, GET_RAW_DATA } from 'src/app/graphql';
import { Injectable } from '@angular/core';
import { filterType } from '../models/type';

interface FiltersType {
	matrixFilter: filterType;
	domainFilter: filterType;
	skillFilter: filterType;
	themeFilter: filterType;
	acquisFilter: filterType;
	contentFilter: filterType;
	organisationsFilter: filterType;
	beginDate: string | Date;
	endDate: string | Date;
	idUser: number | null;
  }
/**
* Objectif de ce fichier :
*  - Créer une seule requête pour récupérer les informations indisponibles directement via le back end
*    afin que le graphique soit exportable via le back mais qu'il soit également afficher sur Tinydata.
*/
@Injectable({
	providedIn: 'root'
})
export class RequestV2Service {

  	constructor(
		private apollo: Apollo
    ) {}
	/**
	 * Récupére tous les filtres impossible à récupérer en back-end
	 */
    setFilterType(): FiltersType{
      return {
        'matrixFilter'        : FiltersStorageService.matrix,
        'domainFilter'        : FiltersStorageService.domain,
        'skillFilter'         : FiltersStorageService.skill,
        'themeFilter'         : FiltersStorageService.theme,
        'acquisFilter'        : FiltersStorageService.acquisition,
        'contentFilter'       : FiltersStorageService.content,

        'organisationsFilter' : FiltersStorageService.organisations,

        'beginDate'           : FiltersStorageService.beginDate,
        'endDate'             : FiltersStorageService.endDate,

        'idUser'              : FiltersStorageService.userZoom ? FiltersStorageService.userZoom.id : null
      }
    }


	/**
	 * Obtenir les données des graphiques
	 * @param graphName -> Nom du graphique qu'on souhaite récupérer
	 * @param specificGraphData -> Données spécifiques du graphique  
	 */
    getData(graphName: string, specificGraphData: any){

		const filterType = this.setFilterType();

		return this.apollo.query({
			query: GET_DATA,
			variables: {
				filterType,
				graphName,
				specificGraphData
			}
		});
    }

	
	/**
	*	Obtenir les données brutes 
	*/
    getRawData(graphName: String, specificGraphData: any){
		const filterType = this.setFilterType();

		return this.apollo.query({
			query: GET_RAW_DATA,
			variables: {
				filterType,
				graphName,
				specificGraphData
			}
		});
    }
}
