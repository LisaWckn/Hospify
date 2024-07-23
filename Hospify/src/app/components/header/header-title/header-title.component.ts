import { Component } from '@angular/core';

/**
 * `HeaderTitleComponent` ist eine Angular-Komponente, die einen Header-Titel anzeigt.
 *
 * @component
 * @selector app-header-title
 * @templateUrl ./header-title.component.html
 * @styleUrls ./header-title.component.css
 */
@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html',
  styleUrl: './header-title.component.css'
})
export class HeaderTitleComponent {
  title = "Hos"
  title2 = "pify"
}
