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
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

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

  testTextList = [
    { text: '你好，我是艾莉，这是TTS模块的播放测试', buffer: 'FD 00 38 01 04 E4 BD A0 E5 A5 BD EF BC 8C E6 88 91 E6 98 AF E8 89 BE E8 8E 89 EF BC 8C E8 BF 99 E6 98 AF 54 54 53 E6 A8 A1 E5 9D 97 E7 9A 84 E6 92 AD E6 94 BE E6 B5 8B E8 AF 95' },
    { text: 'aily project是我们推出的AI硬件项目，致力于提供多种AI能力模块，帮助用户快速开发出AI时代的原生硬件', buffer: 'FD 00 89 01 04 61 69 6C 79 20 70 72 6F 6A 65 63 74 E6 98 AF E6 88 91 E4 BB AC E9 80 80 E5 87 BA E7 9A 84 41 49 E7 A1 AC E4 BB B6 E9 A1 B9 E7 9B AE EF BC 8C E8 87 B4 E5 8A 9B E4 BA 8E E6 8F 90 E4 BE 9B E5 A4 9A E7 A7 8D 41 49 E8 83 BD E5 8A 9B E6 A8 A1 E5 9D 97 EF BC 8C E5 B8 AE E5 8A A9 E7 94 A8 E6 88 B7 E5 BF AB E9 80 9F E5 BC 80 E5 8F 91 E5 87 BA 41 49 E6 97 B6 E4 BB A3 E7 9A 84 E5 8E 9F E7 94 9F E7 A1 AC E4 BB B6' },
  ]


  constructor(
    private modalService: NzModalService,
    private serialService: SerialService,
    private message: NzMessageService
  ) { }

  volume = 5;
  speed = 5;
  pitch = 5;

  get port() {
    return this.serialService.port;
  }

  openCodeModal(lang) {
    this.modalService.create({
      nzTitle: 'Code',
      nzContent: CodeModalComponent,
      nzFooter: null,
    });
  }

  async connect() {
    if (await this.serialService.connect()) {
      this.message.create('success', 'Connected to serial port');
    }
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

  copy() {
    copyToClipboard(this.bufferStr);
    this.message.create('success', 'Copied to clipboard');
  }

  loadText(item) {
    this.customText = item.text;
    this.bufferStr = item.buffer;
  }
}


async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Error in copying text: ', err);
  }
}


