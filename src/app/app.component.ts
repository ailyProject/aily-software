import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzMessageModule } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NzMessageModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'aily-software';
}
