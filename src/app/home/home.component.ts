import { Component } from '@angular/core';
import { MENU, MENU2 } from '../config/menu.config';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NzToolTipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  MENU = MENU
  MENU2 = MENU2
  title = 'aily Project'

  get path() {
    return window.location.pathname
  }

  constructor(
    private router: Router
  ) {
    this.title = MENU.find(item => item.route === this.router.url)?.title || 'aily Project'
  }


  goto(item) {
    this.title = item.title
    this.router.navigate([item.route])
  }
}
