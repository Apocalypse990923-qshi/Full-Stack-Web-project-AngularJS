import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { GoogleMapsModule } from '@angular/google-maps';
import { ResultlistComponent } from './resultlist/resultlist.component';
import { DetailcardComponent } from './detailcard/detailcard.component';
import { GooglemapcardComponent } from './googlemapcard/googlemapcard.component';
@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    FavoritesComponent,
    ResultlistComponent,
    DetailcardComponent,
    GooglemapcardComponent
  ],
  imports: [
    BrowserModule,
	BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
	RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
	MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
	MatProgressSpinnerModule,
    MatTabsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [GooglemapcardComponent]
})
export class AppModule { }
