import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { of } from 'rxjs';
import { Event } from './event-component';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable()
export class EventService {
  private urlEndPoint: string = 'http://localhost:8080/api/events';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http:HttpClient) { }

  getEvents():Observable<Event[]>{
    return this.http.get<Event[]>(this.urlEndPoint);
  }

  getEvent(id:number):Observable<Event | null>{
    return this.http.get<Event>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }
        return throwError(() => error);
      })
    );
  }

  createEvent(event: Event) : Observable<Event> {

    return this.http.post<Event>(this.urlEndPoint, event, {headers: this.httpHeaders}).pipe(
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

  editEvent(event: Event) : Observable<Event> {

    return this.http.put<Event>(`${this.urlEndPoint}/${event.id}`, event, {headers: this.httpHeaders}).pipe(
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
  deleteEvent(id: number) : Observable<Event> {

    return this.http.delete<Event>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
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
