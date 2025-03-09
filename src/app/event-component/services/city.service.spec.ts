import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CityService } from './city.service';

const API_URL = 'https://www.datos.gov.co/resource/xdk5-pm3f.json';

describe('CityService', () => {
  let service: CityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CityService]
    });
    service = TestBed.inject(CityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Given an API with city data,
   * When getCities is called,
   * Then it should retrieve a list of cities.
   */
  it('should retrieve a list of cities', () => {
    const mockCities = [
      { name: 'Bogotá', population: 8000000 },
      { name: 'Medellín', population: 2500000 }
    ];

    service.getCities().subscribe(cities => {
      expect(cities.length).toBe(2);
      expect(cities).toEqual(mockCities);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockCities);
  });

  /**
   * Given an API request,
   * When the server returns an error,
   * Then it should handle the error response.
   */
  it('should handle an error response', () => {
    service.getCities().subscribe(
      () => fail('Expected an error, but got a response'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });
});
