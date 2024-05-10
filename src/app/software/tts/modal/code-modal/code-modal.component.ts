import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

@Component({
  selector: 'app-code-modal',
  standalone: true,
  imports: [
    NzCodeEditorModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './code-modal.component.html',
  styleUrl: './code-modal.component.scss'
})
export class CodeModalComponent {

  code = ''

}
