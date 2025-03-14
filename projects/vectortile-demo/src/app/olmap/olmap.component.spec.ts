import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Visualisatie } from '../enumVisualisatie';
import { LocalStorageService } from '../local-storage-service';
import { OlmapComponent } from './olmap.component';


describe('OlmapComponent', () => {
  let component: OlmapComponent;
  let fixture: ComponentFixture<OlmapComponent>;
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OlmapComponent],
      imports: [HttpClientModule],
      providers: [LocalStorageService]
    }).compileComponents();

    fixture = TestBed.createComponent(OlmapComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(LocalStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit visualisation on change', () => {
    spyOn(component.titelEmit, 'emit');
    component.visualisation = Visualisatie.BGTachtergrond;
    component.visualisationRefresh()
    expect(component.titelEmit.emit).toHaveBeenCalledWith(Visualisatie.BGTachtergrond);
  });

  it('should get tileurlCustomZoom', () => {
    spyOn(localStorageService, 'get').and.returnValue('5');
    expect(component.tileurlCustomMinZoom).toBe(5);
  });



  it('should initialize map with correct view and layers', () => {
    expect(component.map1.getView().getZoom()).toBe(component.zoom);
    expect(component.map1.getLayers().getArray()).toContain(component.vectorTileLayerRD);
  });



  it('should handle empty custom URL', () => {
    spyOn(localStorageService, 'get').and.returnValue('');
    expect(component.tileurlCustom).toBeUndefined();
  });

  it('should handle changes in visualisation input', () => {
    component.visualisation = Visualisatie.BGTachtergrond;
    expect(component[ 'SelectedVisualisation']).toBe(Visualisatie.BGTachtergrond);
  });



  it('should interact with map correctly', () => {
    const newLayer = new VectorTileLayer();
    component.map1.addLayer(newLayer);
    expect(component.map1.getLayers().getArray()).toContain(newLayer);
  });



});
