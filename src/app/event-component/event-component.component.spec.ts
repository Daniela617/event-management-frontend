import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventService } from './event-component.service';
import { EventComponentComponent } from './event-component.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal, {SweetAlertResult} from 'sweetalert2';
import { Event } from './event-component';
describe('EventComponentComponent', () => {
  let component: EventComponentComponent;
  let fixture: ComponentFixture<EventComponentComponent>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockEventService = jasmine.createSpyObj('EventService', ['getEvents', 'deleteEvent']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EventComponentComponent],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventComponentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Given an API with events,
   * When getEvents is called,
   * Then it should retrieve all events.
   */
  it('should retrieve a list of events on init', () => {
    const mockEvents: Event[] = [
      { id: 1, title: 'Event 1', dateTime: '2024-03-09T12:00:00Z', description: 'Desc 1', location: 'Loc 1' },
      { id: 2, title: 'Event 2', dateTime: '2024-03-10T14:00:00Z', description: 'Desc 2', location: 'Loc 2' }
    ];
    mockEventService.getEvents.and.returnValue(of(mockEvents));
    component.ngOnInit();
    expect(component.eventsList.length).toBe(2);
    expect(component.eventsList).toEqual(mockEvents);
  });

  /**
   * Given a user wants to create an event,
   * When createEvent is called,
   * Then it should navigate to the event form.
   */
  it('should navigate to create event page', () => {
    component.createEvent();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['event/form']);
  });

  /**
   * Given a user wants to edit an event,
   * When editEvent is called,
   * Then it should navigate to the event edit page.
   */
  it('should navigate to edit event page', () => {
    const event: Event = { id: 1, title: 'Event 1', dateTime: '2024-03-09T12:00:00Z', description: 'Desc 1', location: 'Loc 1' };
    component.editEvent(event);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/event/form', event.id]);
  });

  /**
   * Given a user wants to delete an event,
   * When deleteEvent is confirmed,
   * Then it should remove the event from the list.
   */
  it('should delete an event when confirmed', async () => {
    const event: Event = { id: 1, title: 'Event 1', dateTime: '2024-03-09T12:00:00Z', description: 'Desc 1', location: 'Loc 1' };
    component.eventsList = [event];
    mockEventService.deleteEvent.and.returnValue(of({} as Event));

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve<SweetAlertResult<any>>({ isConfirmed: true, isDenied: false, isDismissed: false }));

    await component.deleteEvent(event);
    expect(mockEventService.deleteEvent).toHaveBeenCalledWith(event.id);
    expect(component.eventsList.length).toBe(0);
  });

  /**
   * Given a failing API call to get events,
   * When getEvents is called,
   * Then it should handle the error gracefully.
   */
  it('should handle error when retrieving events', () => {
    mockEventService.getEvents.and.returnValue(throwError(() => new Error('API error')));
    component.getEvents();
    expect(component.errorMessage).toBe('Error fetching events. Please try again.');
  });

  /**
   * Given a failing API call to delete an event,
   * When deleteEvent is called and confirmed,
   * Then it should handle the error gracefully.
   */
  it('should handle error when deleting an event', async () => {
    const event: Event = { id: 1, title: 'Event 1', dateTime: '2024-03-09T12:00:00Z', description: 'Desc 1', location: 'Loc 1' };
    component.eventsList = [event];
    mockEventService.deleteEvent.and.returnValue(throwError(() => new Error('Delete error')));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve<SweetAlertResult<any>>({ isConfirmed: true, isDenied: false, isDismissed: false }));

    await component.deleteEvent(event);
    expect(mockEventService.deleteEvent).toHaveBeenCalledWith(event.id);
    expect(component.eventsList.length).toBe(1);
    expect(component.errorMessage).toBe('Error deleting event. Please try again.');


  });

});
