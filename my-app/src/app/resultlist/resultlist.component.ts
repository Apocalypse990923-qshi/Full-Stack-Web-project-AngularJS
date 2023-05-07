import { Component, OnInit,Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  tap, switchMap,map } from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-resultlist',
  templateUrl: './resultlist.component.html',
  styleUrls: ['./resultlist.component.css']
})
export class ResultlistComponent implements OnInit {
	@Input() ResultData:any;
	ResultArray:any;
	NoFlag:boolean = false;
	DetailFlag:boolean = false;
	Event_data:any;
	Venue_data:any
	constructor(private http: HttpClient) { }
	ngOnInit() {
		console.log("Tablelist Initialize")
		//console.log(this.ResultData)
		if(this.ResultData.page.totalElements>0){
			this.NoFlag=false;
			this.ResultArray = this.ResultData._embedded.events;
			this.ResultArray.sort(function (a:any, b:any) {
				if(a.dates.start.localDate < b.dates.start.localDate){
					return -1;
				}else if(a.dates.start.localDate > b.dates.start.localDate){
					return 1;
				}else{
					if("localTime" in a.dates.start && "localTime" in b.dates.start){
						if(a.dates.start.localTime < b.dates.start.localTime){
							return -1;
						}else if(a.dates.start.localTime > b.dates.start.localTime){
							return 1;
						}
					}else if("localTime" in a.dates.start){
						return 1;
					}else if("localTime" in b.dates.start){
						return -1;
					}
				}
				return 0;
			});
			//console.log("Sorted Array:",this.ResultArray);
		}else{
			this.NoFlag=true;
		}
	}
	show_time(i:number): string {
		if(this.ResultArray[i].dates.start.localTime){
			return this.ResultArray[i].dates.start.localDate+"\n"+this.ResultArray[i].dates.start.localTime;
		}
		return this.ResultArray[i].dates.start.localDate;
	}

	show_detail(i:number):any{
      	console.log("Display request got")

      	let event_id = this.ResultArray[i].id
      	this.http.get<any>('https://cs571-hw8-379421.wl.r.appspot.com/detail?event_id='+event_id)
        .pipe(
            map((data)=>{
              return data;
            })
        )
        .subscribe((data: any) => {
        	this.Event_data = data
		 	console.log("Event info:",this.Event_data)

		  	let venue = this.ResultArray[i]._embedded.venues[0].name
  			this.http.get<any>('https://cs571-hw8-379421.wl.r.appspot.com/venue?venue='+venue)
          	.pipe(
            	map((data2)=>{
                	return data2;
             	})
          	)
          	.subscribe((data2: any) => {
            	this.Venue_data = data2
  		  		console.log("Venue info:",this.Venue_data)
		  		this.DetailFlag = true
      		})
    	})
    }
}
