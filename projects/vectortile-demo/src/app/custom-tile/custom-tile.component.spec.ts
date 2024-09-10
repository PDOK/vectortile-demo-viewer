import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomTileComponent } from './custom-tile.component';
import { LocalStorageService, storageKey } from '../local-storage-service';
import { Visualisatie } from '../enumVisualisatie';

describe('CustomTileComponent', () => {
  let component: CustomTileComponent;
  let fixture: ComponentFixture<CustomTileComponent>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['Exists', 'get', 'set', 'remove', 'removeAll']);

    await TestBed.configureTestingModule({
    
      imports: [CustomTileComponent, ReactiveFormsModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    }).compileComponents();

    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;

 

    localStorageService.Exists.and.callFake((key: storageKey) => key === 'customUrl'|| key === 'customUrlxyzTemplate' || 
    key === 'customUrlExtension' || key === 'customUrlMinZoom'|| key==='showDebugLayer');
    localStorageService.get.and.callFake((key: string) => {
      switch (key) {
        case 'customUrl': return 'http://example.com';
        case 'customUrlExtension': return '.json';
        case 'customUrlMinZoom': return '10';
        case 'customUrlxyzTemplate' : return 'T{z}{x}{y}'; 
        case 'showDebugLayer' : return 'True'; 
       
        default: return '';
      }
    });

    fixture = TestBed.createComponent(CustomTileComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with values from localStorage', () => {
    expect(component.customtForm.value).toEqual({
      customUrl: 'http://example.com',
      customUrlExtension: '.json',
      customUrlMinZoom: '10', 
      customUrlxyzTemplate: 'T{z}{x}{y}', 
      showDebugLayer: "True"
    });
  });

  it('should call localStorageService.set on form submit', () => {
    component.customtForm.setValue({
      customUrl: 'http://newexample.com',
      customUrlExtension: '.xml',
      customUrlxyzTemplate: 'N{z}{x}{y}', 
      customUrlMinZoom: '12', 
            showDebugLayer: "False"
    });

    component.onSubmit();

    expect(localStorageService.set).toHaveBeenCalledWith({ key: 'customUrl', value: 'http://newexample.com' });
    expect(localStorageService.set).toHaveBeenCalledWith({ key: 'customUrlExtension', value: '.xml' });
    expect(localStorageService.set).toHaveBeenCalledWith({ key: 'customUrlMinZoom', value: '12' });
    expect(localStorageService.set).toHaveBeenCalledWith({ key: 'customUrlxyzTemplate', value: 'N{z}{x}{y}' });
    expect(localStorageService.set).toHaveBeenCalledWith({ key: 'showDebugLayer', value: 'False' });
  });

  it('should emit visEmit event on form submit', () => {
    spyOn(component.visEmit, 'emit');

    component.onSubmit();

    expect(component.visEmit.emit).toHaveBeenCalledWith(Visualisatie.Custom1Blanko);
  });

  it('should reset form and call localStorageService.remove on reset', () => {
    component.onReset();

    expect(localStorageService.removeAll).toHaveBeenCalled();
    expect(component.customtForm.value).toEqual({
      customUrl: null,
      customUrlExtension: null,
      customUrlxyzTemplate: null,
      customUrlMinZoom: null, 
      showDebugLayer:null
      
    });
  });

  it('should emit visEmit event on reset', () => {
    spyOn(component.visEmit, 'emit');

    component.onReset();

    expect(component.visEmit.emit).toHaveBeenCalledWith(Visualisatie.BGTachtergrond);
  });
});