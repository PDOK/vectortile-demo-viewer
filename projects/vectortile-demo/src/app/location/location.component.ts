import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LocationService, ViewLocation } from '../location.service';
const kaartenNLUrl= 'https://www.kaartenvannederland.nl/'
@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss'],
    
})
export class LocationComponent implements OnInit {
  location: ViewLocation;
  xy: any;
 
  kaartenNLUrl: string=kaartenNLUrl ;

  constructor(private locationService: LocationService) { 
    this.location= this.locationService.initialViewLocation; 
  }

  ngOnInit(): void {
    this.locationService.currentLocation.subscribe(currentLocation => {
      this.location= currentLocation;
      this.xy = this.location.view!.getCenter();
      const zoomlevel= this.location.view!.getZoom()!;
      const params = new HttpParams().append('geometry.x', this.xy[0]).append('geometry.y', this.xy[1]).append('zoomlevel', zoomlevel);
       
      this.kaartenNLUrl=kaartenNLUrl+ "#?"+params.toString();
       
      });
  
  
  }

}
