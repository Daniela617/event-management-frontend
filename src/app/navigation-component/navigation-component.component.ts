import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-component',
  templateUrl: './navigation-component.component.html',
  styleUrls: ['./navigation-component.component.css']
})
export class NavigationComponentComponent {
  constructor(private router:Router){
    this.router.navigate(['/events']);
  }
}
