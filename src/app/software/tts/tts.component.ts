import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CodeModalComponent } from './modal/code-modal/code-modal.component';
import { MarkdownComponent } from '../../component/markdown/markdown.component';

@Component({
  selector: 'app-tts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzStepsModule,
    NzInputNumberModule,
    NzInputModule,
    NzButtonModule,
    NzModalModule,
    MarkdownComponent
  ],
  templateUrl: './tts.component.html',
  styleUrl: './tts.component.scss'
})
export class TtsComponent {
  constructor(
    private modalService: NzModalService
  ) { }

  volume = 5;
  speed = 5;
  pitch = 5;
  customText = '';

  HexString = '';


  openCodeModal(lang) {
    this.modalService.create({
      nzTitle: 'Code',
      nzContent: CodeModalComponent,
      nzFooter: null,
      
    });
  }

}
