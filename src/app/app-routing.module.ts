import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResultsComponent} from './results/results.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {DetailsComponent} from './details/details.component';

const routes: Routes = [
  {
        path:"results",
        component: ResultsComponent,
        data: {animation: 'ResultsPage'} 
      },
      {
        path:"details/:id",
        component: DetailsComponent,
        data: {animation: 'DetailsPage'}
      },
      {
        path:"favorites",
        component: FavoritesComponent,
        data: {animation: 'FavoritesPage'}
      }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
