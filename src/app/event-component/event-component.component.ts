import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from './event-component.service';
import { Event } from './event-component';
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
    this.router.navigate(['event/form']);
  }

  deleteEvent(id:number){
    this.router.navigate(['event/form']);
  }
}
