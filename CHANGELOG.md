## 1.8.2 (06/06/2023) - PP 
- [Added]       Graphique : Rappels mémoriels : Ajout des % lors du survol des éléments
- [FIX]         Graphique : Temps passé dans l'apprentissage : Le filtre FORMATION a un effet sur ce graphique
- [FIX]         Données brutes : Temps total passé dans l'apprentissage : Le filtre FORMATION a un effet sur cette donnée
- [FIX]         Graphique & Données brutes : Nombre de connexions : Changement de la manière de compter les connexions

## 1.8.1 (17/05/2023)
- [Changed]     Graphique : OUVERTURE DE COMPTES : Changement de la légende

## 1.8.0 (16/05/2023)
- [Removed]     Graphique : PROGRESSION GENERALE : Supprimé
- [Changed]     Uniformisation des requêtes permettant de récupérer les données des graphiques et des données brutes.

## 1.7.0 - (04/05/2023)
- [Added]       Filtre GROUPES : Ajout des 10 profondeurs
- [Changed]     Graphique : PERFORMANCE : Modification globale de l'algorithme
- [Changed]     Les formations se trouvant sous les graphiques ne contenant aucune donnée sont grisées.
- [Changed]     Agrandissement de la modal des filtres 
- [Fixed]       Navigation : Nouveau responsive
- [Fixed]       Graphique : NOMBRE DE CONNEXIONS : Impossibilité de l'exporter et de voir les données détaillées
- [Fixed]       Graphique : FEEDBACK : Duplication des événements
- [Fixed]       Graphique : CONTRIBUTIONS DES UTILISATEURS : Duplication des événements
- [Fixed]       Les données affichées ne sont pas les mêmes que les données sur Tinydata
- [Fixed]       Les données pour les rôles suivant sont les mêmes : Admin Client, Super admin client, Admin Tinydata
- [Fixed]       Graphique : NOMBRE DE CONNEXIONS : Filtre GROUPES non fonctionnel
- [Fixed]       Graphique : OUVERTURE DES COMPTES : Ne s'affiche pas lors qu'on est connecté à un rôle SUPER ADMIN TINYCOACHING
- [Fixed]       Graphique : CONTRIBUTIONS DES UTILISATEURS : Tous le monde peut voir toutes les contributions

## 1.6.0 - (20/03/2023)
- [Added]       NOUVEAU GRAPHIQUE : Feedbacks
- [Added]       NOUVEAU GRAPHIQUE : Contributions des utilisateurs
- [Added]       Filtre formation sous les graphiques uniformisés. 

- [Changed]     Les formations sous les graphiques ne disposant d'aucune donnée sont grisées et il est impossible de cliquer dessus
- [Changed]     Refactorisation du graphique PERFORMANCE (2000 lignes -> 300 lignes)
- [Changed]     Filtre formation : Toutes les formations sont disponibles d'un seul coup
- [Changed]     Wordings des contrats modifiés

- [Removed]     Filtre formation : Pagination
- [Removed]     Zoom - Formations 

- [Fixed]       Impossible pour un administrateur Tinydata de sélectionner les enfants de son entreprise
- [Fixed]       Duplications des événements sur tous les graphiques de Tinydata
- [Fixed]       Graphique : Contributions des utilisateurs : Les apprenants avaient la possibilité de voir tous les commentaires même ceux qui ne se trouvaient pas dans leur entreprise.
- [Fixed]       Impossibilité d'exporter le graphique des connexions
- [Fixed]       Le bouton pour accèder aux détails d'une entreprise ramène tout le temps vers l'entreprise parent

- [Deprecated]  Graphique : PROGRESSION GÉNÉRALE : Inutile depuis l'implémentation des 

## 1.5.1 - (17/01/2023)
- [Fixed]       Impossible de se connecter

