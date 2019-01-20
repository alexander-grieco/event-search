import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {CommonModule} from '@angular/common';
import 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  constructor(private data: DataService) {

    this.data.toggle.subscribe(toggle => this.toggle = toggle)
    this.data.eventIdFav.subscribe(id => this.isClicked = id);
    this.data.changed.subscribe(isChanged => this.isChanged = isChanged)
    this.data.toggleFav.subscribe(isFav => this.isFav = isFav)
    
  }

  local = [];
  isFav:boolean;
  searchInfo:Object;
  isClicked:string;
  isChanged:boolean;
  toggle:Object;
  ngOnInit() {
    this.getLocalStorage()
  }

  getLocalStorage(){
    for(let i = 0; i < localStorage.length; i++){
      this.local.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
  }

  removeEvent(i:number){
    let removed = this.local.splice(i, 1);
    localStorage.removeItem(removed[0]['id']);
    console.log(localStorage);
  }


  onClick(id:string, name:string, venue:string, url:string){
    if(this.isClicked != id + 'fav'){
      this.isClicked = id + 'fav';
      this.data.setName({
        "name":name,
        "venue":venue,
        "url":url
      });
      this.data.setEventFavId(this.isClicked);
      this.data.setChanged(true);
      this.data.setLocation({})
      this.data.setEventInfo([])
      this.data.setVenueInfo([])
      

    }
    else{
      this.data.setChanged(false);
    }

    
  }

  detailsClick(){
    this.data.setChanged(false);
  }

}
