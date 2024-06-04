import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsrService {

  speech = {
    volume: 5,
    speed: 5,
    pitch: 5
  }

  serial = {
    port: 'UART2',
    baudrate: 115200
  }

  weekCmdList = [[]]
  asrCmdList = [[]]
  intCmdList = [[]]
  serialCmdList = [[]]

  constructor() { }

  // 将数据暂存储到localStorage
  save() {
    const data = {
      weekCmdList: this.weekCmdList,
      asrCmdList: this.asrCmdList,
      intCmdList: this.intCmdList,
      serialCmdList: this.serialCmdList
    }
    localStorage.setItem('asr5', JSON.stringify(data))
  }

  // 从localStorage中获取数据
  load() {
    const data = JSON.parse(localStorage.getItem('asr5'))
    if (data) {
      this.weekCmdList = data.weekCmdList
      this.asrCmdList = data.asrCmdList
      this.intCmdList = data.intCmdList
      this.serialCmdList = data.serialCmdList
    }
  }

  findBlock(block) {
    // 查找block所在的列表
    let list = null
    for (let index = 0; index < this.weekCmdList.length; index++) {
      const item = this.weekCmdList[index];
      if (item.includes(block)) {
        list = item
        return list
      }
    }
    for (let index = 0; index < this.asrCmdList.length; index++) {
      const item = this.asrCmdList[index];
      if (item.includes(block)) {
        list = item
        return list
      }
    }
    for (let index = 0; index < this.intCmdList.length; index++) {
      const item = this.intCmdList[index];
      if (item.includes(block)) {
        list = item
        return list
      }
    }
    for (let index = 0; index < this.serialCmdList.length; index++) {
      const item = this.serialCmdList[index];
      if (item.includes(block)) {
        list = item
        return list
      }
    }
  }

  copy(block) {
    // 查找block所在的列表
    let list = this.findBlock(block)
    // 复制block到该list中的目前block位置的下一个位置
    list.splice(list.indexOf(block) + 1, 0, JSON.parse(JSON.stringify(block)))
    this.save()
  }

  delete(block) {
    // 查找block所在的列表
    let list = this.findBlock(block)
    // 删除block
    list.splice(list.indexOf(block), 1)
    this.save()
  }

}
