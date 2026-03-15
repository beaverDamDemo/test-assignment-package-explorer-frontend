import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackageSummary } from '../interfaces/package-summary.interface';

@Injectable({
  providedIn: 'root',
})
export class Packages {
  private readonly baseUrl = 'http://localhost:3000/packages';

  constructor(private http: HttpClient) { }

  getAll(): Observable<PackageSummary[]> {
    return this.http.get<PackageSummary[]>(this.baseUrl);
  }

  getDependencies(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${id}/dependencies`);
  }
}
