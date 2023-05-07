import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
	events:any[] = [];
	hasRecord:boolean = false;
	constructor() {
    	if(localStorage.length>0)
    	{
			this.hasRecord = false;
			this.reload();
			this.hasRecord = true;
      	}else{
			this.hasRecord = false;
		}
    }

	ngOnInit(): void {}

	reload(): void {
		this.events=[];
		for(let i=0; i < localStorage.length;i++){
			let key=localStorage.key(i);
			let info:any = localStorage.getItem(key!);
			this.events.push(JSON.parse(info));
		}
	}

	delete(num:number): void{
		window.alert("Removed from favorites!");
		let key = localStorage.key(num);
		localStorage.removeItem(key!);
		if(localStorage.length>0)
    	{
			this.hasRecord = false;
        	this.reload();
			this.hasRecord = true;
      	}else{
			this.hasRecord = false;
		}
    }
}
