import { Component, OnInit,Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter,map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent{
	[x: string]: any;
    constructor(private http: HttpClient) { }
	Result_data:any;
	signupForm!: FormGroup;
	filteredKeywords: any;
    isLoading = false;
    errorMsg!: string;
    minLengthTerm = 2;
    selectedKeyword: any = "";
	clearlocation:boolean = false;
	TableFlag:boolean = false;

	onSubmit(){
		this.TableFlag = false;
		console.log("On submitted!");
		console.log(this.signupForm.value);
	    let keyword = this.signupForm.get('keyword')?.value;
	    let distance = this.signupForm.get('distance')?.value;
	    let category = this.signupForm.get('category')?.value;
		console.log(keyword);
		console.log(distance);
		console.log(category);
		if (this.signupForm.value.autolocate){
			this.http.get<any>('https://ipinfo.io/json?token=2109da12929018')
	        .pipe(
	            map((data)=>{
	              console.log(data.loc)
	              let locate= data.loc
	              let array = locate.split(",")
	              return array;
	            }),
	            switchMap(Array => this.http.get('https://cs571-hw8-379421.wl.r.appspot.com/search_events?latitude='+Array[0]+'&longitude='+Array[1]+'&keyword='+keyword+'&radius='+distance+"&category="+category)
	            .pipe(

	          ))
	        )
	        .subscribe((data: any) => {
	           //console.log(data)
	           this.Result_data = data;
			   //console.log(this.Result_data)
			   this.TableFlag = true;
	        })
		}else{
	    	let locate = this.signupForm.get('location')?.value
			console.log(locate)
	    	this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json?address='+locate+'&key=AIzaSyAzgqTav7G_0oLAfY__HQ4WjMtUn9Oitmo')
	        .pipe(
	        	map((data)=>{
	            	return data;
	        	}),
	        	switchMap(data => this.http.get('https://cs571-hw8-379421.wl.r.appspot.com/search_events?latitude=' + data.results[0].geometry.location.lat+'&longitude=' +data.results[0].geometry.location.lng+'&keyword='+keyword+'&radius='+distance+"&category="+category)
	        	.pipe(

	 			))
	    	)
	    	.subscribe((data: any) => {
				//console.log(data)
	        	this.Result_data = data;
				//console.log(this.Result_data)
				this.TableFlag = true;
	      	})
		}
	}

	onSelected() {
      console.log(this.selectedKeyword);
      this.selectedKeyword = this.selectedKeyword;
    }
    displayWith(value: any) {
      return value;
    }

	clear_locate(){
      if (this.signupForm.value.autolocate){
        this.clearlocation =true
		this.signupForm.get('location')?.disable();
      }
      else{
        this.clearlocation = false
		this.signupForm.get('location')?.enable();
      }
      this.signupForm.get('location')?.reset();
    }

	clearSelection() {
    	this.selectedKeyword = "";
    	this.filteredKeywords = [];
  	}

	ngOnInit(){
		this.signupForm = new FormGroup({
	      'keyword': new FormControl(null,Validators.required),
	      'distance': new FormControl('10'),
	      'category': new FormControl('Default',Validators.required),
	      'location': new FormControl(null,Validators.required),
	      'autolocate' : new FormControl(null),
	    })

		this.signupForm.get<string>('keyword')?.valueChanges
	      .pipe(
	        filter(res => {
	          return res!=null && res.length>=this.minLengthTerm
	        }),
	        distinctUntilChanged(),
	        debounceTime(1000),
	        tap(() => {
	          this.errorMsg = "";
	          this.filteredKeywords = [];
	          this.isLoading = true;
	        }),
	        switchMap(value => this.http.get('https://cs571-hw8-379421.wl.r.appspot.com/autocomplete?text=' + value)
	          .pipe(
	            finalize(() => {
	              this.isLoading = false
	            }),
	          )
	        )
	      )
	      .subscribe((data: any) => {
	        //console.log(data)
	        if (data == undefined) {
	          this.filteredKeywords = [];
	        } else {
	          this.filteredKeywords = data;
	        }
			console.log(this.filteredKeywords)
	      });
	}

	clean_all(){
	  this.signupForm.get('keyword')?.reset();
      //this.signupForm.get('distance')?.reset();
	  this.signupForm.get('distance')?.setValue(10);
      //this.signupForm.get('category')?.reset();
	  this.signupForm.get('category')?.setValue('Default');
      this.signupForm.get('location')?.reset();
	  this.signupForm.get('location')?.enable();
      this.signupForm.get('autolocate')?.reset();
	  this.TableFlag = false;
    }
}
