import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EventComponentComponent } from './event-component/event-component.component';
import { HeaderComponentComponent } from './header-component/header-component.component';
import { FooterComponentComponent } from './footer-component/footer-component.component';
import { NavigationComponentComponent } from './navigation-component/navigation-component.component';
import { FormComponent } from './event-component/form.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { EventService } from './event-component/event-component.service';
@NgModule({
  declarations: [
    AppComponent,
    EventComponentComponent,
    HeaderComponentComponent,
    FooterComponentComponent,
    NavigationComponentComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [EventService],
  bootstrap: [AppComponent]
})
export class AppModule { }
