import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://www.datos.gov.co/resource/xdk5-pm3f.json';

/**
 * @class CityService
 * @description Provides methods to interact with city data from an external API.
 */
@Injectable({
  providedIn: 'root'
})
export class CityService {
  /**
   * @constructor
   * @param {HttpClient} http - Angular's HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method getCities
   * @description Retrieves a list of cities from the external API.
   * @returns {Observable<any[]>} An Observable that emits an array of city data.
   */
  getCities(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }
}
