import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AppRoutingModule } from './app-routing.module';
import { NavComponent } from './nav/nav.component';
import { ResultsComponent } from './results/results.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import 'hammerjs';
import { DetailsComponent } from './details/details.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { AgmCoreModule } from '@agm/core';
import { OrderModule } from 'ngx-order-pipe'



@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    NavComponent,
    ResultsComponent,
    FavoritesComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    CommonModule,
    MatTooltipModule,
    RoundProgressModule,
    OrderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDoP8QMc28Pe4XGxhfdKF0ERLs9HMdEtUY'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
