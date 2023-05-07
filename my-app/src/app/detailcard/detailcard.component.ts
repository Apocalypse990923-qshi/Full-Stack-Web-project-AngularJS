import { Component, OnInit,Input,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { GoogleMapsModule } from '@angular/google-maps';
import { Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { GooglemapcardComponent } from '../googlemapcard/googlemapcard.component';
import {  map } from 'rxjs/operators';

@Component({
  selector: 'app-detailcard',
  templateUrl: './detailcard.component.html',
  styleUrls: ['./detailcard.component.css']
})
export class DetailcardComponent implements OnInit {
	@Input() EventInfo:any;
	@Input() VenueInfo:any;
	@Output() close_signal = new EventEmitter<string>();
	hasAttraction:boolean = false;
	attractions:string[] = [];
	hasMusician:boolean = false;
	musicians:any[] = [];
	hasPrice:boolean = false;
	status_color!:string;
	status!:string;
	hasSeatmap:boolean = false;
	hasPhone:boolean = false;
	hasOpenHour:boolean = false;
	hasGeneralRule:boolean = false;
	hasChildRule:boolean = false;
	mapOptions:any;
    marker:any;
	isFavorite:boolean = false;
	showMore1:boolean = false;
	showMore2:boolean = false;
	showMore3:boolean = false;
	constructor(public dialog: MatDialog, private http: HttpClient) { }
	ngOnInit() {
		if(localStorage.getItem(this.EventInfo.id) != null){
	    	this.isFavorite = true;
	    }
		if("attractions" in this.EventInfo._embedded){
			console.log("Attraction exist!");
			this.hasMusician = this.search_attractions();
			this.hasAttraction = true;
		}
		if("priceRanges" in this.EventInfo){
			this.hasPrice = true;
		}
		if(this.EventInfo.dates.status.code=="onsale"){
			this.status_color = "green";
			this.status = "On Sale";
		}else if(this.EventInfo.dates.status.code=="offsale") {
			this.status_color = "red";
			this.status = "Off Sale";
		}else if(this.EventInfo.dates.status.code=="canceled") {
			this.status_color = "black";
			this.status = "Canceled";
		}else if(this.EventInfo.dates.status.code=="postponed") {
			this.status_color = "orange";
			this.status = "Postponed";
		}else if(this.EventInfo.dates.status.code=="rescheduled"){
			this.status_color = "orange";
			this.status = "Rescheduled";
		}
		if("seatmap" in this.EventInfo && "staticUrl" in this.EventInfo.seatmap){
			this.hasSeatmap = true;
		}
		if("boxOfficeInfo" in this.VenueInfo){
			if("phoneNumberDetail" in this.VenueInfo.boxOfficeInfo)	this.hasPhone = true;
			if("openHoursDetail" in this.VenueInfo.boxOfficeInfo)	this.hasOpenHour = true;
		}
		if("generalInfo" in this.VenueInfo){
			if("generalRule" in this.VenueInfo.generalInfo)	this.hasGeneralRule = true;
			if("childRule" in this.VenueInfo.generalInfo)	this.hasChildRule = true;
		}
		this.mapOptions  = {
	      center: { lat: Number(this.VenueInfo.location.latitude), lng: Number(this.VenueInfo.location.longitude)
	      },
	      zoom : 14
	    }
	    this.marker = {
	      position: { lat: Number(this.VenueInfo.location.latitude), lng: Number(this.VenueInfo.location.longitude) },
	    }
	}
	show_time(): string {
		if(this.EventInfo.dates.start.localTime){
			return this.EventInfo.dates.start.localDate+"\n"+this.EventInfo.dates.start.localTime;
		}
		return this.EventInfo.dates.start.localDate;
	}
	show_attractions(): string {
		var ret_str = this.attractions[0];
		for(let i=1;i<this.attractions.length;i++){
			ret_str += " | "+this.attractions[i];
		}
		return ret_str;
	}
	search_attractions(): boolean {
		console.log("Searching musicians among attractions")
		var flag:boolean = false;
		const promises: Promise<any>[] = [];
		for(let i=0;i<this.EventInfo._embedded.attractions.length;i++){
			this.attractions.push(this.EventInfo._embedded.attractions[i].name);
			if(this.EventInfo._embedded.attractions[i].classifications[0].segment.name=="Music"){
				flag = true;
				const musician_name = this.EventInfo._embedded.attractions[i].name;
				console.log("iteration",i,": ",musician_name);
				//this.spotify(musician_name);
				promises.push(this.spotify(musician_name));
				//this.spotify(this.EventInfo._embedded.attractions[i].name);
			}
		}
		//const results = await Promise.all(promises);
		Promise.all(promises)
    	.then((results) => {
      		for (const result of results) {
        		//console.log("Spotify result:", result);
        		this.musicians.push(result);
      		}
    	}).catch((error) => {
      		console.error("Error fetching data:", error);
    	});
		console.log(this.attractions);
		console.log(this.musicians);
		return flag;
	}
	show_genres(): string {
		let ret_str: string = "";
		if("segment" in this.EventInfo.classifications[0] && this.EventInfo.classifications[0].segment.name!="Undefined"){
			ret_str += this.EventInfo.classifications[0].segment.name;
		}
		if("genre" in this.EventInfo.classifications[0] && this.EventInfo.classifications[0].genre.name!="Undefined"){
			ret_str += " | "+this.EventInfo.classifications[0].genre.name;
		}
		if("subGenre" in this.EventInfo.classifications[0] && this.EventInfo.classifications[0].subGenre.name!="Undefined"){
			ret_str += " | "+this.EventInfo.classifications[0].subGenre.name;
		}
		if("type" in this.EventInfo.classifications[0] && this.EventInfo.classifications[0].type.name!="Undefined"){
			ret_str += " | "+this.EventInfo.classifications[0].type.name;
		}
		if("subType" in this.EventInfo.classifications[0] && this.EventInfo.classifications[0].subType.name!="Undefined"){
			ret_str += " | "+this.EventInfo.classifications[0].subType.name;
		}
		if(ret_str.length>0){
			return ret_str;
		}
		return "Undefined"
	}
	show_follower(num:number): string {
		//console.log("Starting to parse number of followers:",num);
		var num_str:string = String(num);
		var ret_str:string = "";
		while(num_str.length>3){
			var len=num_str.length-3;
			if(ret_str.length>0){
				ret_str = num_str.substr(len,3)+","+ret_str;
			}else{
				ret_str = num_str.substr(len,3);
			}
			num_str = num_str.substr(0,len);
		}
		if(ret_str.length>0){
			return num_str+","+ret_str;
		}
		return num_str;
	}
	show_address(): string {
		var ret_str="";
		if("line1" in this.VenueInfo.address){
			ret_str+=this.VenueInfo.address.line1+", ";
		}
		ret_str+=this.VenueInfo.city.name+", ";
		ret_str+=this.VenueInfo.state.name;
		return ret_str;
	}
	spotify(artist:string): Promise<any> {
		console.log("Got request for Searching musician: ",artist);
      	return this.http.get<any>('https://cs571-hw8-379421.wl.r.appspot.com/artist?artist='+encodeURIComponent(artist))
        .pipe(
            map((data)=>{
              return data;
            })
        )
		.toPromise();
        /*.subscribe((data: any) => {
			console.log("Info of ",artist,": ",data);
			this.musicians.push(data);
    	})*/
	}
	openGoogleMap() {
		const dialogConfig = new MatDialogConfig();
    	dialogConfig.disableClose = true;
    	dialogConfig.autoFocus = true;
		dialogConfig.data = {
			title: 'Event Venue',
			mapOptions: this.mapOptions,
		    marker: this.marker
    	};
    	const dialogRef = this.dialog.open(GooglemapcardComponent, dialogConfig);
  	}
	click_heart() {
		if(this.isFavorite){
			window.alert('Event Removed from favorites!');
			localStorage.removeItem(this.EventInfo.id);
		}else{
			window.alert('Event Added to favorites!');
			localStorage.setItem(this.EventInfo.id, JSON.stringify({
				id: this.EventInfo.id,
				data: this.EventInfo.dates.start.localDate,
				name: this.EventInfo.name,
				genres: this.show_genres(),
				venue: this.VenueInfo.name
			}));
		}
		this.isFavorite = !this.isFavorite;
	}
	goback():any{
    	this.close_signal.emit();
   	}
}
