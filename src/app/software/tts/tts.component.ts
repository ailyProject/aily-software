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
import { SerialService } from '../../serial.service';
import { NzMessageModule } from 'ng-zorro-antd/message';

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
    private modalService: NzModalService,
    private serialService: SerialService
  ) { }

  volume = 5;
  speed = 5;
  pitch = 5;

  get port() {
    return this.serialService.port;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.customText = "Hello, world!";
    }, 2000);
  }


  openCodeModal(lang) {
    this.modalService.create({
      nzTitle: 'Code',
      nzContent: CodeModalComponent,
      nzFooter: null,

    });
  }

  connect() {
    this.serialService.connect();
  }

  bufferStr = '';
  customText = '';
  customTextChange() {
    let tempText = this.customText
    let buffer = this.serialService.genTTSBuffer(tempText);
    let bufferStr1 = Array.prototype.map.call(buffer, x => ('00' + x.toString(16)).slice(-2)).join('');
    let bufferStr2 = bufferStr1.match(/.{1,2}/g).join(' ');
    this.bufferStr = bufferStr2.toUpperCase();
  }

  play() {
    this.serialService.send(this.bufferStr);
  }
}


