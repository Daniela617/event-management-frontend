import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from './event-component.service';
import { Event } from './event-component';
import { CityService } from './services/city.service';

/**
 * @class FormComponent
 * @description Component for creating and updating events.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{

  /**
  * @property event
  * @type {Event}
  * @description The event object to be created or updated.
  */
  public event: Event = new Event();
  /**
   * @property titulo
   * @type {string}
   * @description The title of the form, indicating whether it's for creating or updating an event.
   */
  public titulo: string = 'Formulario evento';

  /**
   * @property errores
   * @type {string[]}
   * @description Array of error messages to display to the user.
   */
  public errores: string[] = [];

  /**
   * @property cities
   * @type {string[]}
   * @description Array of city names loaded from the CityService.
   */
  public cities: string[] = [];

  /**
   * @constructor
   * @param {EventService} objEventService - Service for managing events.
   * @param {CityService} cityService - Service for managing cities.
   * @param {Router} router - Angular's Router for navigation.
   * @param {ActivatedRoute} activatedRoute - Angular's ActivatedRoute for accessing route parameters.
   */
  constructor(
    private objEventService: EventService,
    private cityService: CityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  /**
   * @method ngOnInit
   * @description Lifecycle hook called after data-bound properties are initialized.
   * Fetches the event details and loads the list of cities.
   */
  ngOnInit(): void {
    this.getEvent();
    this.loadCities();
  }

  /**
   * @private method getEvent
   * @description Retrieves the event details from the EventService based on the route parameter 'id'.
   * If an 'id' is present, it fetches the event; otherwise, it initializes a new event.
   */
  private getEvent():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
          this.objEventService.getEvent(id).subscribe((event: Event | null) => {
              if (event) {
                  this.event = event;
              } else {
                  console.log(`Event with id ${id} not found.`);
              }
          });
      }
  });
  }

  /**
   * @private method formatDate
   * @description Formats a date object into a string in 'YYYY-MM-DD HH:MM:SS' format.
   * @param {any} date - The date object to format.
   * @returns {string} The formatted date string.
   */
  private formatDate(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    return d.getFullYear() + '-' +
           ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
           ('0' + d.getDate()).slice(-2) + ' ' +
           ('0' + d.getHours()).slice(-2) + ':' +
           ('0' + d.getMinutes()).slice(-2) + ':' +
           ('0' + d.getSeconds()).slice(-2);
  }

  /**
   * @private method loadCities
   * @description Loads the list of cities from the CityService and maps them to an array of city names.
   */
  private loadCities(): void {
    this.cityService.getCities().subscribe(data => {
      this.cities = data.map(city => city.municipio);
    });
  }

  /**
   * @method goBack
   * @description Navigates back to the events list.
   */
  goBack(): void {
    this.router.navigate(['/events']);
  }
  /**
   * @method createEvent
   * @description Creates a new event using the EventService.
   * Formats the event's dateTime before sending it to the service.
   * Displays a success message or error messages using SweetAlert.
   */
  public createEvent():void{
    this.validateEmptyFields()
    if (this.errores.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        html: `<ul>Completa los campos requeridos</ul>`,
        confirmButtonText: 'Entendido'
      });
      return;
    }
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

  /**
   * @method updateEvent
   * @description Updates an existing event using the EventService.
   * Displays a success message or error messages using SweetAlert.
   */
  public updateEvent():void{
    this.validateEmptyFields()
    if (this.errores.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        html: `<ul>Completa los campos requeridos</ul>`,
        confirmButtonText: 'Entendido'
      });
      return;
    }
    this.objEventService.editEvent(this.event).subscribe(
      event => {
        this.router.navigate(['/events']);
        Swal.fire('Evento editado', `Evento actualizado con éxito!`, 'success');

      },
      err => {
        console.log(this.event)
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }
  public validateEmptyFields():void{
    this.errores = [];

    if (!this.event.title || this.event.title.length < 4) {
      this.errores.push("El título es obligatorio y debe tener al menos 4 caracteres.");
    }

    if (!this.event.dateTime) {
      this.errores.push("La fecha y hora son obligatorias.");
    }

    if (!this.event.description || this.event.description.length < 5) {
      this.errores.push("La descripción es obligatoria y debe tener al menos 5 caracteres.");
    }

    if (!this.event.location) {
      this.errores.push("Debe seleccionar una ubicación.");
    }


  }
}
