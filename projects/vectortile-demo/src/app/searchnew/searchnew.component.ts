import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-searchnew',
  imports: [],
  templateUrl: './searchnew.component.html',
  styleUrl: './searchnew.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  encapsulation: ViewEncapsulation.None


})
export class SearchnewComponent {
  @Output() activeSearchText = new EventEmitter<string>();





  handleactiveSearchText(event: Event): void {


    console.log("active text")
    const csevent = event as CustomEvent
    const searchText = csevent.detail
    console.log(searchText)
    this.activeSearchText.emit(searchText)


  }



}
