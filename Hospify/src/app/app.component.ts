import {Component} from '@angular/core';

/**
 * Hauptkomponente der Anwendung.
 * Diese Komponente dient als Root-Komponente und stellt die grundlegende Struktur der Anwendung dar.
 *
 * @Component Dekorator kennzeichnet diese Klasse als Angular-Komponente und konfiguriert die Metadaten der Komponente.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'Hospify';
}
