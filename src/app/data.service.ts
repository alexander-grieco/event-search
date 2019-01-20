import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // searchUrl = 'http://cs571hw8-env.pwmbgr7wws.us-west-1.elasticbeanstalk.com/';
  searchUrl = '/posts/'
  
  private formSubmit = new BehaviorSubject<Object>({});
  isSubmit = this.formSubmit.asObservable();

  private toggleBtn = new BehaviorSubject<Object>({});
  toggle = this.toggleBtn.asObservable();

  private toggleFavBtn = new BehaviorSubject<boolean>(true);
  toggleFav = this.toggleFavBtn.asObservable();

  private searchSubmit = new BehaviorSubject<boolean>(false);
  search = this.searchSubmit.asObservable();

  private eventIdSubmit = new BehaviorSubject<string>('');
  eventId = this.eventIdSubmit.asObservable();

  private eventIdFavSubmit = new BehaviorSubject<string>('');
  eventIdFav = this.eventIdFavSubmit.asObservable();

  private eventInfoDetails = new BehaviorSubject<Array<object>>([]);
  eventInfo = this.eventInfoDetails.asObservable();

  private venueInfoDetails = new BehaviorSubject<Array<Object>>([]);
  venueInfo = this.venueInfoDetails.asObservable();

  private locationDetails = new BehaviorSubject<Object>({});
  location = this.locationDetails.asObservable();

  private nameSubmit = new BehaviorSubject<object>({
    "name":null,
    "venue":null,
    "url":null
  });
  nameVenueUrl = this.nameSubmit.asObservable();

  private changeOnSubmit = new BehaviorSubject<boolean>(true);
  changed = this.changeOnSubmit.asObservable();

  private allInfoSubmit = new BehaviorSubject<Object>({
    "eventInfo":null,
    "venueInfo":null,
    "spotifyInfo":[],
    "songkickInfo":null,
    "imageInfo":[]
  });
  allInfo = this.allInfoSubmit.asObservable();


  constructor(private http: HttpClient) { }
  
  getLocation(){
    return this.http.get("http://ip-api.com/json");
  }

  setInfo(submitted: Object) {
    return this.formSubmit.next(submitted);
  }

  setToggle(toggle: Object) {
    return this.toggleBtn.next(toggle);
  }

  setEventId(eventId: string){
    return this.eventIdSubmit.next(eventId);
  }

  setEventFavId(eventId: string){
    return this.eventIdFavSubmit.next(eventId);
  }

  setToggleFav(isFav: boolean){
    return this.toggleFavBtn.next(isFav);
  }

  setSubmit(submitted: boolean){
    return this.searchSubmit.next(submitted);
  }

  setEventInfo(eventInfo:Array<Object>){
    return this.eventInfoDetails.next(eventInfo);
  }

  setVenueInfo(venueInfo:Array<Object>){
    return this.venueInfoDetails.next(venueInfo);
  }

  setLocation(location:Object){
    return this.locationDetails.next(location);
  }

  setName(nameVenueUrl: object){
    return this.nameSubmit.next(nameVenueUrl);
  }

  setChanged(changed:boolean){
    return this.changeOnSubmit.next(changed);
  }

  setAllInfo(submitted:Object){
    return this.allInfoSubmit.next(submitted);
  }

  doSearch(info:Object, geoLoc:Object){
    let keyword = info["keyword"];
    let category =  info["category"];
    let radius = (info["radius"] == '') ? 10: info["radius"];
    let unit = info["unit"];
    let lat = geoLoc["lat"];
    let long = geoLoc["lon"];
    let location = info["location"];

    if(location != "current"){
      let otherLoc = info["otherOne"]
      return this.http.get(this.searchUrl + "otherloc/" + keyword + "/" + category + "/" + radius + '/' + unit + "/" + otherLoc);
    }
    else{
      return this.http.get(this.searchUrl + "ticketmaster/" + keyword + "/" + category + "/" + radius + '/' + unit + "/" + lat + "/" + long);
    }
  }
   


  autocomplete(input:String){
    let suggestions = this.http.get(this.searchUrl + "autocomplete/" + input)
    .pipe(
      map(
        (data: any) => {
          return (
            data._embedded != undefined ? data._embedded.attractions as any[] : []
          );
        }
    ));
    return suggestions;
  }
    
  getEventInfo(id:Object){
    return this.http.get(this.searchUrl + "eventInfo/" + id);
  }

  getVenueInfo(venue:Object){
    return this.http.get(this.searchUrl + "venueInfo/" + venue);
  }

  getSpotify(keyword:Object){
    return this.http.get(this.searchUrl + "spotify/" + keyword);
  }

  getImages(keyword:Object){
    return this.http.get(this.searchUrl + "images/" + keyword);
  }

  getSongkick(venue:Object){
    return this.http.get(this.searchUrl + "songkick/" + venue);
  }



}
