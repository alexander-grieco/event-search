import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {CommonModule} from '@angular/common';
import 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(private data: DataService) {
    this.data.isSubmit.subscribe(message => {
      this.searchInfo = message
      this.setToggle()
    },
      err => {console.log(err)},
      () => {this.setToggle()}
    )
    
    this.data.search.subscribe(isSearch => this.isSearched = isSearch)
    this.data.toggle.subscribe(toggle => this.toggle = toggle)
    this.data.eventId.subscribe(id => this.isClicked = id);
    this.data.changed.subscribe(isChanged => this.isChanged = isChanged)
    this.data.toggleFav.subscribe(isFav => this.isFav = isFav)

  }

  isSearched:boolean;
  isFav:boolean;
  searchInfo:Object;
  isClicked:string;
  isChanged:boolean;
  toggle:Object;

  ngOnInit() { 
    
    this.setToggle();
  
  }

  setToggle(){
    // console.log("entering toggle")
    if(this.searchInfo['_embedded'] && this.toggle){
      for(let i = 0; i < this.searchInfo['_embedded']['events'].length; i++){
        // console.log("outer");
          if( localStorage.getItem(this.searchInfo['_embedded']['events'][i]['id']) != null ){
            // console.log("here")
            this.toggle[i] = true;
          }
          else{
            this.toggle[i] = false;
          }
        
        this.data.setToggle(this.toggle);
      }
    }
  }
  onClick(id:string, name:string, venue:string, url:string){
    if(this.isClicked != id){
      this.isClicked = id;
      this.data.setName({
        "name":name,
        "venue":venue,
        "url":url
      });
      this.data.setEventId(this.isClicked);
      this.data.setChanged(true);
      this.data.setAllInfo({
        "eventInfo":null,
        "venueInfo":null,
        "spotifyInfo":[],
        "songkickInfo":null,
        "imageInfo":[]
      })
      this.data.setEventInfo([])
      this.data.setVenueInfo([])
      this.data.setLocation({})

    }
    else{
      this.data.setChanged(false);
    }
  }

  detailsClick(){
    this.data.setChanged(false);
  }



  favorite(i:number, event:Object){
    // console.log(this.toggle[i]);
    
    if(this.toggle[i] != true){
      localStorage.setItem(event["id"].toString(), JSON.stringify(event));
      for(let i =0; i < localStorage.length; i++){
        console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    }

    if(this.toggle[i] == true){
      localStorage.removeItem(event["id"].toString())
      for(let i =0; i < localStorage.length; i++){
        console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    }

    this.toggle[i] = !this.toggle[i];
    this.data.setToggle(this.toggle);
  }
}
