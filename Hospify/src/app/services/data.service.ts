import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private queryUrl = 'http://localhost:3000/query';
  private insertUrl = 'http://localhost:3000/insert';

  constructor(private http: HttpClient) { }

  executeQuery(query: string): Observable<any> {
    console.log("SQL Query: \n" + query);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(this.queryUrl, { query }, { headers });
  }

  executeInsert(query: string) {
    console.log("SQL Insert Query: \n" + query);
    const res = this.http.post<any>(this.insertUrl, { query });
    console.log(res);
  }
}
