import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-showlink',
    templateUrl: './showlink.component.html',
    styleUrls: ['./showlink.component.scss'],
    
})
export class ShowlinkComponent {
  @Input() url = "https://www.pdok.nl"



openurl()
{
  window.open(this.url, '_blank'); 

}
}

