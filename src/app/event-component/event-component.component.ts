import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from './event-component.service';
import { Event } from './event-component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.css']
})
export class EventComponentComponent implements OnInit{
  public eventsList: Event[]= [];
  constructor(private objEventService:EventService,private router:Router) { }
  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(){
    this.objEventService.getEvents().subscribe(
      eventsList => this.eventsList = eventsList
    );
  }

  createEvent(){
    this.router.navigate(['event/form']);
  }

  editEvent(event: Event){
    this.router.navigate(['/event/form', event.id]);
  }

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
            )
          }
        )
      }
    })
  }
}
