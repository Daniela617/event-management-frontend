import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponentComponent } from './header-component/header-component.component';
import { FooterComponentComponent } from './footer-component/footer-component.component';
import { NavigationComponentComponent } from './navigation-component/navigation-component.component';
describe('AppComponent', () => {
      let component: AppComponent;
      let fixture: ComponentFixture<AppComponent>;

      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [RouterTestingModule, RouterOutlet],
          declarations: [
            AppComponent,
            HeaderComponentComponent,
            FooterComponentComponent,
            NavigationComponentComponent,
          ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
      });

      it('should create the app', () => {
        expect(component).toBeTruthy();
      });


    });
