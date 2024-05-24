import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from '../../component/markdown/markdown.component';
import { SerialService } from '../../serial.service';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

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
    MarkdownComponent,
    NzCodeEditorModule
  ],
  templateUrl: './tts.component.html',
  styleUrl: './tts.component.scss'
})
export class TtsComponent {

  testTextList = [
    { text: '你好，我是艾莉' },
    { text: '这是TTS模块的播放测试' },
    { text: '这个工具可以帮助你生成TTS模块相关指令及代码' },
    { text: '艾莉项目是我们推出的AI硬件项目，致力于提供多种AI能力模块，帮助用户快速开发AI时代的原生硬件' },
    { text: '八百标兵奔北坡，北坡炮兵并排跑，炮兵怕把标兵碰，标兵怕碰炮兵炮' },
    { text: '蒸羊羔、蒸熊掌、蒸鹿尾儿、烧花鸭、烧雏鸡、烧子鹅、卤猪、卤鸭、酱鸡、腊肉、松花、小肚儿、晾肉、香肠儿、什锦苏盘、熏鸡白肚儿、清蒸八宝猪' },
    { text: '关关雎鸠,在河之洲,窈窕淑女,君子好逑' },
    { text: '蒹葭苍苍,白露为霜,所谓伊人,在水一方' },
  ]

  code = ``;

  constructor(
    private serialService: SerialService,
    private message: NzMessageService
  ) { }

  volume = 5;
  speed = 5;
  pitch = 5;

  get port() {
    return this.serialService.port;
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

  pause(){
    // this.serialService.send(this.bufferStr);
  }

  copy() {
    copyToClipboard(this.bufferStr);
    this.message.create('success', 'Copied to clipboard');
  }

  loadText(item) {
    this.customText = item.text;
    this.customTextChange()
  }

  selectCode(code) {

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


