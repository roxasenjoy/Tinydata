import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HomeModule } from './components/home/home.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { ShortCutModule } from './components/settings/shortcut/shortcut.module';
import { AuthModule } from './components/auth/auth.module';

import { AuthGuardService } from './shared/services/auth-guard.service';
import { SettingsStorageService } from './shared/consts/settingsStorage';
import { TypeService } from './shared/models/type';
import { FiltersStorageService } from './shared/consts/filtersStorage';

import { SharedModule } from './shared/shared.module';
import {AngularMaterialModule} from './angular-material.module';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import {MatNativeDateModule} from '@angular/material/core';
import { CompaniesComponent } from './components/companies/companies.component';
import {GraphComponent} from './components/graph/graph.component';
import { DatePipe } from '@angular/common';

import {EntrepriseService} from './shared/services/entreprise.service';
import {FilterService} from './shared/services/filter.service';
import {ExportService} from './shared/services/export.service';
import {GlobalService} from './shared/services/global.service';
import { SettingsComponent } from './components/settings/settings.component';
import { PersonalInformationsComponent } from './components/settings/personal-informations/personal-informations.component';
import { MyAccountComponent } from './components/settings/my-account/my-account.component';
import { NotificationsComponent } from './components/settings/notifications/notifications.component';
import { DataProtectionComponent } from './components/settings/data-protection/data-protection.component';
import { CguCgvComponent } from './components/settings/cgu-cgv/cgu-cgv.component';
import { AccessibilityComponent } from './components/settings/accessibility/accessibility.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';

import {GranularitiesStorage} from './shared/consts/granularitiesStorage';

import { ToastrModule } from 'ngx-toastr';

import {EventEmitterService} from './shared/services/event-emitter.service';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CloseScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

export function scrollFactory(overlay: Overlay): () => CloseScrollStrategy {
	return () => overlay.scrollStrategies.close();
}


@NgModule({
  declarations: [
    AppComponent,
    CompaniesComponent,
    GraphComponent,
    SettingsComponent,
    PersonalInformationsComponent,
    MyAccountComponent,
    NotificationsComponent,
    DataProtectionComponent,
    CguCgvComponent,
    AccessibilityComponent

    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    HttpClientModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    LottieModule.forRoot({ player: playerFactory }),
    SharedModule,
    AngularMaterialModule,
    HomeModule,
    DashboardModule,
    AuthModule,
    ShortCutModule,
    ScrollingModule,
    ToastrModule.forRoot({
      timeOut: 7500,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  
  ],
  providers: [
    AuthGuardService,
    SettingsStorageService,
    FiltersStorageService,
    GranularitiesStorage,
    EntrepriseService,
    FilterService,
    TypeService,
    EventEmitterService,
    ExportService,
    GlobalService,
    DatePipe,
    { provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
