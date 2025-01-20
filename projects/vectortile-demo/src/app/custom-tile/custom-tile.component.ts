import { Component, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Visualisatie } from '../enumVisualisatie'
import { LocalStorageService, storageKey } from '../local-storage-service'
import { MatSlideToggle } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-custom-tile',
  standalone: true,

  imports: [FormsModule, ReactiveFormsModule, MatSlideToggle],
  templateUrl: './custom-tile.component.html',
  styleUrl: './custom-tile.component.scss'
})
export class CustomTileComponent {

  @Output() visEmit: EventEmitter<Visualisatie> = new EventEmitter();
  @Output() gridEmit: EventEmitter<boolean> = new EventEmitter();

  customtForm: FormGroup

  constructor(private formBuilder: FormBuilder, private localStorageService: LocalStorageService) {
    this.customtForm = this.formBuilder.group({
      customUrl: new FormControl(this.getLocalStorageValue('customUrl')),
      customUrlExtension: new FormControl(this.getLocalStorageValue('customUrlExtension')),
      customUrlxyzTemplate: new FormControl(this.getLocalStorageValue('customUrlxyzTemplate')),
      customUrlMinZoom: new FormControl(this.getLocalStorageValue('customUrlMinZoom')),
      showDebugLayer: new FormControl(this.getLocalStorageValue('showDebugLayer')),
      customTileMatrixPart: new FormControl(this.getLocalStorageValue('customTileMatrixPart'))
    })
  }

  private getLocalStorageValue(key: storageKey): string | boolean {
    return this.localStorageService.Exists(key) ? this.localStorageService.get(key) : ''
  }

  onSubmit() {
    const { customUrl, customTileMatrixPart, customUrlExtension, customUrlxyzTemplate, customUrlMinZoom, showDebugLayer } = this.customtForm.value
    this.localStorageService.set({ key: 'customUrl', value: customUrl })
    this.localStorageService.set({ key: 'customTileMatrixPart', value: customTileMatrixPart })
    this.localStorageService.set({ key: 'customUrlExtension', value: customUrlExtension })
    this.localStorageService.set({ key: 'customUrlxyzTemplate', value: customUrlxyzTemplate })
    this.localStorageService.set({ key: 'customUrlMinZoom', value: customUrlMinZoom })
    this.localStorageService.set({ key: 'showDebugLayer', value: showDebugLayer })

    this.visEmit.emit(Visualisatie.Custom1Blanko)
  }

  showDebugLayer() {

    const { customUrl, customTileMatrixPart, customUrlExtension, customUrlxyzTemplate, customUrlMinZoom, showDebugLayer } = this.customtForm.value
    this.localStorageService.set({ key: 'showDebugLayer', value: showDebugLayer })
    this.gridEmit.emit()



  }

  onReset() {
    this.localStorageService.removeAll()
    this.customtForm.reset()
    this.visEmit.emit(Visualisatie.BGTachtergrond)
  }
}

