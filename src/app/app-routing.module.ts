import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {AuthGuardService, AuthGuardService as AuthGuard} from './shared/services/auth-guard.service';
import {ShortcutComponent} from './components/settings/shortcut/shortcut.component';
import {CompaniesComponent} from './components/companies/companies.component';
import {GraphComponent} from './components/graph/graph.component';
import {SettingsComponent} from './components/settings/settings.component';
import {PersonalInformationsComponent} from './components/settings/personal-informations/personal-informations.component';
import {MyAccountComponent} from './components/settings/my-account/my-account.component';
import {NotificationsComponent} from './components/settings/notifications/notifications.component';
import {DataProtectionComponent} from './components/settings/data-protection/data-protection.component';
import {CguCgvComponent} from './components/settings/cgu-cgv/cgu-cgv.component';
import {AccessibilityComponent} from './components/settings/accessibility/accessibility.component';

const routes: Routes = [

  /* Page de connexion */
  { path: 'home', component: HomeComponent}, // Permet la connexion / Inscription de l'utilisateur

  /* L'utilisateur est connecté */
  {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard]}, // Page d'accueil de l'utilisateur

  {
    path: 'settings', // Profil de l'utilisateur
    component: SettingsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'personal-informations',
        component: PersonalInformationsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'mon-compte',
        component: MyAccountComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'politique-de-protection-des-données',
        component: DataProtectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'cgu-cgv',
        component: CguCgvComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'accessibilite',
        component: AccessibilityComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'raccourcis', // Liste des raccourcis pour utiliser Tinydata
        component: ShortcutComponent,
        canActivate: [AuthGuard]
      },
   ]
  },

  {path: 'entreprise/:id', component: CompaniesComponent, canActivate: [AuthGuard]}, // Présentation de l'entreprise
  {path: 'graph/:graphName', component: GraphComponent, canActivate: [AuthGuard]}, // Zoom Graph

  /* Pas défini */
  /**
   * TODO - Il faut selectionner tous les champs 1 par 1 avec le :id, sinon ça ne marche pas (RESEARCH BAR)
   */
  // { path: ':type/:id', component: WelcomeComponent, canActivate: [AuthGuard] }, // Permet de récupérer toutes les pages


  /* Autres */
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
