import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  isResults:Boolean;

  constructor(private data: DataService) {
    this.data.toggleFav.subscribe(isFav => this.isResults = isFav)
  }

  ngOnInit() {
  }


  onClickResults(){
    this.data.setToggleFav(true);
    this.data.setEventFavId('');
  }

  onClickFavorites(){
    this.data.setToggleFav(false);
    this.data.setEventId('');
  }

}
