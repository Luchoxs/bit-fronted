// src/app/services/incident.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/envimonmet';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = `${environment.apiUrl}/api/incidentes`;

  constructor(private http: HttpClient) {}

  getIncidentes(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl);
  }

  getIncidente(id: string): Observable<Incident> {
    return this.http.get<Incident>(`${this.apiUrl}/${id}`);
  }

  createIncidente(incidente: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, incidente);
  }

  updateIncidente(id: string, incidente: Incident): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, incidente);
  }

  deleteIncidente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}