## 1.5.0 - (17/01/2023)
- [Added]       NOUVEAU GRAPHIQUE : Ouverture de compte
- [Added]       Nouveau persona Tinydata/Tinysuite
- [Added]       Détails de l'entreprie : Type de contract
- [Added]       Filtre groupes : Ajout d'une troisième profondeur
- [Security]    Modification des droit d'accès à Tinydata via les nouveaux personas
- [Fixed]       Graphique : OUVERTURE DES COMPTES : Export des emails pour les formats PDF, EXCEL, CSV
- [Fixed]       Graphique : OUVERTURE DES COMPTES : Export via le dashboard
- [Changed]     Changement de wording pour les organisation / organisation mère -> Groupe/Groupe initial/Groupe parent/Groupe enfant
- [Changed]     Dans les paramètres Tinydata, la gestion des comptes redirige vers Tinysuite
- [Removed]     Création d'un rôle
- [Removed]     Création d'un compte 
- [Removed]     Détails de l'entreprise : Objectifs professionnels
- [Deprecated]  Zoom - Formations

## 1.4.0 - (22/09/2022)
- [Added]       Graphique : FEEDBACK : Export disponible avec les données détaillées

- [Fixed]       Graphique : CONTENUS VALIDÉS : Zoom non fonctionnel
- [Fixed]       Temps d'apprentissage différent entre la donnée brute et le graphique
- [Fixed]       Paramètres : L'affichage des différentes sections
- [Fixed]       Graphique : PERFORMANCE : Affichage des tubes lors qu'on a sélectionné un utilisateur

- [Changed]     Graphique : PERFORMANCE : Changement des termes pour revenir en arrière
- [Changed]     Global : Refont graphique
- [Changed]     Amélioration de l'accessibilité au niveau des couleurs utilisées
- [Changed]     Modification design des données brutes
- [Changed]     Ajustement graphique de l'export PDF
- [Changed]     Graphique : CONTENUS VALIDES : Changement de nom

## 1.3.0 - (04/08/2022)
- [Added] Ajout de la sélection des formations + Responsive
- [Added] Ajout des filtres spécifiques au graphique CONTENUS VALIDÉS + Reponsive
- [Added] Affichage des nodes via les données du back + création des fonctions pour la gestion des différents cas
- [Added] Gestion des contenus validés et du changement de formations pour le dashboard.
- [Added] Suppression des TUBES
- [Added] Déconnexion automatique quand l'API répond 401
- [Added] (general-progression) Les données détaillées sont disponibles.

- [Added] NOUVEAU GRAPHIQUE : Contenus validés
- [Added] Masquage des entreprises qui sont supprimées dans le BO

- [Fixed] Les entreprises parents affichent les informations.

- [Fixed] Les entreprises parents affichent les informations.
- [Fixed] (Graphique Performance) - Changement du nom des fichiers en PERFORMANCE au lieu de CONTENTS_VALID.
- [Fixed] (filtre): Problème avec les filtres Organisations et Formations
- [Fixed] Amélioration de l'accessibilité
- [Fixed] (performance): Problème résolu lors de la sélection d'un USER et du ZOOM Thème
- [Fixed] Ajustement de lottie pour l'image de la home (erreurs dans console)
- [Fixed] Suppression d'un fichier inutilisé qui génerait également une erreur js (dark.js)
- [Fixed] Meilleure gestion des erreurs http ( correctif connexion infini si mauvais mdp )


## 1.2.1 - (01/07/2022)
- [Fixed] Ajustement légende
- [Fixed] Le graphique du temps passé dans l'apprentissage est passé en heures + minutes
- [Fixed] Rajout de plusieurs éléments en darkMode

- [Fixed] Inversion des données du graphique du temps total passé dans l'apprentissage.
- [Fixed] Progression générale
- [Fixed] Oubli du filtre Organisation pour la donnée brute: Temps passé dans l'apprentissage

## 1.2.0 - (21/06/2022)
- [Added] Ajout de la granulartié Thème
- [Added] Graphique progression générale se base maintenant sur le table AnalyticsSkill
- [Added] Message pour prévenir l'utilisateur de ce qu'il faut faire quand on export les données
- [Added] Rajout du type de granularité dans les graphiques détaillées + dans l'export en format PDF
- [Added] Suppression des données bruts (event sendData)
- [Added] Ajout de condition pour appel des données enrichies
- [Added] NOUVEAU GRAPHIQUE : Temps total passé dans l'apprentissage
- [Added] Remplacement des contenus validés par les acquis validé.
- [Added] Graphique progression générale se base maintenant sur le table AnalyticsSkill
- [Added] Le temps d'apprentissage est basé sur le temps total des sessions de l'utilisateur/du total de l'entreprise en fonction du filtre date
- [Added] Ajout de la requête pour obtenir le temps par utilisateur

