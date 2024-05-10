import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown',
  standalone: true,
  imports: [],
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.scss'
})
export class MarkdownComponent {
  @ViewChild('content') content: ElementRef;

  @Input() data: string=`
  # aily TTS模组使用方法

  ## aily TTS模块播放测试
  1. 将TTS模块与USB转串口模块连接
  2. 点击“连接设备”按键，选择对应的串口设备
  3. 选择需要播放的语句，或自定义语句，并点击“▶”按键"

  ## aily TTS代码生成
  1. 将TTS模块与USB转串口模块连接
  2. 点击“连接设备”按键，选择对应的串口设备
  3. 选择需要播放的语句，或自定义语句，并点击“▶”按键`;

  ngAfterViewInit(): void {
    this.content.nativeElement.innerHTML = marked.parse(this.data);
  }
}
