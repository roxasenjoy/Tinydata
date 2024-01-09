/**
 * Ce fichier contient tous les TYPES et INTERFACE du projet.
 * 
 * Comment récupérer les différents éléments ? 
 *   - Rajouter : import { NOM, NOM, NOM, NOM } from 'src/app/shared/models/type';
 **/

export interface UserZoomType {
    id: Number,
    objectId: Number,
    title: String,
    type: String
}

export type ColumnsType = {
    [columns: string]: any
  };

export type UserType = {

    id: Number,
    firstName: String,
    lastName: String,
    fullName: String,
    gender: String,
    phone: String,
    profile: {
        jobTitle: String
    },
    companyName: String,
    company : {
        id: Number,
        name: String
    },
    email: String,
    session: string[],
    score: Number,
    cgu: Boolean,
    lowsAcquisitions: string[],
    fortsAcquisitions: string[],
    picture: String,
    inscriptionDate: Date,
    image : {
        url: String
    }
    hasCompanyAnalytics: boolean,
    hasTinyAnalytics: boolean,
    allowNotification: boolean,
    roles: string[]

}

export interface zoomInterface {
    min: number,
    max: number
};

export type filterType = number[] | undefined | Date | string | null;

/* Graphique : FEEDBACK */
export type feedbackReturnType = {
    idGranularityFeedback              : number,
    name            : string
}

export type LabelsType = 'Bien' | 'Difficile' | 'Facile' | 'Long' |'Neutre';

export interface DataType {
    data: {
        connections: any
    };
}
export type ResultFeedbackType = {
    data: { 
        feedback: { 
            idMatrix: number,
            data: (string | number)[]; 
            feedbackDetailed: (string | number)[]; 
        }; 
    }; 
}

export type ResultUserContributionsType = {
    data: { 
        userContributions: { 
            idMatrix: number,
            data: (string | number)[]; 
            feedbackDetailed: (string | number)[]; 
        }; 
    }; 
}

export interface formationListInterface {
    id: number
    name: string;
    hasData: boolean;
  }


export class TypeService {}
