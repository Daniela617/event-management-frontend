import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventService } from './event-component.service';
import { CityService } from './services/city.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormComponent } from './form.component';

// Mock services
const mockEventService = jasmine.createSpyObj('EventService', ['getEvent', 'createEvent', 'editEvent']);
const mockCityService = jasmine.createSpyObj('CityService', ['getCities']);
const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
const mockActivatedRoute = {
  params: of({ id: 1 })
};

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FormComponent],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: CityService, useValue: mockCityService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Given an API with events,
   * When getEvent is called,
   * Then it should retrieve all events.
   */
  it('should retrieve an event if ID is provided', () => {
    const mockEvent = { id: 1, title: 'Test Event', dateTime: '2024-03-09T12:00:00Z', description: 'Desc', location: 'Loc' };
    mockEventService.getEvent.and.returnValue(of(mockEvent));
    mockCityService.getCities.and.returnValue(of([{municipio: "test"}]));

    fixture.detectChanges();
    expect(component.event).toEqual(mockEvent);
  });

  /**
   * Given a user filling the form,
   * When submitting with valid data,
   * Then it should create a new event.
   */
  it('should create an event successfully', () => {
    component.event = { id: 1, title: 'Test', dateTime: '2024-03-09T12:00:00Z', description: 'Desc', location: 'Loc' };
    mockEventService.createEvent.and.returnValue(of({}));
    spyOn(Swal, 'fire');
    component.createEvent();

    expect(mockEventService.createEvent).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/events']);
    expect(Swal.fire).toHaveBeenCalledWith('Nuevo evento', 'Evento  creado con éxito!', 'success');
  });

  /**
   * Given a user filling the form,
   * When submitting with valid data,
   * Then it should update an existing event.
   */
  it('should update an event successfully', () => {
    component.event = { id: 1, title: 'Updated Event', dateTime: '2024-03-09T12:00:00Z', description: 'New Desc', location: 'New Loc' };
    mockEventService.editEvent.and.returnValue(of({}));
    spyOn(Swal, 'fire');
    component.updateEvent();

    expect(mockEventService.editEvent).toHaveBeenCalledWith(component.event);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/events']);
    expect(Swal.fire).toHaveBeenCalledWith('Evento editado', 'Evento actualizado con éxito!', 'success');
  });

  /**
   * Given an API with errors,
   * When createEvent fails,
   * Then it should store the errors in the component.
   */
  it('should handle errors when creating an event', () => {
    const errorResponse = { status: 400, error: { errors: ['Error 1', 'Error 2'] } };
    mockEventService.createEvent.and.returnValue(throwError(() => errorResponse));

    component.createEvent();
    expect(component.errores).toEqual(['Error 1', 'Error 2']);
  });

  /**
   * Given an API with cities,
   * When loadCities is called,
   * Then it should populate the cities list.
   */
  it('should load cities on initialization', () => {
    const mockCities = [{ municipio: 'City1' }, { municipio: 'City2' }];
    mockCityService.getCities.and.returnValue(of(mockCities));

    fixture.detectChanges();
    expect(component.cities).toEqual(['City1', 'City2']);
  });

  /**
   * Given a user in the form,
   * When clicking the back button,
   * Then it should navigate to the event list.
   */
  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/events']);
  });
});
