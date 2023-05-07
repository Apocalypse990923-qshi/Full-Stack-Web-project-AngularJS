import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { AppComponent }  from './app.component';

const routes: Routes = [
	{ path: 'search', component: SearchComponent },
 	{ path: 'favorites', component: FavoritesComponent },
	{ path: '', redirectTo: 'search', pathMatch: 'full' }
];

@NgModule({
  imports: [
	  RouterModule.forRoot(routes),
	  BrowserModule,
	  FormsModule,
	  ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
