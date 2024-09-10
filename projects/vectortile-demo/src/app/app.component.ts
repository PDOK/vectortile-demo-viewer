import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
  Visualisatie,
  getAllVisualisaties,
  getStyleUrl,
} from './enumVisualisatie'
export const demoSettings = {
  demoVisualisatieRotate: false,
  demoLocatieRotate: false,
  previewFeature: false,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  enumFromValue = <T extends Record<string, string>>(
    val: string,
    _enum: T,
    errormessage: string = `${val} not in enum`
  ) => {
    const enumName = (Object.keys(_enum) as Array<keyof T>).find(
      (k) => _enum[k] === val
    )
    if (!enumName) throw new Error(errormessage)
    return _enum[enumName]
  };

  visualisatie = getAllVisualisaties();
  currentVis = Visualisatie.BGTachtergrond;
  isShow: boolean = false;
  styleurl!: string

  constructor(private router: Router) {
    /* do nothing*/
  }

  ngOnInit() { }

  toggleShow() {
    this.isShow = !this.isShow
    this.visualisatie = getAllVisualisaties()
  }

  receiveTitle(data: Visualisatie) {
    this.currentVis = data

    this.styleurl = getStyleUrl(this.currentVis).styleUrl!
  }

  onSelect(vis: Visualisatie): void {
    this.currentVis = vis
    this.isShow = false
  }
}
