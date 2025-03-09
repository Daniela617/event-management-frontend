import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.css']
})
export class FooterComponentComponent {
  public proyecto: any = {anio: '2025', nombreProyecto: 'Prueba técnica gestión de eventos'};
  public tecnologia: any = {leyenda: 'WebApp desarrollada con ', tec1: 'Angular ', tec2: 'SpringBoot'};
  public autor: string = 'Daniela Riascos Urrego';
}
