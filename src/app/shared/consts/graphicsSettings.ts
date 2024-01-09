import { TmplAstRecursiveVisitor } from "@angular/compiler";
import moment from "moment";
import { FiltersStorageService } from "./filtersStorage";

const depth: any = {
    matrix: "Formation",
    domain: "Domaine",
    skill: "Compétence",
    theme: "Thème",
}
export const graphicsSettings = {
    "TOTAL_CONNECTIONS": {
        graphTitle: "Nombre total de connexions",
        exportTitle: "total_connexions",
        dataColumns: [
            {
                columnDef: 'date',
                header: 'Date',
                cell: (element: any) => `${element.date}`,
                type: String
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String
            },
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String
            },
            {
                columnDef: 'email',
                header: 'Adresse email',
                cell: (element: any) => `${element.email}`,
                type: String
            },
            {
                columnDef: 'name',
                header: 'Groupe',
                cell: (element: any) => `${element.name}`,
                type: String
            },
          
            {
                columnDef: 'totalConnexion',
                header: 'Nombre de connexions',
                cell: (element: any) => `${element.totalConnexion}`,
                type: String
            },
        ],
    },

    "TOTAL_APPRENANTS": {
        graphTitle: "Nombre total d'apprenants actifs",
        exportTitle: "total_apprenants",
        dataColumns: [
            {
                columnDef: 'groupePrincipal',
                header: 'Groupe principal',
                cell: (element: any) => `${element.groupePrincipal}`,
                type: String
            },
            {
                columnDef: 'groupe',
                header: 'Groupe',
                cell: (element: any) => `${element.groupe}`,
                type: String
            },
            {
                columnDef: 'email',
                header: 'Adresse email',
                cell: (element: any) => `${element.email}`,
                type: String
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String
            },
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String
            },
            {
                columnDef: 'email',
                header: 'Adresse email',
                cell: (element: any) => `${element.email}`,
                type: String
            },
            {
                columnDef: 'lastConnection',
                header: 'État',
                cell: (element: any) => `${element.lastConnection}`,
                type: Boolean
            },
        ],
    },

    "TOTAL_CONTENTS_VALID": {
        graphTitle: "Nombre total de contenus validés",
        exportTitle: "total_contenus_valides",
        dataColumns: [
            {
                columnDef: 'companyName',
                header: 'Groupe principal',
                cell: (element: any) => `${element.companyName}`,
                type: String,
            },
            {
                columnDef: 'parent1Name',
                header: 'Groupe',
                cell: (element: any) => `${element.parent1Name}`,
                type: String,
            },
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String,
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String,
            },
            {
                columnDef: 'email',
                header: 'Adresse email',
                cell: (element: any) => `${element.email}`,
                type: String,
            },
            {
                columnDef: 'matrixName',
                header: 'Formation',
                cell: (element: any) => `${element.matrixName}`,
                type: String,
            },
            {
                columnDef: 'contentCount',
                header: 'Nombre total de contenus validés',
                cell: (element: any) => `${element.contentCount}`,
                type: String,
            },
        ],
    },
    "TOTAL_CONTENTS_FAILED": {
        graphTitle: "Nombre total de contenus échoués",
        exportTitle: "total_contenus_invalide",
        dataColumns: [
            {
                columnDef: 'companyName',
                header: 'Groupe principal',
                cell: (element: any) => `${element.companyName}`,
                type: String,
            },
            {
                columnDef: 'parent1Name',
                header: 'Groupe',
                cell: (element: any) => `${element.parent1Name}`,
                type: String,
            },
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String,
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String,
            },
            {
                columnDef: 'email',
                header: 'Adresse email',
                cell: (element: any) => `${element.email}`,
                type: String,
            },
            {
                columnDef: 'matrixName',
                header: 'Formation',
                cell: (element: any) => `${element.matrixName}`,
                type: String,
            },
            {
                columnDef: 'contentCount',
                header: 'Nombre total de contenus validés',
                cell: (element: any) => `${element.contentCount}`,
                type: String,
            },
        ],
    },
    "TOTAL_LEARNING_TIME": {
        graphTitle: "Temps total passé dans l'apprentissage",
        exportTitle: "total_apprentissage",
        dataColumns: [
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String
            },
            {
                columnDef: "email",
                header: "Adresse email",
                cell: (element: any) => `${element.email}`,
                type: String
            },
            {
                columnDef: 'groupePrincipal',
                header: 'Groupe principal',
                cell: (element: any) => `${element.groupePrincipal}`,
                type: String
            },
            {
                columnDef: 'groupe',
                header: 'Groupe',
                cell: (element: any) => `${element.groupe}`,
                type: String
            },
            {
                columnDef: 'time',
                header: "Temps total passé dans l'apprentissage",
                cell: (element: any) => `${element.time}`,
                type: String
            }
        ],
    },

    "ANALYTICS_TIME": {
        exportTitle: "learning_time_per_user",
        graphTitle: "Temps passé dans l'apprentissage",
        zoomTitle: "Temps passé dans l'apprentissage",
        dataColumns: [
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String
            },
            {
                columnDef: "email",
                header: "Adresse email",
                cell: (element: any) => `${element.email}`,
                type: String
            },
            {
                columnDef: "time",
                header: "Temps",
                cell: (element: any) => `${element.time}`,
                type: String
            },
            {
                columnDef: "lastInteraction",
                header: "Dernière intéraction",
                cell: (element: any) => `${element.lastInteraction}`,
                type: String,
                condition: function () { return FiltersStorageService.isFilterDateOnOneDay }
            }

        ],
    },

    "GENERAL_PROGRESSION": {
        exportTitle: "progression_generale",
        graphTitle: "Graphique PROGRESSION GÉNÉRALE",
        zoomTitle: "Progression générale de l'utilisateur",
        dataColumns: [
            // {
            //     columnDef: 'meanValue',
            //     header: '% de votre progression générale',
            //     cell: (element: any) => `${element.meanValue} % de contenus validés`,
            //     type: String
            // },
            {
                columnDef: 'name',
                header: 'Formation',
                cell: (element: any) => `${element.name}`,
                type: String
            },
            {
                columnDef: 'value',
                header: '% Acquis validés',
                cell: (element: any) => `${element.value} %`,
                type: String
            }
        ]
    },

    "USER_CONTRIBUTIONS": {
        exportTitle: "contributions_apprenants",
        graphTitle: 'Graphique CONTRIBUTION À L’AMÉLIORATION',
        zoomTitle: "CONTRIBUTION À L’AMÉLIORATION",
        dataColumns: [
            {
                columnDef: 'message',
                header: 'Contribution',
                cell: (element: any) => `${element.message}`,
                type: String,
            },
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String,
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String,
            },
            {
                columnDef: 'email',
                header: 'Adresse email',
                cell: (element: any) => `${element.email}`,
                type: String,
            },
            {
                columnDef: 'groupePrincipal',
                header: 'Groupe Principal',
                cell: (element: any) => `${element.groupePrincipal}`,
                type: String,
            },
            {
                columnDef: 'groupe',
                header: 'Groupe',
                cell: (element: any) => `${element.groupe}`,
                type: String,
            },
            {
                columnDef: 'nameMatrix',
                header: 'Formation',
                cell: (element: any) => `${element.nameMatrix}`,
                type: String,
            },
            {
                columnDef: 'nameDomain',
                header: 'Domaine',
                cell: (element: any) => `${element.nameDomain}`,
                type: String,
            },
            {
                columnDef: 'nameSkill',
                header: 'Compétence',
                cell: (element: any) => `${element.nameSkill}`,
                type: String,
            },
            {
                columnDef: 'nameTheme',
                header: 'Thème',
                cell: (element: any) => `${element.nameTheme}`,
                type: String,
            },
            {
                columnDef: 'nameAcquis',
                header: 'Acquis',
                cell: (element: any) => `${element.nameAcquis}`,
                type: String,
            },
            {
                columnDef: 'nameContent',
                header: 'Contenu',
                cell: (element: any) => `${element.nameContent}`,
                type: String,
            },

        ]
    },

    "FEEDBACK": {
        exportTitle: "feedback",
        graphTitle: 'Graphique FEEDBACKS',
        zoomTitle: "Feedbacks",
        dataColumns: [
            {
                columnDef: 'depth',
                header: 'Type de granularité',
                cell: (element: any) => `${element.depth}`,
                type: String,
            },
            {
                columnDef: 'name',
                header: 'Titre de la granularité',
                cell: (element: any) => `${element.name}`,
                type: String,
            },
            {
                columnDef: 'feedbackName',
                header: 'Feedback',
                cell: (element: any) => `${element.feedbackName}`,
                type: String,
            },
            {
                columnDef: 'percentage',
                header: 'Pourcentage',
                cell: (element: any) => `${element.percentage}` + ' %',
                type: String,
            }

        ]
    },

    "RAPPELS_MEMO": {
        exportTitle: "rappels mémoriels",
        graphTitle: 'Graphique RAPPELS MÉMORIELS',
        zoomTitle: "Rappels Mémoriels",
        dataColumns: [
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String
            },
            {
                columnDef: 'Nom',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String
            },
            {
                columnDef: 'email',
                header: 'Adresse email',
                cell: (element: any) => `${element.email}`,
                type: String
            },
            {
                columnDef: 'groupePrincipal',
                header: 'Groupe principal',
                cell: (element: any) => `${element.groupePrincipal}`,
                type: String
            },
            {
                columnDef: 'groupe',
                header: 'Groupe',
                cell: (element: any) => `${element.groupe}`,
                type: String
            },
            {
                columnDef: 'matrixName',
                header: 'Formation',
                cell: (element: any) => `${element.matrixName}`,
                type: String
            },
            {
                columnDef: 'acquisName',
                header: 'Acquis essentiel',
                cell: (element: any) => `${element.acquisName}`,
                type: String
            },
            {
                columnDef: 'current_box',
                header: 'Boîte de Leitner actuelle',
                cell: (element: any) => `${element.current_box}`,
                type: String
            },
            {
                columnDef: 'memory_retention_rate',
                header: 'Taux de mémorisation',
                cell: (element: any) => `${element.memory_retention_rate}`,
                type: String
            },
            {
                columnDef: 'percentage_failed',
                header: "Taux d'échec",
                cell: (element: any) => `${element.percentage_failed}`,
                type: String
            },
        ]
    },

    "EMAILOPENACCOUNTS": {
        exportTitle: 'emails_ouverture_de_comptes',
        graphTitle: 'Graphique : Ouverture de comptes',
        zoomTitle: 'Ouverture de comptes',
        dataColumns: [
            {
                columnDef: 'roles',
                header: 'Produit',
                cell: (element: any) => `${element.roles}`,
                type: String
            },

            {
                columnDef: 'organisation',
                header: 'Groupe principal',
                cell: (element: any) => `${element.organisation}`,
                type: String
            },
            {
                columnDef: 'sousOrganisation',
                header: 'Groupe',
                cell: (element: any) => `${element.sousOrganisation}`,
                type: String
            },

            {
                columnDef: 'formation',
                header: 'Formation',
                cell: (element: any) => `${element.formation}`,
                type: String
            },
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String
            },
            {
                columnDef: 'Nom',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String
            },
            {
                columnDef: 'email',
                header: 'Adresse email',
                cell: (element: any) => `${element.email}`,
                type: String
            },
            {
                columnDef: 'date',
                header: 'Date',
                cell: (element: any) => `${element.date}`,
                type: String
            }
        ]

    },

    "OPENACCOUNTS": {
        exportTitle: 'ouverture_de_comptes',
        graphTitle: 'Graphique : Ouverture de comptes',
        zoomTitle: 'Ouverture de comptes',
        dataColumns: [
            {
                columnDef: 'formationId',
                header: 'Formation ID',
                cell: (element: any) => `${element.formationId}`,
                type: Number,
                condition: function () { return false; }
            },
            {
                columnDef: 'companyId',
                header: 'Organisation ID',
                cell: (element: any) => `${element.companyId}`,
                type: Number,
                condition: function () { return false; }
            },
            {
                columnDef: 'name',
                header: 'Groupe principal',
                cell: (element: any) => `${element.name}`,
                type: String
            },
            {
                columnDef: 'subName',
                header: 'Groupe',
                cell: (element: any) => `${element.subName}`,
                type: String
            },

            {
                columnDef: 'formationName',
                header: 'Formation',
                cell: (element: any) => `${element.formationName}`,
                type: String
            },
            {
                columnDef: 'value',
                header: 'Nombre de comptes ouverts',
                cell: (element: any) => `${element.value}`,
                type: Number
            }
        ]

    },



    "CONTENTS_VALID": {
        exportTitle: "contenus_valides",
        graphTitle: 'Graphique de validation des contenus',
        zoomTitle: "Validation des contenus",
        dataColumns: [
            {
                columnDef: 'nameMatrix',
                header: 'Formation',
                cell: (element: any) => `${element.nameMatrix}`,
                type: String
            },
            {
                columnDef: 'nameDomain',
                header: 'Domaine',
                cell: (element: any) => `${element.nameDomain}`,
                type: String
            },
            {
                columnDef: 'nameSkill',
                header: 'Compétence',
                cell: (element: any) => `${element.nameSkill}`,
                type: String
            },
            {
                columnDef: 'nameTheme',
                header: 'Thème',
                cell: (element: any) => `${element.nameTheme}`,
                type: String
            },
            {
                columnDef: 'nameAcquis',
                header: 'Acquis',
                cell: (element: any) => `${element.nameAcquis}`,
                type: String
            },
            {
                columnDef: 'nameContent',
                header: 'Contenu',
                cell: (element: any) => `${element.nameContent}`,
                type: String
            },
            {
                columnDef: 'categoryName',
                header: 'Statut',
                cell: (element: any) => `${element.categoryName}`,
                type: String
            },
        ]
    },

    "PERFORMANCE": {
        exportTitle: "performance",
        graphTitle: 'Graphique PERFORMANCE',
        zoomTitle: "Performance",
        dataColumns: [
            {
                columnDef: 'depth',
                header: 'Type de granularité',
                cell: (element: any) => depth[`${element.depth}`],
                type: String
            },
            {
                columnDef: 'name',
                header: 'Titre de la granularité',
                cell: (element: any) => `${element.name}`,
                type: String
            },
            {
                columnDef: 'companyName',
                header: 'Groupe',
                cell: (element: any) => `${element.companyName}`,
                type: String
            },
            {
                columnDef: 'firstName',
                header: 'Prénom',
                cell: (element: any) => `${element.firstName}`,
                type: String
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                cell: (element: any) => `${element.lastName}`,
                type: String
            },
            {
                columnDef: 'email',
                header: 'Email',
                cell: (element: any) => `${element.email}`,
                type: String
            },
            {
                columnDef: 'value',
                header: '% Acquis validés',
                cell: (element: any) => `${element.value} %`,
                type: String
            }
        ]
    },
    "CONNECTIONS": {
        exportTitle: "nb_connexions",
        graphTitle: "Nombre de connexions par entreprise et par mois",
        zoomTitle: "Nombre de connexions",
        dataColumns: [
            {
                columnDef: 'company',
                header: 'Groupe',
                description: '',
                cell: (element: any) => `${element[4]}`,
                type: String
            },
            {
                columnDef: 'date',
                header: 'Date',
                description: '',
                cell: function (element: any) {
                    return FiltersStorageService.precision === "DAY" ?
                        moment.unix(element[0]).format("DD/MM/YYYY")
                        : moment.unix(element[0]).format("MMM YYYY")
                },
                type: Date
            },
            {
                columnDef: 'lastName',
                header: 'Nom',
                description: '',
                cell: (element: any) => `${element[7]}`,
                type: String
            },
            {
                columnDef: 'firstName',
                header: 'Prénom',
                description: '',
                cell: (element: any) => `${element[6]}`,
                type: String
            },
            {
                columnDef: 'email',
                header: 'Email',
                description: '',
                cell: (element: any) => `${element[8]}`,
                type: String
            },
            {
                columnDef: 'count',
                header: 'Nombre de connexions',
                description: 'Pendant le mois',
                cell: (element: any) => `${element[1]}`,
                type: Number
            },
            {
                columnDef: 'totalCount',
                header: 'Nombre de connexions',
                description: 'Pendant la période filtrée',
                cell: (element: any) => `${element[9]}`,
                type: Number
            }
        ]
    }
}