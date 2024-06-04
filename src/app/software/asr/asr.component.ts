import { ChangeDetectorRef, Component } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { AsrService } from './asr.service';

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
  subs = new Subscription();

  get weekCmdList() {
    return this.asrService.weekCmdList
  }

  set weekCmdList(value) {
    this.asrService.weekCmdList = value
  }

  get asrCmdList() {
    return this.asrService.asrCmdList
  }

  set asrCmdList(value) {
    this.asrService.asrCmdList = value
  }

  get intCmdList() {
    return this.asrService.intCmdList
  }

  set intCmdList(value) {
    this.asrService.intCmdList = value
  }

  get serialCmdList() {
    return this.asrService.serialCmdList
  }

  set serialCmdList(value) {
    this.asrService.serialCmdList = value
  }

  get speech() {
    return this.asrService.speech
  }

  get serial() {
    return this.asrService.serial
  }

  constructor(
    private otaService: OtaService,
    private dragulaService: DragulaService,
    private asrService: AsrService,
    private cd: ChangeDetectorRef
  ) {
    this.dragulaService.createGroup('VAMPIRES', {
      copy: (el, source) => {
        return source.id === 'block-bar';
      },
      copyItem: (block: any) => {
        return block;
      },
      accepts: (el, target, source, sibling) => {
        return target.id !== 'block-bar';
      },
      direction: 'horizontal'
    });

    this.subs.add(this.dragulaService.dropModel('VAMPIRES')
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        setTimeout(() => {
          this.asrService.save()
        }, 1000)
      })
    );

    this.subs.add(this.dragulaService.removeModel('VAMPIRES')
      .subscribe(({ el, source, item, sourceModel }) => {
        // console.log('removeModel', el, source)
      })
    );

    this.asrService.load()

  }


  // // 将数据暂存储到localStorage
  // save() {
  //   const data = {
  //     weekCmdList: this.weekCmdList,
  //     asrCmdList: this.asrCmdList,
  //     intCmdList: this.intCmdList,
  //     serialCmdList: this.serialCmdList
  //   }
  //   localStorage.setItem('asr', JSON.stringify(data))
  // }

  // // 从localStorage中获取数据
  // load() {
  //   const data = JSON.parse(localStorage.getItem('asr'))
  //   if (data) {
  //     this.weekCmdList = data.weekCmdList
  //     this.asrCmdList = data.asrCmdList
  //     this.intCmdList = data.intCmdList
  //     this.serialCmdList = data.serialCmdList
  //   }
  // }

  ngOnDestroy(): void {
    this.dragulaService.destroy('VAMPIRES')
  }

  runOTA() {
    console.log('runOTA')
    this.otaService.runOTA()
  }


  addAsrCmd() {
    this.asrCmdList.push([])
  }


  addIntCmd() {
    this.intCmdList.push([])
  }

  addSerialCmd() {
    this.serialCmdList.push([])
  }

  settingchange() {

  }

  test() {
    console.log(this.speech);
    console.log(this.serial);
    console.log(this.weekCmdList);
    console.log(this.asrCmdList);
    console.log(this.intCmdList);
    console.log(this.serialCmdList);
  }

}
