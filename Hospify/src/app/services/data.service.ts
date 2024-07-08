import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  executeQuery(query: string): Observable<any> {
    console.log("SQL Query: \n" + query);
    return this.http.post<any>(`${this.apiUrl}/executeQuery`, { query: query });
  }

  executeInsert(query: string): Observable<any> {
    console.log("SQL Insert Query: \n" + query);
    const res = this.http.post<any>(`${this.apiUrl}/executeInsert`, { query: query});
    console.log(res);
    return res;
  }
}
