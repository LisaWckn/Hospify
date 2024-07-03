import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-new-operation',
  templateUrl: './new-operation.component.html',
  styleUrl: './new-operation.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewOperationComponent {

}
