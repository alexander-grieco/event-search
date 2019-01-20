import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {DataService} from '../data.service';
import {Observable} from 'rxjs';
import { promise } from 'protractor';
import { transition, state, trigger, style, animate, query } from '@angular/animations';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({height:0, opacity:0})),
      state('*', style({height:100,opacity:1})),
      transition(':enter, :leave',[
        animate('500ms ease-in')
      ]),
      transition('true => false',[
        style({height:100, opacity:1}),
        animate('500ms ease-out', style({height:0, opacity:0}))
      ])
    ])
  ]
})
export class DetailsComponent implements OnInit {
  title: object;
  obbArr: object[];
  eventId$:Object;
  eventInfoArr:Array<object> = [];
  venueInfoArr:Array<object> = [];
  allInfo$:Object;
  isChanged$:boolean;
  lat: number;
  lng: number;
  showMore:boolean;
  fadeOut:boolean;
  selectOptions:Array<object> = [];
  selectedValue:string;
  orderOptions:Array<object> = [];
  orderValue:boolean;
  isFavorite:boolean = false;
  toggle:Object;
  isFav:boolean;
  isSearched:boolean;

  constructor(private route: ActivatedRoute, private data:DataService) {
    this.data.toggleFav.subscribe(isFav => {
      this.isFav = isFav
      console.log(isFav)
    });
    this.route.params.subscribe(id =>this.eventId$ = id.id);
    this.isChanged$ = this.data.changed["source"]["value"];
    this.data.allInfo.subscribe(message => this.allInfo$ = message);
    this.data.nameVenueUrl.subscribe(name => this.title = name);
    this.showMore = false;
    this.fadeOut = false;
    this.data.toggle.subscribe(toggle => this.toggle = toggle);
    this.data.search.subscribe(search => this.isSearched = search);

    this.selectOptions = [
      {value:"default", name:"Default"},
      {value:"displayName", name:"Event Name"},
      {value:"start.date", name:"Time"},
      {value:"performance[0].displayName", name:"Artist"},
      {value:"type", name:"Type"}
    ]
    this.selectedValue = 'default'

    this.orderOptions = [
      {value:false, name:"Ascending"},
      {value:true, name:"Descending"}
    ]
    this.orderValue = false;

    this.data.location.subscribe(location => {
      this.lat = location["lat"],
      this.lng = location["lng"]
    })
    
  }

  checkToggle(){
    // console.log('event id: ', this.eventId$)
    for(let j = 0; j < localStorage.length; j++){
      // console.log('key: ', localStorage.key(j));
      if(this.eventId$ == localStorage.key(j)){
        this.isFavorite = true;
      }
    }
  }

  ngOnInit() {
    if(this.isChanged$){
      if(this.isFav){
        this.eventId$ = this.data.eventId["source"]["value"];
      }
      else{
        this.eventId$ = this.data.eventIdFav["source"]["value"].substring(0, this.data.eventIdFav["source"]["value"].length - 3)
      }
      this.checkToggle()
      this.data.getEventInfo(this.eventId$).subscribe(data=>{
        this.allInfo$["eventInfo"] = data
        // console.log("Event Info: ", this.allInfo$["eventInfo"])
        this.setEventInfo(data);
        const venue = data["_embedded"]["venues"][0]["name"]

        this.data.getSongkick(venue).subscribe(songkickData => {
          this.allInfo$["songkickInfo"] = songkickData['resultsPage']['results']
          // console.log("Songkick Info: ", this.allInfo$["songkickInfo"])
        })

        setTimeout(() => 
        this.data.getVenueInfo(venue).subscribe(venueData =>{
          this.allInfo$["venueInfo"] = venueData
          // console.log("Venue Info: ", this.allInfo$["venueInfo"])
          this.setVenueInfo(venueData["_embedded"]["venues"][0]);
        }), 500);

        if(data["classifications"] && data["classifications"][0]["segment"]["name"] == "Music"){
          for(let i = 0; i < data["_embedded"]["attractions"].length; i++){
            this.data.getSpotify(data["_embedded"]["attractions"][i]["name"]).subscribe( artistInfo =>{
              this.obbArr = artistInfo["artists"]["items"]
              for(let j = 0; j< this.obbArr.length; j++){
                if(this.obbArr[j]["name"].toLowerCase() == data["_embedded"]["attractions"][i]["name"].toLowerCase()){
                  this.allInfo$["spotifyInfo"].splice(i, 0, this.obbArr[j])
                  j=this.obbArr.length + 1
                }
              }
              if(this.obbArr.length == 0){
                this.allInfo$['spotifyInfo'].push(0)
              }
            })
          }
        } else {
          this.allInfo$["spotifyInfo"].push(0);
        }
        console.log("Spotify Info: ", this.allInfo$["spotifyInfo"])

        this.allInfo$['imageInfo'] = []
        if(data["_embedded"]["attractions"]){
          for(let i = 0; i < data["_embedded"]["attractions"].length; i++){
            this.data.getImages(data["_embedded"]["attractions"][i]["name"]).subscribe( imgInfo => {
              this.allInfo$["imageInfo"].splice(i,0,{
                "name":data["_embedded"]["attractions"][i]["name"],
                "data":imgInfo["items"]
              })
            })
          }
        }
        else{
          this.allInfo$["imageInfo"].push(0);
        }
        console.log("Image Info: ", this.allInfo$["imageInfo"])
      })
      
    }
    else{
      // this.eventInfoArr = this.data.eventInfo
      this.eventInfoArr = this.data.eventInfo["source"]["_value"]
      this.venueInfoArr = this.data.venueInfo["source"]["_value"]
      this.checkToggle()
    }
  }

