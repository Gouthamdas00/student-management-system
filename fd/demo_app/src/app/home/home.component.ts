import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // 1. Import RouterLink

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // 2. Add it to the imports array
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent { }