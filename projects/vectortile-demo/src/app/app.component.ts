
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Visualisatie, getAllVisualisaties } from './enumVisualisatie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})


export class AppComponent implements OnInit {
  enumFromValue = <T extends Record<string, string>>(val: string, _enum: T, errormessage: string = `${val} not in enum`) => {
    const enumName = (Object.keys(_enum) as Array<keyof T>).find(k => _enum[k] === val);
    if (!enumName)
      throw new Error(errormessage)
    return _enum[enumName];
  };

  visualisatie = getAllVisualisaties();
  currentVis = Visualisatie.BGTachtergrond
  isShow: boolean = false;

  constructor(private router: Router) {
    /* do nothing*/
  }

  ngOnInit() {
  }

  toggleShow() {
    this.isShow = !this.isShow;
    this.visualisatie = getAllVisualisaties();

  }

  receiveTitle(data: Visualisatie){
    this.currentVis = data; 
    
     
  }

  onSelect(vis: Visualisatie): void {
    this.currentVis = vis;
    this.isShow = false;
  
  }



}
