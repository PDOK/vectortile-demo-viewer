import { ComponentFixture, TestBed} from '@angular/core/testing';

import { MapexportComponent } from './mapexport.component';

describe('MapexportComponent', () => {
  let component: MapexportComponent
  let fixture: ComponentFixture<MapexportComponent>

  // Set up the testing environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
     imports: [MapexportComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(MapexportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
  it('should create the MapexportComponent instance', () => {
    // fixture.detectChanges() moved to beforeEach block
  })
})
