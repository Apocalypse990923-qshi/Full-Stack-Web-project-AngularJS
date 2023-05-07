import { Component, OnInit,Input,Inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {  map } from 'rxjs/operators';

@Component({
  selector: 'app-googlemapcard',
  templateUrl: './googlemapcard.component.html',
  styleUrls: ['./googlemapcard.component.css']
})
export class GooglemapcardComponent {
	mapOptions:any;
    marker:any;
	constructor(
    	public dialogRef: MatDialogRef<GooglemapcardComponent>,
     	@Inject(MAT_DIALOG_DATA) public data: any) {
			this.mapOptions = data.mapOptions;
			this.marker = data.marker;
	}
}
