import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:3000/query';

  constructor(private http: HttpClient) { }

  executeQuery(query: string): Observable<any> {
    console.log("SQL Query: \n" + query);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(this.apiUrl, { query }, { headers });
  }
}
