import {Component, Input} from '@angular/core';

/**
 * `IconTextComponent` ist eine Angular-Komponente, die ein Icon und Text anzeigt.
 *
 * @component
 * @selector app-icon-text
 * @templateUrl ./icon-text.component.html
 * @styleUrls ./icon-text.component.css
 */
@Component({
  selector: 'app-icon-text',
  templateUrl: './icon-text.component.html',
  styleUrl: './icon-text.component.css'
})
export class IconTextComponent {
  @Input()
  title: string = "";

  @Input()
  text: string = "";
}
