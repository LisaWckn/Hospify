import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * Führt eine SQL-Abfrage auf dem Server aus.
   * @param query - Die SQL-Abfrage, die ausgeführt werden soll.
   * @return - Ein Observable, das die Antwort des Servers enthält. Die Antwort wird als JSON zurückgegeben
   * und kann verschiedene Ergebnisse je nach Art der Abfrage enthalten.
   */
  executeQuery(query: string): Observable<any> {
    console.log("SQL Query: \n" + query);
    return this.http.post<any>(`${this.apiUrl}/executeQuery`, { query: query });
  }

  /**
   * Führt eine SQL-Insert-Abfrage auf dem Server aus.
   * @param query - Die SQL-Insert-Abfrage, die ausgeführt werden soll.
   * @return - Ein Observable, das die Antwort des Servers enthält. Die Antwort wird als JSON zurückgegeben
   * und enthält Informationen darüber, wie viele Zeilen durch die Insert-Operation betroffen sind.
   */
  executeInsert(query: string): Observable<any> {
    console.log("SQL Insert Query: \n" + query);
    const res = this.http.post<any>(`${this.apiUrl}/executeInsert`, { query: query});
    console.log(res);
    return res;
  }
}
