import {Injectable, OnInit} from '@angular/core';
import {FiltersStorageService} from "./filtersStorage";
import { RequestV2Service } from '../services/RequestV2Service';

@Injectable()
/**
 * Permet de récupérer les éléments en fonction des filtres et de l'utilisateur
 */
export class GranularitiesStorage {

	// Graphique : Progression générale
	generalProgression = false;
	// Graphique : Temps total passé dans l'apprentissage
	isValidTotalTimeSpentInLearning = false;

	// Graphique : Progression générale
	averageGeneralProgression: any;
	// Graphique : Temps total passé dans l'apprentissage
	totalTimeSpentInLearning: any;



	constructor(
		public filter: FiltersStorageService,
	) { }

	
}
