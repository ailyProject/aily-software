import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from '../../component/markdown/markdown.component';
import { SerialService } from '../../serial.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { loadArduinoCode, loadNodejsCode, loadPythonCode } from './examples';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';

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
    NzCodeEditorModule,
    NzSelectModule,
    NzSliderModule
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
    { text: '关关雎鸠,在河之洲,窈窕淑女,君子好逑' },
    { text: '蒹葭苍苍,白露为霜,所谓伊人,在水一方' },
    { text: '八百标兵奔北坡，北坡炮兵并排跑，炮兵怕把标兵碰，标兵怕碰炮兵炮' },
    { text: '蒸羊羔、蒸熊掌、蒸鹿尾儿、烧花鸭、烧雏鸡、烧子鹅、卤猪、卤鸭、酱鸡、腊肉、松花、小肚儿' },
  ]

  code = '';

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

    // 更新代码部分
    this.selectCode()
  }

  settingchange() {
    if (this.volume != 5) {
      // 检测this.customText中是否已经有了音量设置
      if (this.customText.match(/\[v\d+\]/)) {
        this.customText = this.customText.replace(/\[v\d+\]/, `[v${this.volume}]`)
      } else {
        this.customText = `[v${this.volume}]${this.customText}`
      }
    }
    if (this.speed != 5) {
      // 检测this.customText中是否已经有了语速设置
      if (this.customText.match(/\[s\d+\]/)) {
        this.customText = this.customText.replace(/\[s\d+\]/, `[s${this.speed}]`)
      } else {
        this.customText = `[s${this.speed}]${this.customText}`
      }
    }
    if (this.pitch != 5) {
      // 检测this.customText中是否已经有了语调设置
      if (this.customText.match(/\[t\d+\]/)) {
        this.customText = this.customText.replace(/\[t\d+\]/, `[t${this.pitch}]`)
      } else {
        this.customText = `[t${this.pitch}]${this.customText}`
      }
    }
  }

  play() {
    this.serialService.send(this.bufferStr);
  }

  pause() {
    this.serialService.send('FD 00 01 02');
  }

  getState() {
    this.serialService.send('FD 00 01 21');
  }

  copy() {
    copyToClipboard(this.bufferStr);
    this.message.create('success', 'Copied to clipboard');
  }

  loadText(item) {
    this.customText = item.text;
    this.settingchange()
    this.customTextChange()
  }

  currentCode = 'arduino'
  selectCode(code = this.currentCode) {
    this.currentCode = code;
    switch (code) {
      case 'arduino':
        this.code = loadArduinoCode(this.customText);
        break;
      case 'python':
        this.code = loadPythonCode(this.customText);
        break;
      case 'nodejs':
        this.code = loadNodejsCode(this.customText);
        break;
      default:
        break;
    }
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