- [Fixed] Afficher la dernière intéraction des utilisateurs pour toutes les sessions de la journée
- [Fixed] Modifier l'organisation en email pour le nombre de temps passé dans l'apprentissage
- [Fixed] Filtre organisation fonctionnel pour le graphique nombre de temps passé en apprentissage
- [Fixed] Modification des éléments rencontrés lors de la navigation en PP + modification design
- [Fixed] Filtre formation qui ne rafraichit pas les données
- [Fixed] Design du bouton d'export ressemblant à celui dans les données détaillées
- [Fixed] Problème d'affichage du détail des granularités à droite du graphique quand on reset tous les filtres.
- [Fixed] Afficher la dernière intéraction des utilisateurs pour toutes les sessions de la journée
- [Fixed] Résolution du problème de l'excel qui affiche la colonne 'lastInteraction' quand on se base sur plusieurs jours
- [Fixed] Graphique de connexion: Modification concernant l'axe des abscisses qui est aligné avec les données + les doublons ne sont plus présents
- [Fixed] Nombre de connexion : Les abscisses sont maintenant dans l'ordre.
- [Fixed] Optimisation des exports PDF + design du détails des granularités pour le graphique PERFORMANCE
- [Fixed] Mettre tous les éléments au singulier + modification des données extends du graphique Nombre de temps passé dans l'apprentissage
- [Fixed] Rétification du design pour les éléments à droite du graphique PERFORMANCE
- [Fixed] Résultats par défaut pour les données détaillées

## 1.1.1 - (14/04/2022)
- [Fixed] Typo firstNamee -> firstname

## 1.1.0 - (14/04/2022)
- [Added] Modal de validation pour la suppression d'un rôle.
- [Added] Ajout de plusieurs rôles lors de la création d'un compte
- [Added] Update d'un compte avec la possibilité de sélectionner plusieurs roles

