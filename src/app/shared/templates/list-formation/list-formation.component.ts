
/**
 * Objectif : 
 * 
 * Créer un composant qui permet de sélectionner sa formation SEULEMENT sur le graphique que l'utilisateur souhaite modifier
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FiltersStorageService } from '../../consts/filtersStorage';
import { DashboardService } from '../../services/dashboard.service';
import { EventEmitterService } from '../../services/event-emitter.service';
import { hasData } from 'jquery';

@Component({
	selector: 'list-formation',
	templateUrl: './list-formation.component.html',
	styleUrls: ['./list-formation.component.css']
})
export class ListFormationComponent implements OnInit {

	userId: any;

	formationsList: any; //
	formationSelected: number;
	hasTrueData: boolean;

	searchText: string;

	@Input() nameFormationFilter = ''; // Récupére la variable de [nameFormationFilter] du parent
	@Output() idFormationFilter = new EventEmitter<number>();
	@Output() isActive = new EventEmitter<boolean>();

	constructor(
		private dashboardService: DashboardService,
		public eventEmitterService: EventEmitterService,
	) { }

	ngOnInit(): any {
		this.getFormationsList();

		this.eventEmitterService.refreshGraphics.subscribe(() => {
			event?.stopPropagation();
			this.getFormationsList();
		});

		this.eventEmitterService.setZoomUserFilter.subscribe(() => {
			event?.stopPropagation();
			this.getFormationsList();
		});

		this.eventEmitterService.filterReseted.subscribe(() => {
			event?.stopPropagation();
			this.getFormationsList();
		});
	}

	/* Envoyer les données vers le composant parent */
	updateFormationFilter(id: string, hasData: boolean) {
		console.log(id, hasData);
		if (hasData) {
			this.formationSelected = parseInt(id);
			this.setFilterSelected(this.formationSelected);
			this.idFormationFilter.emit(this.formationSelected);
		}

	}

	/* Récupérer la liste de toutes les formations en fonction du rôle de l'utilisateur */
	getFormationsList() {

		this.userId = FiltersStorageService.userZoom ? FiltersStorageService.userZoom['id'] : null;

		let nameFilter = this.nameFormationFilter.replace('FormationSelected', '');

		this.isActive.emit(false);

		this.dashboardService.getFilterFormationWithData(
			FiltersStorageService.organisations,
			FiltersStorageService.matrix,
			this.userId,
			nameFilter,
			FiltersStorageService.beginDate,
			FiltersStorageService.endDate


		).subscribe(
			result => {
				this.formationsList = result.data.filterFormationWithData;

				this.hasTrueData = this.formationsList.some((e: any) => e.hasData === true && parseInt(this.getFilterSelected()) === e.matrixID);

				// La liste des formations n'est pas vide
				if (this.formationsList.length !== 0) {

					// Est ce que le filtre du graphique sur lequel on est possède un filtre déjà en place ?
					if (this.getFilterSelected() !== null) {
						let id = this.getFilterSelected();
						this.formationSelected = parseInt(id);

						// Est ce que la première formation de la liste que nous avons récupéré et la même que le filtre que nous avons ? 
						if (this.hasTrueData === false) {
							this.formationSelected = this.formationsList[0]['matrixID'];
							this.hasTrueData = true; // Modification pour le design violet
						} 
						
						this.setFilterSelected(this.formationSelected);

					// On met en place le filtre dans le localStorage
					} else {
						this.formationSelected = parseInt(this.formationsList[0]['matrixID']);
						this.setFilterSelected(this.formationSelected);
					}

					this.idFormationFilter.emit(this.formationSelected);
					

				// La liste des formations est vide
				} else {
					this.idFormationFilter.emit(0);
					this.formationSelected = 0;
					this.setFilterSelected(0);
				}
			}
		);
	}

	getFilterSelected(): any {
		return localStorage.getItem(this.nameFormationFilter);
	}

	setFilterSelected(idFormation: any) {
		localStorage.setItem(this.nameFormationFilter, idFormation);
	}

	deleteFilterSelected() {
		localStorage.removeItem(this.nameFormationFilter);
	}

}
