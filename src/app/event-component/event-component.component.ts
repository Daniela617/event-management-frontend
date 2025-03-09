import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from './event-component.service';
import { Event } from './event-component';
import Swal from 'sweetalert2';

/**
 * @class EventComponentComponent
 * @description Manages the display and interaction of events in a list.
 */
@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent implements OnInit{

  /**
   * @property eventsList
   * @type {Event[]}
   * @description Array containing the list of events.
   */
  public eventsList: Event[]= [];

  /**
   * @property errorMessage
   * @type {string}
   * @description Stores the error message to display to the user.
   */
  errorMessage: string = '';

  /**
   * @constructor
   * @param {EventService} objEventService - Service for managing events.
   * @param {Router} router - Angular's Router for navigation.
   */
  constructor(private objEventService:EventService,private router:Router) { }

  /**
   * @method ngOnInit
   * @description Lifecycle hook called after data-bound properties are initialized. Fetches events on initialization.
   */
  ngOnInit(): void {
    this.getEvents();
  }

  /**
   * @method getEvents
   * @description Fetches the list of events from the EventService and updates the component's eventsList.
   * Handles errors by setting the errorMessage property.
   */
  getEvents():void{
    this.objEventService.getEvents().subscribe(
      eventsList => {
        this.eventsList = eventsList;
        this.errorMessage = '';
      },
      error => {
        this.errorMessage = 'Error fetching events. Please try again.'; // Asegúrate de que este mensaje coincida con el test
      }
    );
  }

  /**
   * @method createEvent
   * @description Navigates to the event creation form.
   */
  createEvent(){
    this.router.navigate(['event/form']);
  }

  /**
   * @method editEvent
   * @description Navigates to the event edit form with the specified event's ID.
   * @param {Event} event - The event to be edited.
   */
  editEvent(event: Event){
    this.router.navigate(['/event/form', event.id]);
  }

  /**
   * @method deleteEvent
   * @description Deletes an event after confirmation from the user using SweetAlert.
   * @param {Event} event - The event to be deleted.
   */
  deleteEvent(event:Event): void
  {
    Swal.fire({
      title: '¿Está seguro?',
      text:'¿Seguro que quiere eliminar el evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor:'#308d6',
      cancelButtonColor:'#d33',
      buttonsStyling: false,
      reverseButtons:true,
      customClass: {
        confirmButton: 'btn btn-success px-4 py-2 mx-2',
        cancelButton: 'btn btn-danger px-4 py-2 mx-2'
      }

    }).then((result) =>
    {
      if(result.isConfirmed){
        this.objEventService.deleteEvent(event.id).subscribe(
          response => {
            this.eventsList = this.eventsList.filter(e => e !== event)
            Swal.fire(
              'Evento eliminado!',
              `Evento ${event.title} eliminado con éxito`,
              'success'
            );
            this.errorMessage = '';
          },
          error => {
            this.errorMessage = 'Error deleting event. Please try again.'; // Establece el mensaje de error
            Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
          }
        )
      }
    })
  }
}