- [Fixed] Résolution des problèmes de design qu'il y eu lors de précédent push
- [Fixed] Les rôles s'affichent directement dans le tableau lors de sa création
- [Fixed] Problème de size avec le graphique progression générale
- [Fixed] BUG AFFICHAGE DES ROLES
- [Fixed] FILTRE FORMATION - BLOQUÉ
- [Fixed] Fix du graphique de connexion qui est maintenant visible (Seulement pour moi)
- [Fixed] Copyright - Vue enrichie / Graph performance
- [Fixed] Bug affichage des rôles
- [Fixed] Invisibilité des données en mode nuit
- [Fixed] Filtre formation - bloqué
- [Fixed] Bouton valider et exporter qui se chevauchent
- [Fixed] Problème d'affichage filtre utilisateur
- [Fixed] Filtre formation qui ne se met pas à jour en fonction des organisation
- [Fixed] Erreur système devraient apparaitre en rouge
- [Fixed] Suppression du scoll -- Creation de compte
- [Fixed] Optimisation design données enrichies
- [Fixed] Maj abscisses du graph de connexion en fonction du filtre date non foncitonnel
- [Fixed] Filtre formation qui se met à jour en fonction des orga (Problème d'affichage)
- [Fixed] Détails des formations qui s'affichent lors qu'on reset les filtres.
- [Fixed] Problème pour les résolutions bizarre (Export des données dashboard)
- [Fixed] Rectification design

## 1.0.10 - (07/03/2022)
- [Added] Ajustements Dark mode
- [Added] Données enrichies par défaut
- [Added] Filtres dans l'export PDF
- [Added] Possibilité de créer un rôle pour plusieurs organisation en même temps
- [Added] Ajout nombres de connexions données enrichies
- [Added] FILTRES - Parent/Enfants pour les organisations
- [Added] Création d'un rôle pour plusieurs entreprises en même temps

- [Fixed] Précision des éléments concernant les rôles
- [Fixed] Delete quand rôle déjà attribué
- [Fixed] Suppression d'un rôle déjà présent sur un compte

## 1.0.9 - (04/02/2022)
- [Fixed] Bouton retour performance + connexion
- [Fixed] barre de recherche
- [Fixed] Taille des titres PDF

## 1.0.8 - (04/02/2022)
- [Added] Refonte du graph performance
- [Fixed] Ajustements sur les filtres
- [Fixed] Modification du nom des graphs sur les exports PDF
- [Fixed] Changement de couleurs des btns
- [Fixed] Diminution taille + replacement du numéro de page impression pdf
- [Fixed] bug page entreprise (l'id entreprise était en String alors qu'il faut un Int)
- [Fixed] Changement de wording modal des filtres "Fermer" -> "Valider"

## 1.0.7 - (27/01/2022)
- [Added] Ajout des données enrichies pour les matrices
- [Added] Ajout des 3 données brutes à l'export PDF
- [Added] Refacto du filtre date pour passer
- [Added] Sécurisation API
- [Added] Mise en place de la notion d'organisation mère/fille
- [Added] Création d'un DateService pour centraliser la gestion des filtres date.
- [Added] Refacto global de la gestion des dates pour passer de l'ancien format (Tue Jan 18 2022 23:59:59 GMT+0100 (heure normale d’Europe centrale)) à un format plus conventionnel (2022-01-18 23:59:59)

- [Fixed] requête redondante qui générait une erreur
- [Fixed] pb connexion
- [Fixed] Ajustement de certaines requêtes qui prenaient des paramètres incorrects (comapnyName au lieu de companyId par ex.)
- [Fixed] Suppression de certains arguments
- [Fixed] 3 données haut de dashboard (confusion entre user_client.id et user.id)
- [Fixed] Rectification de bugs concernant les filtres et la barre de recherche
- [Fixed] Taille de police adaptée pour les filtres
- [Fixed] Taille du graphique de progression
- [Fixed] Boucle infinie graphique nb connexions
- [Fixed] Affichage correct temps total d'apprentissage

## 1.0.6 - (07/12/2021)
- [Added] Ajout du système de pagination pour les formations.
- [Added] Ajout d'une barre de recherche pour le zoom utilisateur.
- [Added] Données enrichies

- [Fixed] Fix de la matrice DIGITAL qui ne fonctionnait pas
- [Fixed] Probleme connexion addslashes
- [Fixed] Modification route connexion pour group by user
- [Fixed] Changement nom du champ => id problématique en js
- [Fixed] Ajustement filtres
- [Fixed] Ajustements des données enrichies

## 1.0.5 - (18/11/2021)
- [Added] Export CSV
- [Fixed] Ajustement graphs dashboard
- [Fixed] Résolution pb sur le zoom formation et organisation
- [Fixed] Affichage de toutes les granularités en fonction du Zoom
- [Fixed] Zoom formation, organisation

## 1.0.4 - (29/10/2021)
- [Added] Création de la page de détail des graphs
- [Fixed] calcul temps passé en apprentissage

## 1.0.3 - (28/10/2021)
- [Added] mail création compte
- [Added] Graphique performance

- [Fixed] Modification des requêtes SQL pour les données.
- [Fixed] Filtre en fontion des entreprises
- [Fixed] Temps d'apprentissage qui se rafraichi en fonction des entreprises selectionnées
- [Fixed] Correction liste des couleurs aléatoires pour les graphs
- [Fixed] Correctif sur la modale d'export

## 1.0.2 - (27/10/2021)
- [Added] Création des trois données sur le dashboard
- [Added] Filtre les recherches en fonction de l'entreprise de l'utilisateur
- [Added] Super admin - Problème pour le temps d'apprentissage
- [Added] Suppression du % graph connection

- [Fixed] Modification récupération des formations pour filtre formation
- [Fixed] Ajout de la formation digitale dans le filtre formation
- [Fixed] Création des trois données en haut du dashboard
- [Fixed] Research bar quand super admin fix
- [Fixed] Suppression des console.log
- [Fixed] Duplication des utilisateurs dans la barre de rechercher
- [Fixed] Refresh du graphique quand on repasse en vu MANAGER/ENTREPRISE
- [Fixed] Masquage temporaire de certains élements 

## 1.0.1 - (21/10/2021)
- [Fixed] Correctif sur le script de déploiement automatique

## 1.0.0 - (21/10/2021)
- [Added] Naissance de Tinydata !!!
