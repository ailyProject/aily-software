import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AsrService } from '../asr.service';

@Component({
  selector: 'app-block',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './block.component.html',
  styleUrl: './block.component.scss'
})
export class BlockComponent {

  @Input() block;

  constructor(
    private asrService: AsrService
  ) { }

  copy() {
    // 实现复制功能
    this.asrService.copy(this.block)
  }

  delete() {
    // 实现删除功能
    this.asrService.delete(this.block)
  }
}
