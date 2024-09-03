import { Component, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LocalStorageService } from '../local-storage-service'
import { Visualisatie } from '../enumVisualisatie'

@Component({
  selector: 'app-custom-tile',
  standalone: true,

  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './custom-tile.component.html',
  styleUrl: './custom-tile.component.scss'
})
export class CustomTileComponent {
  @Output() visEmit: EventEmitter<Visualisatie> = new EventEmitter();

  customtForm: FormGroup
  constructor(private formBuilder: FormBuilder, private localStorageServer: LocalStorageService) {
    const customUrl = this.localStorageServer.Exists('customUrl')
      ? this.localStorageServer.get('customUrl')
      : ''
    const customUrlExtension = this.localStorageServer.Exists('customUrlExtension')
      ? this.localStorageServer.get('customUrlExtension')
      : ''

      const  customUrlMinZoom = this.localStorageServer.Exists('customUrlMinZoom')
      ? this.localStorageServer.get('customUrlMinZoom')
      : ''

     
    this.customtForm = this.formBuilder.group({
      customUrl: new FormControl(customUrl),
      customUrlExtension: new FormControl(customUrlExtension), 
      customUrlMinZoom: new FormControl(customUrlMinZoom)

    })

  }
  onSubmit() {
    // Handle form submission here
    console.log(this.customtForm.value.customUrl)
    this.localStorageServer.set({ key: "customUrl", value: this.customtForm.value.customUrl })
    this.localStorageServer.set({ key: "customUrlExtension", value: this.customtForm.value.customUrlExtension })
    this.localStorageServer.set({ key: "customUrlMinZoom", value: this.customtForm.value.customUrlMinZoom})
    this.visEmit.emit(Visualisatie.Custom1Blanko)

  }

  onReset() {
    this.localStorageServer.remove("customUrl")
    this.localStorageServer.remove("customUrlExtension")
    this.localStorageServer.remove("customUrlMinZoom")
    this.customtForm.reset()
    this.visEmit.emit(Visualisatie.BGTachtergrond)
  }
}

