import {Component, Input} from '@angular/core';

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
