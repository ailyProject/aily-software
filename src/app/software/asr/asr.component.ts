import { Component } from '@angular/core';
import { MarkdownComponent } from '../../component/markdown/markdown.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { OtaService } from './ota.service';
import { blockList } from './block/block.config';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { BlockComponent } from './block/block.component';

@Component({
  selector: 'app-asr',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzStepsModule,
    NzInputNumberModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzSliderModule,
    DragulaModule,
    BlockComponent
  ],
  templateUrl: './asr.component.html',
  styleUrl: './asr.component.scss'
})
export class AsrComponent {

  blockList = blockList

  cmdList = [{}]
  intCmdList = [{}]
  serialCmdList = [{}]

  constructor(
    private otaService: OtaService,
    private dragulaService: DragulaService
  ) {
    this.dragulaService.createGroup('VAMPIRES', {
      copy: (el, source) => {
        return source.id === 'block-bar';
      },
      accepts: (el, target, source, sibling) => {
        return target.id !== 'block-bar';
      },
      direction: 'horizontal'
    });

  }

  runOTA() {
    console.log('runOTA')
    this.otaService.runOTA()
  }


  addCmd() {
    this.cmdList.push({})
  }


  addIntCmd() {
    this.intCmdList.push({})
  }

  addSerialCmd() {
    this.serialCmdList.push({})
  }


}
