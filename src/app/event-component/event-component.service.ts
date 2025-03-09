import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { of } from 'rxjs';
import { Event } from './event-component';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8080/api/events';
const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * @class EventService
 * @description Provides methods to interact with event data from the backend API.
 */
@Injectable()
export class EventService {
  /**
   * @constructor
   * @param {HttpClient} http - Angular's HttpClient for making HTTP requests.
   */
  constructor(private http:HttpClient) { }

  /**
   * @method getEvents
   * @description Retrieves a list of events from the backend API.
   * @returns {Observable<Event[]>} An Observable that emits an array of Event objects.
   */
  getEvents():Observable<Event[]>{
    return this.http.get<Event[]>(API_URL);
  }

  /**
   * @method getEvent
   * @description Retrieves a single event by ID from the backend API.
   * @param {number} id - The ID of the event to retrieve.
   * @returns {Observable<Event | null>} An Observable that emits an Event object or null if not found.
   */
  getEvent(id:number):Observable<Event | null>{
    return this.http.get<Event>(`${API_URL}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * @method createEvent
   * @description Creates a new event via POST request to the backend API.
   * @param {Event} event - The Event object to create.
   * @returns {Observable<Event>} An Observable that emits the created Event object.
   */
  createEvent(event: Event) : Observable<Event> {

    return this.http.post<Event>(API_URL, event, HTTP_OPTIONS).pipe(
    catchError(
      e => {

        if (e.status == 400) {
          return throwError(e);
        }
        console.log(e.error.mensaje);
        Swal.fire('Error, Create event', e.error.mensaje, 'error');
        return throwError(e);
    })
    );

  }

  /**
   * @method editEvent
   * @description Updates an existing event via PUT request to the backend API.
   * @param {Event} event - The Event object to update.
   * @returns {Observable<Event>} An Observable that emits the updated Event object.
   */
  editEvent(event: Event) : Observable<Event> {

    return this.http.put<Event>(`${API_URL}/${event.id}`, event, HTTP_OPTIONS).pipe(
    catchError(
      e => {

        if (e.status == 400) {
          return throwError(e);
        }
        console.log(e.error.mensaje);
        Swal.fire('Error, No se pudo editar el evento', e.error.mensaje, 'error');
        return throwError(e);
    })
    );

  }

  /**
   * @method deleteEvent
   * @description Deletes an event by ID via DELETE request to the backend API.
   * @param {number} id - The ID of the event to delete.
   * @returns {Observable<Event>} An Observable that emits the deleted Event object.
   */
  deleteEvent(id: number) : Observable<Event> {

    return this.http.delete<Event>(`${API_URL}/${id}`, HTTP_OPTIONS).pipe(
      catchError(
        e => {
          if (e.status == 400) {
            return throwError(e);
          }
          console.log(e.error.mensaje);
          Swal.fire('Error, No se pudo eliminar el evento', e.error.mensaje, 'error');
          return throwError(e);
      })
    );
  }
}
