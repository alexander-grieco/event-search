import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {interval} from 'rxjs'
import { debounceTime, map } from 'rxjs/operators';
import { noSpacesValidator } from '../shared/no-spaces.directive';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  geoLoc: Object = undefined;
  enableInput = false;
  inputForm: FormGroup;
  // searchInfo:Object;
  myControl = new FormControl();
  options: string[];

  constructor(private data: DataService, private formBuilder:FormBuilder) { 
    this.inputForm = this.formBuilder.group({
      keyword:new FormControl('', [
        Validators.required,
        noSpacesValidator(/^\s+$/i)
      ]),
      category:new FormControl('all'),
      radius:new FormControl(''),
      unit:new FormControl('miles'),
      location:new FormControl('current'),
      otherOne:new FormControl('', [
        Validators.required,
        noSpacesValidator(/^\s+$/i)
      ])
    });

   }
  


  ngOnInit(){
    // this.data.isSubmit.subscribe(message => this.searchInfo = message)
    this.data.getLocation().subscribe(data => {
      this.geoLoc = data
      // console.log(data);
      }
    );

    this.inputForm.controls["keyword"].valueChanges.pipe(debounceTime(300)).subscribe(
      phrase => {
      if(!this.inputForm.controls["keyword"].invalid){
          this.data.autocomplete(phrase).subscribe(
            dataList => {
              this.options = dataList as string[];
            }
          )
        }
        else{
          this.options = [];
        }
      }
    )

  }

  onClick(){
    // this.geoLoc = undefined;
    this.enableInput = !this.enableInput;
    // if(!this.enableInput){
    //   this.data.getLocation().subscribe(data => {
    //     this.geoLoc = data
    //     }
    //   );
    // }
  }

  onSubmit(){
    this.inputForm.value.category = (this.inputForm.value.category == null) ? "all" : this.inputForm.value.category;
    this.inputForm.value.radius = ((this.inputForm.value.radius == null) || (this.inputForm.value.radius == '')) ? 10: this.inputForm.value.radius;
    this.inputForm.value.unit = (this.inputForm.value.unit == null) ? "miles" : this.inputForm.value.unit;
    this.inputForm.value.location = (this.inputForm.value.location == null) ? "current" : this.inputForm.value.location;
    this.data.setToggleFav(true);
    this.data.setSubmit(true);
    this.data.doSearch(this.inputForm.value, this.geoLoc).subscribe(data => {
      this.data.setInfo(data);
      // console.log(data);

    })
  }

  onClear(){
    this.data.setInfo({});
    this.data.setEventId('');
    this.data.setEventFavId('');
    this.data.setSubmit(false);
    this.data.setChanged(true);
    this.data.setAllInfo({
      "eventInfo":null,
      "venueInfo":null,
      "spotifyInfo":[],
      "songkickInfo":null,
      "imageInfo":[]
    })
    this.data.setToggleFav(true);
  }
  

}
