import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NavBarComponent } from './templates/nav-bar/nav-bar.component';
import { ResearchBarComponent } from './templates/research-bar/research-bar.component';
import {HeaderComponent} from './templates/header/header.component';
import {FooterComponent} from './templates/footer/footer.component';
import {MenuGraphicComponent} from './templates/menu-graphic/menu-graphic.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';

import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AngularMaterialModule} from '../angular-material.module';

// Liste des graphiques
import { FilterComponent } from './templates/filter/filter.component';
import {PerformanceComponent} from './templates/graphics/performance/performance.component';
import { ContentsValidComponent } from './templates/graphics/contents-valid/contents-valid.component';
import {ConnectionsComponent} from './templates/graphics/connections/connections.component';
import {GraphicSelectorComponent} from './templates/graphics/graphic-selector/graphic-selector.component';
import { TotalConnectionComponent } from './templates/static-data/total-connection/total-connection.component';
import { TotalLearningTimeComponent } from './templates/static-data/total-learning-time/total-learning-time.component';
import { MyFilterPipe } from './pipes/callback.pipe';
import { FilterPipe } from './pipes/filter.pipe';

import { PrepareExportComponent } from './modals/prepareExport/prepareExport.component';
import { GraphDetailsComponent } from './modals/graphDetails/graphDetails.component';
import { SettingsStorageService } from './consts/settingsStorage';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './consts/customPaginator';
import { TotalTimeSpentInLearningComponent } from './templates/graphics/total-time-spent-in-learning/total-time-spent-in-learning.component';

import { ApprenantsComponent } from './templates/static-data/apprenants/apprenants.component';
import { ValidContentsComponent } from './templates/static-data/valid-contents/valid-contents.component';
import { FailedContentsComponent } from './templates/static-data/failed-contents/failed-contents.component';
import { FeedbackComponent } from './templates/graphics/feedback/feedback.component';
import { OpenAccountsComponent } from './templates/graphics/open-accounts/open-accounts.component';
import { UserContributionsComponent } from './templates/graphics/user-contributions/user-contributions.component';
import { RappelsMemorielsComponent } from './templates/graphics/rappels-memoriels/rappels-memoriels.component';

import { ListFormationComponent } from './templates/list-formation/list-formation.component';
import { ItemOrganisationComponent } from './templates/item-organisation/item-organisation.component';
import { ModalStaticDataDetailsComponent } from './templates/modal-static-data-details/modal-static-data-details.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    MatSliderModule
  ],
  declarations: [
    NavBarComponent,
    ResearchBarComponent,
    HeaderComponent,
    FooterComponent,
    MenuGraphicComponent,
    FilterComponent,
    PerformanceComponent,
    ContentsValidComponent,
    ConnectionsComponent,
    TotalTimeSpentInLearningComponent,
    GraphicSelectorComponent,
    TotalConnectionComponent,
    TotalLearningTimeComponent,
    MyFilterPipe,
    FilterPipe,
    PrepareExportComponent,
    GraphDetailsComponent,
    ApprenantsComponent,
    ValidContentsComponent,
    FailedContentsComponent,
    FeedbackComponent,
    OpenAccountsComponent,
    UserContributionsComponent,
    ListFormationComponent,
    ItemOrganisationComponent,
    ModalStaticDataDetailsComponent,
    RappelsMemorielsComponent,
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavBarComponent,
    ResearchBarComponent,
    HeaderComponent,
    FooterComponent,
    MenuGraphicComponent,
    PerformanceComponent,
    ContentsValidComponent,
    ConnectionsComponent,
    TotalTimeSpentInLearningComponent,
    GraphicSelectorComponent,
    TotalConnectionComponent,
    TotalLearningTimeComponent,
    PrepareExportComponent,
    GraphDetailsComponent,
    ApprenantsComponent,
    ValidContentsComponent,
    FailedContentsComponent,
    FeedbackComponent,
    OpenAccountsComponent,
    UserContributionsComponent,
    ListFormationComponent,
    RappelsMemorielsComponent
  ],
  providers: [
    SettingsStorageService,
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ]
})
export class SharedModule {}
