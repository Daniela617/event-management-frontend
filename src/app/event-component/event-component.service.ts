import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { of } from 'rxjs';
import { Event } from './event-component';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable()
export class EventService {
  private urlEndPoint: string = 'http://localhost:8080/api/events';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http:HttpClient) { }

  getEvents():Observable<Event[]>{
    return this.http.get<Event[]>(this.urlEndPoint);
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
  deleteEvent(id: number) : boolean {

    return false;

  }
}
