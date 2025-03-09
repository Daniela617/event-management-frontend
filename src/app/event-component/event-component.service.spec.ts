import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event-component.service';
import { Event } from './event-component';

const API_URL = 'http://localhost:8080/api/events';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

  });

  /**
   * Given an API with events,
   * When getEvents is called,
   * Then it should retrieve all events.
   */
  it('should retrieve events from the API via GET', () => {
    const mockEvents: Event[] = [
      { id: 1, title: 'Evento 1', dateTime: '2024-03-10T10:00:00', description: 'Desc 1', location: 'Lugar 1' },
      { id: 2, title: 'Evento 2', dateTime: '2024-03-11T15:00:00', description: 'Desc 2', location: 'Lugar 2' }
    ];

    service.getEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  /**
    * Given: An API with an error.
    * When:  getEvents is called.
    * Then:  It should handle the error and return the correct status.
  */
  it('should handle error when retrieving events', () => {
    service.getEvents().subscribe(
      () => fail('Expected error, but got data'),
      (error) => {
          expect(error.status).toBe(500);
      }
  );

    const req = httpMock.expectOne(API_URL);
    req.flush('Error retrieving events', { status: 500, statusText: 'Server Error' });
  });

  /**
   * Given an event ID,
   * When getEvent is called,
   * Then it should retrieve the event details.
   */
  it('should retrieve a single event by ID via GET', () => {
    const mockEvent: Event = { id: 1, title: 'Evento 1', dateTime: '2024-03-10T10:00:00', description: 'Desc 1', location: 'Lugar 1' };

    service.getEvent(1).subscribe(event => {
      expect(event).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });
  /**
    * Given: An event ID that does not exist.
    * When:  getEvent is called.
    * Then:  It should return null.
 */
  it('should return null when event is not found', () => {
    service.getEvent(999).subscribe(event => {
      expect(event).toBeNull();
    });

    const req = httpMock.expectOne(`${API_URL}/999`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });


  /**
   * Given a new event,
   * When createEvent is called,
   * Then it should send a POST request.
   */
  it('should create a new event via POST', () => {
    const newEvent: Event = { id: 3, title: 'Nuevo Evento', dateTime: '2024-03-12T18:00:00', description: 'Nueva Desc', location: 'Nuevo Lugar' };

    service.createEvent(newEvent).subscribe(event => {
      expect(event).toEqual(newEvent);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEvent);
    req.flush(newEvent);
  });
  /**
    * Given: An API with an error during event creation.
    * When:  createEvent is called.
    * Then:  It should handle the error and return the correct status.
    */
  it('should handle error when creating an event', () => {
    const newEvent: Event = { id: 3, title: 'Nuevo Evento', dateTime: '2024-03-12T18:00:00', description: 'Nueva Desc', location: 'Nuevo Lugar' };

    service.createEvent(newEvent).subscribe(
      () => fail('Expected error, but got data'),
      (error) => expect(error.status).toBe(400)
    );

    const req = httpMock.expectOne(API_URL);
    req.flush('Error creating event', { status: 400, statusText: 'Bad Request' });
  });
  /**
   * Given an updated event,
   * When editEvent is called,
   * Then it should send a PUT request.
   */
  it('should update an existing event via PUT', () => {
    const updatedEvent: Event = { id: 1, title: 'Evento Actualizado', dateTime: '2024-03-10T10:00:00', description: 'Desc Actualizada', location: 'Lugar Actualizado' };

    service.editEvent(updatedEvent).subscribe(event => {
      expect(event).toEqual(updatedEvent);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedEvent);
    req.flush(updatedEvent);
  });

  /**
   * Given an event ID,
   * When deleteEvent is called,
   * Then it should send a DELETE request.
   */
  it('should delete an event via DELETE', () => {
    service.deleteEvent(1).subscribe();
    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle error when deleting an event', () => {
    service.deleteEvent(999).subscribe(
      () => fail('Expected error, but got data'),
      (error) => {
          expect(error.status).toBe(500);
      }
  );

    const req = httpMock.expectOne(`${API_URL}/999`);
    req.flush('Error deleting event', { status: 500, statusText: 'Server Error' });
  });
});
