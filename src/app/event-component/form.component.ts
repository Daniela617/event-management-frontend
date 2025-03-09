import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { EventService } from './event-component.service';
import { Event } from './event-component';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  constructor(private objEventService:EventService,private router:Router){}

  public event: Event = new Event();
  public titulo: string = 'Crear evento';
  public errores: string[] = [];
  ngOnInit(): void {
  }
  private formatDate(date: any): string {
    if (!date) return ''; // Evita errores si la fecha está vacía

    const d = new Date(date);
    return d.getFullYear() + '-' +
           ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
           ('0' + d.getDate()).slice(-2) + ' ' +
           ('0' + d.getHours()).slice(-2) + ':' +
           ('0' + d.getMinutes()).slice(-2) + ':' +
           ('0' + d.getSeconds()).slice(-2);
  }
  goBack(): void {
    this.router.navigate(['/events']); // Ajusta la ruta según tu app
  }

  public createEvent():void{
    const formattedEvent = {
      ...this.event,
      dateTime: this.formatDate(this.event.dateTime)
    };
    this.objEventService.createEvent(formattedEvent ).subscribe(
      response =>{
        this.router.navigate(['/events']);
        Swal.fire('Nuevo evento', `Evento  creado con éxito!`, 'success');
      },
      err => {
        console.log(this.event)
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }
}