  setEventInfo(data:Object){
    // artist
    if(data["_embedded"]["attractions"]){
      let arrayStr = data["_embedded"]["attractions"][0]["name"]
      for(let i = 1; i<data["_embedded"]["attractions"].length; i++){
        arrayStr += " | " + data["_embedded"]["attractions"][i]["name"]
      }
      this.eventInfoArr.push({
        "name":"Artist/Team{s}",
        "data": arrayStr
      });
    }
    
    // venue
    this.eventInfoArr.push({
      "name":"Venue",
      "data": this.title["venue"]
    })

    // date
    let date = new Date(data["dates"]["start"]["localDate"])
    // console.log(date);
    this.eventInfoArr.push({
      "name":"Time",
      "data":date
    })

    //category
    if(data["classifications"]){
      let cats = [];
      let cat_string = ''
      if(data["classifications"][0]["genre"]["name"] != "Undefined"){cats.push(data["classifications"][0]["genre"]["name"])}
      if(data["classifications"][0]["segment"]["name"] != "Undefined"){cats.push(data["classifications"][0]["segment"]["name"])}
      if(cats.length != 0){
        if(cats.length == 2){
          cat_string = cats[0] + " | " + cats[1]
        }
        if(cats.length == 1){
          cat_string = cats[0]
        }

        this.eventInfoArr.push({
          "name":"Category",
          "data" : cat_string
        })
      }
    }
    //prices
    let prices = ''
    if(data["priceRanges"]){
      if(data["priceRanges"][0].min == "Undefined" && data["priceRanges"][0].max == "Undefined"){}
      else if(data["priceRanges"][0].min == "Undefined"){
        prices+="$" + data["priceRanges"][0].max;
      }
      else if(data["priceRanges"][0].max == "Undefined"){
        prices+="$" + data["priceRanges"][0].min;
      }
      else{
        prices+="$" + data["priceRanges"][0].min + " ~ " + "$" + data["priceRanges"][0].max;
      }
    }
    if(prices != ''){
      this.eventInfoArr.push({
        "name":"Price Range",
        "data" : prices
      })
    }

    // ticket status
    this.eventInfoArr.push({
      "name": "Ticket Status",
      "data": data["dates"]["status"]["code"]
    })


    // buy ticket at
    this.eventInfoArr.push({
      "name": "Buy Ticket At",
      "data": data["url"]
    })

    // seat map
    if(data["seatmap"]){
      this.eventInfoArr.push({
        "name": "Seat Map",
        "data": data["seatmap"]["staticUrl"]
      })
    }
    this.data.setEventInfo(this.eventInfoArr)
  }

  setVenueInfo(data:Object){

    this.lat = Number(data['location']['latitude']);
    this.lng = Number(data['location']['longitude']);
    this.data.setLocation({
      "lat": this.lat,
      "lng": this.lng
    })

    //address
    if(data["address"]){
      this.venueInfoArr.push({
        "name":"Address",
        "data": data["address"]["line1"]
      });
    }

    //city
    if(data["city"] && data["state"]){
      this.venueInfoArr.push({
        "name":"City",
        "data": data["city"]["name"] + ', ' + data["state"]["name"]
      });
    }


    if(data["boxOfficeInfo"]){
      // phone number
      if(data["boxOfficeInfo"]["phoneNumberDetail"]){
        this.venueInfoArr.push({
          "name":"Phone Number",
          "data": data["boxOfficeInfo"]["phoneNumberDetail"]
        });
      }

      // open hours
      if(data["boxOfficeInfo"]["openHoursDetail"]){
        this.venueInfoArr.push({
          "name":"Open Hours",
          "data": data["boxOfficeInfo"]["openHoursDetail"]
        });
      }
    }


    if(data["generalInfo"]){
      // general rule
      if(data["generalInfo"]["generalRule"]){
        this.venueInfoArr.push({
          "name":"General Rule",
          "data": data["generalInfo"]["generalRule"]
        });
      }

      //child rule
      if(data["generalInfo"]["childRule"]){
        this.venueInfoArr.push({
          "name":"Child Rule",
          "data": data["generalInfo"]["childRule"]
        });
      }
    }
    this.data.setVenueInfo(this.venueInfoArr)
  }


  toggleMore(){
    if(this.showMore == true){
      setTimeout(()=>{
        this.showMore = !this.showMore
      }, 500)
      this.fadeOut = false;
    }
    else{
      this.showMore = !this.showMore;
      this.fadeOut = true;
    }
  }

  favorite(event:Object){
    console.log(this.toggle)
    if(this.isFavorite == false){
      localStorage.setItem(event["id"].toString(), JSON.stringify(event));
      for(let i =0; i < localStorage.length; i++){
        console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    }

    if(this.isFavorite == true){
      localStorage.removeItem(event["id"].toString())
      for(let i =0; i < localStorage.length; i++){
        console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    }

    this.isFavorite = !this.isFavorite;
  }


}
