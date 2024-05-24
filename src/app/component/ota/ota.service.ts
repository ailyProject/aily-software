import { Injectable } from '@angular/core';
import { SerialService } from '../../serial.service';
import { crc16tab_ccitt } from './crc';
import { MSG_CMD_UPDATE_REQ } from './protocol';

@Injectable({
  providedIn: 'root'
})
export class OtaService {

  curMainOtaStep = mainStep.CUR_MAIN_STEP_IDEL;
  curSubOtaStep = subStep.CUR_SUB_STEP_RESET_CHIP;
  userCodeUpdateStart = false;
  asrUpdateStart = false;
  dnnUpdateStart = false;
  voiceUpdateStart = false;
  userFileUpdateStart = false;
  resetTryCount = 0;
  syncUpdaterTryCount = 0;
  // totalRcvUartArray.clear();
  needUpdatePartitionCount = 0;
  updateTimeCount = 0;
  //  updateTimingTimer->start(120000);   //2分钟
  updaterCrc16Val = 0; //代理程序CRC校验
  crc16Temp = 0;
  updateFlag = 0;            //update升级标志
  updateInfoCrc = 0;         //升级crc
  priorityCode = 0;          //优先升级的code（1或2）
  codeOffsetAddr = 0;
  codeSize = 0;

  constructor(
    private serialService: SerialService
  ) { }


  async connect() {
    this.serialService.connect();
  }

  sendResetCmdTimer;
  updateTimingTimer;
  sendBootloaderHandShakeCmdTimer;

  async StartOTAProcess() {
    const updateFirmeareSize = this.curImageArray.length;

    this.ReadUpdaterFile()
    console.log(`updater文件总大小: ${this.curUpdaterArray.length} 字节`);

    this.curSubOtaStep = subStep.CUR_SUB_STEP_RESET_CHIP;

    this.sendResetCmd();
    this.sendResetCmdTimer = setTimeout(() => {
      this.sendResetCmd();
    }, 500);
    this.updateTimingTimer = setInterval(() => {
      this.updateTiming();
    }, 1000);
    this.sendBootloaderHandShakeCmdTimer = setInterval(() => {
      this.sendDownLoadUpdaterCmd();
    }, 20);
    this.curSubOtaStep = subStep.CUR_SBU_STEP_RESET_ANS;
    console.log(`复位后循环发送同Bootloader握手指令(20ms/一次): ${"OTA_REQUEST_CMD"}`);
  }


  //串口接收数据处理函数
  totalRcvUartArray = new Uint8Array();
  async OTAReadDataHandle(rcvData) {
    this.totalRcvUartArray = new Uint8Array([...this.totalRcvUartArray, ...rcvData]);
    let packageLen = 0;
    if (rcvData.length !== 0) {
      do {
        this.updateTimeCount = 0;
        packageLen = 0;
        let pPackage;
        console.log("rcvData = ", rcvData);
        if (this.totalRcvUartArray.length >= 10) {
          pPackage = this.ParseUartMsg(this.totalRcvUartArray, packageLen);
          console.log("packageLen = ", packageLen);
          console.log("curSubOtaStep = ", this.curSubOtaStep);
          if (pPackage === null) {
            console.log("解析芯片返回数据失败...");
            return;
          }
          console.log("pPackage.property.cmd = ", pPackage.property.cmd);
          if (this.curMainOtaStep == mainStep.CUR_MAIN_STEP_CHECK_UPDATER_PARTITION_INFO) {
            this.StepUpdatePartitionInfoCheck(pPackage, rcvData);
          }
        }
        this.totalRcvUartArray = this.totalRcvUartArray.slice(packageLen);
        console.log("移除解析过后的数据");
        console.log("totalRcvUartArray = ", this.totalRcvUartArray);
        rcvData = rcvData.slice(packageLen);

      } while (rcvData.length >= 10);
    } else {
      console.log("收到芯片错误数据:", rcvData);
    }
  }

  ParseUartMsg(rcvData: Buffer): Package | null {
    let ret: Package = { property: { data_length: 0, crc: 0, tail: 0 } };
    ret.property.data_length = rcvData.readUInt16LE(2);
    if (ret.property.data_length > 1024) {
      return null;
    }
    ret.property.crc = rcvData.readUInt16LE(7 + ret.property.data_length);
    ret.property.tail = rcvData[7 + ret.property.data_length + 2];
    console.log(`ret.property.data_length = ${ret.property.data_length}`);
    console.log(`ret.property.crc = ${ret.property.crc}`);
    console.log(`ret.property.tail = ${ret.property.tail}`);
    if (ret.property.tail === 0xFF) {
      let crc = this.crcFunc(0, rcvData.slice(4), ret.property.data_length + 3);
      if (crc === ret.property.crc) {
        ret.property.msg_type = rcvData[4];
        ret.property.cmd = rcvData[5];
        ret.property.seq = rcvData[6];
        if (ret.property.data_length > 0) {
          ret.property.data = Buffer.alloc(ret.property.data_length);
          rcvData.copy(ret.property.data, 0, 7, 7 + ret.property.data_length);
        }
        console.log("parse ok....");
        return ret;
      }
    }
    return null;
  }
  logOutText = 'TESTTT'
  StepUpdatePartitionInfoCheck(pPackage: any, rcvData: Uint8Array) {
    switch (this.curSubOtaStep) {
      case subStep.CUR_SBU_STEP_RESET_ANS:
      case subStep.CUR_SUB_STEP_RESET_SYNC_CHIP:
        if (pPackage.property.msg_type === 0xb0 && pPackage.property.cmd === 0x03) {
          // this.CloseSerialOTASlot();
          // this.serialPortBaudRateComboBox_ch1.setCurrentText("115200");
          // this.OpenSerialOTASlot();
          console.log("芯片收到复位指令，等待复位后握手", this.logOutText, 14, "white", "white");
          this.sendResetCmdTimer.stop();
          this.curSubOtaStep = subStep.CUR_SUB_STEP_RESET_SYNC_CHIP;
        }
        if (pPackage.property.msg_type === 0xa2 && pPackage.property.cmd === MSG_CMD_UPDATE_REQ) {
          console.log("收到Bootloader复位回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
          this.sendBootloaderHandShakeCmdTimer.stop();
          this.sendResetCmdTimer.stop();
          console.log("复位芯片后与Bootloader同步握手完成...", this.logOutText, 14, "white", "white");
          console.log("pPackage->property.cmd =", pPackage.property.cmd);
          this.SendUpdaterVerifyInfo(PROGRAM_AGENT_ADDR);
        }
        break;
      case subStep.CUR_SUB_STEP_SEND_UPDATER_VERIFY_INFO:
        console.log("收到Bootloader回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
        if (pPackage.property.cmd === MSG_CMD_UPDATE_VERIFY_INFO) {
          console.log("发送updater代理程序校验到芯片应答成功", this.logOutText, 14, "green", "green");
          this.curSubOtaStep = CUR_SUB_STEP_SEND_UPDATER_DATA;
        }
        break;
      case subStep.CUR_SUB_STEP_SEND_UPDATER_DATA:
        console.log("收到Bootloader回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
        console.log("pPackage->property.cmd =", pPackage.property.cmd);
        if (pPackage.property.cmd === MSG_CMD_UPDATE_WRITE) {
          let reqOffset = this.GET_LWORD(pPackage.property.data);
          let reqSize = this.GET_LWORD(pPackage.property.data + 4);
          reqSize = (reqSize > MAX_DATA_LENGTH) ? MAX_DATA_LENGTH : reqSize;
          console.log("芯片请求updater数据:请求大小=" + reqSize + "字节" + ", 请求偏移=" + reqOffset, this.logOutText, 14, "white", "white");
          this.AckWriteUpdaterToChip(reqOffset, reqSize);
        }
        if (pPackage.property.cmd === MSG_CMD_UPDATE_BLOCK_WRITE_DONE) {
          console.log("校验updater是否写入成功", this.logOutText, 14, "green", "green");
          this.CmdVerifyWriteUpdaterData();
          this.curSubOtaStep = CUR_SUB_STEP_VERIFY_UPDAGER;
        }
        break;
      case subStep.CUR_SUB_STEP_VERIFY_UPDAGER:
        if (pPackage.property.cmd === MSG_CMD_UPDATE_VERIFY) {
          console.log("收到bootloader回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
          console.log("updater写入校验成功...", this.logOutText, 14, "green", "green");
        }
        if (pPackage.property.cmd === MSG_CMD_UPDATE_REQ) {
          console.log("收到updater回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
          console.log("检测updater是否运行成功", this.logOutText, 14, "green", "green");
          this.CmdHandShake();
          this.curSubOtaStep = CUR_SUB_STEP_CHECK_UPDATER_RUN_READY;
        }
        break;
      case subStep.CUR_SUB_STEP_CHECK_UPDATER_RUN_READY:
        console.log("收到updater回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
        if (pPackage.property.cmd === MSG_CMD_UPDATE_CHECK_READY) {
          console.log("updater已运行成功...", this.logOutText, 14, "green", "green");
          console.log("切换updater运行波特率为:" + this.updateBaudrateLineEdit.text() + ",为下载固件做准备", this.logOutText, 14, "white", "white");
          this.curSubOtaStep = CUR_SUB_STEP_CHANGE_CHIP_BAUDRATE;
          this.CmdChangeUpdaterRunBaudrate(parseInt(this.updateBaudrateLineEdit.text()));
        }
        break;
      case subStep.CUR_SUB_STEP_CHANGE_CHIP_BAUDRATE:
        console.log("收到updater回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
        if (pPackage.property.cmd === MSG_CMD_CHANGE_BAUDRATE) {
          console.log("updater收到切换指令...", this.logOutText, 14, "white", "white");
          // this.CloseSerialOTASlot();
          this.serialPortBaudRateComboBox_ch1.setCurrentText(this.updateBaudrateLineEdit.text());
          // this.OpenSerialOTASlot();
          this.curSubOtaStep = CUR_SUB_STEP_CHECK_CHANGE_BAUDRATE_OK;
          console.log("检测updater切换波特率是否成功", this.logOutText, 14, "green", "green");
          this.CmdHandShake();
        }
        break;
      case subStep.CUR_SUB_STEP_CHECK_CHANGE_BAUDRATE_OK:
        console.log("收到updater回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
        if (pPackage.property.cmd === MSG_CMD_UPDATE_CHECK_READY) {
          console.log("updater运行波特率切换成功...", this.logOutText, 14, "green", "green");
        }
        console.log("设置固件版本为V1", this.logOutText, 14, "white", "white");
        this.curSubOtaStep = CUR_SUB_STEP_SET_FW_VER_V1;
        this.CmdSetFwVersion(FW_FMT_VER_1);
        break;
      case subStep.CUR_SUB_STEP_SET_FW_VER_V1:
        console.log("收到updater回复数据:" + this.toHexString(rcvData), this.logOutText, 14, "white", "white");
        if (pPackage.property.cmd === MSG_CMD_SET_FW_FMT_VER) {
          console.log("设置固件版本为V1成功...", this.logOutText, 14, "green", "green");
          console.log("获取芯片现有分区表信息", this.logOutText, 14, "white", "white");
          this.curSubOtaStep = CUR_SUB_STEP_GET_PAR_INFO;
          if (this.InitPartitionTableResource() !== 0) {
            console.log("分区表资源初始化失败", this.logOutText, 14, "red", "red");
            break;
          }
        }
        break;
      case subStep.CUR_SUB_STEP_GET_PAR_INFO:

        break;
      case subStep.CUR_SUB_STEP_UPDATE_TABLE1_SEND_PARTITION_INFO:
        break;
      case subStep.CUR_SUB_STEP_UPDATE_TABLE1_ERASE_PARTITION:
        break;
      case subStep.CUR_SUB_STEP_UPDATE_TABLE1_WRITE_PARTITION_DATA:
        break;
      case subStep.CUR_SUB_STEP_UPDATE_TABLE1_VERIRY_PARTITION:
        break;
      case subStep.CUR_SUB_STEP_UPDATE_TABLE2_SEND_PARTITION_INFO:
        break;
      case subStep.CUR_SUB_STEP_UPDATE_TABLE2_ERASE_PARTITION:
        break;
      case subStep.CUR_SUB_STEP_UPDATE_TABLE2_WRITE_PARTITION_DATA:
        break;
      case subStep.CUR_SUB_STEP_UPDATE_TABLE2_VERIRY_PARTITION:
        break;
      default:
        break;
    }
  }

  //发送复位业务固件指令
  sendResetCmd(): void {
    this.serialService.disconnect();
    this.serialService.connect();
    this.serialService.send(OTA_RESET_CMD)

    // if (resetTryCount++ > 200) {   //尝试200次
    //   syncUpdaterTryCount = 0;
    //   promptMessage.PromptMessageSet("升级状态", "升级失败，请检查芯片型号和参数配置后重试!", 3);
    //   this.sendResetCmdTimer.stop();
    //   this.sendBootloaderHandShakeCmdTimer.stop();
    // }
  }

  // 发送下载更新器指令
  async sendDownLoadUpdaterCmd() {
    this.serialService.disconnect();
    this.serialService.connect();
    this.serialService.send(OTA_REQUEST_CMD)
    // const OTA_REQUEST_CMD = "your command here";
    // await this.sendRequestToServer('write', this.hexStringToByteArray(OTA_REQUEST_CMD));
    // if (this.syncUpdaterTryCount++ > 200) {   //尝试200次
    //   this.resetTryCount = 0;
    //   console.log("升级状态", "升级超时，请重试...");
    //   clearInterval(this.sendBootloaderHandShakeCmdTimer);
    //   clearInterval(this.sendResetCmdTimer);
    // }
  }


  //升级计超时计算
  async updateTiming() {
    //10S无响应超时
    if (this.updateTimeCount++ > 10) {
      this.updateTimeCount = 0;
      console.log("升级状态", "升级失败，请检查芯片型号和参数配置后重试!");
      clearInterval(this.updateTimingTimer)
      clearTimeout(this.sendResetCmdTimer)
      clearInterval(this.sendBootloaderHandShakeCmdTimer)
      await this.serialService.disconnect();
    }
  }


  // 读取updater
  curUpdaterArray: Uint8Array;
  async ReadUpdaterFile(url = '/assets/ota/ci130x_updater.bin') {
    const response = await fetch(url);
    // 检查响应是否ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // 使用Response.arrayBuffer方法将其转换为ArrayBuffer
    const buffer = await response.arrayBuffer();
    // 将ArrayBuffer转换为Uint8Array
    this.curUpdaterArray = new Uint8Array(buffer);
  }

  // 读取固件
  curImageArray: Uint8Array;
  async ReadImageFile(url = '/assets/ota/Simplified_115200_V0.0.1.bin') {
    const response = await fetch(url);
    // 检查响应是否ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // 使用Response.arrayBuffer方法将其转换为ArrayBuffer
    const buffer = await response.arrayBuffer();
    // 将ArrayBuffer转换为Uint8Array
    this.curImageArray = new Uint8Array(buffer);
  }

  crcFunc(crc: number, buf: Uint8Array, len: number): number {
    for (let counter = 0; counter < len; counter++) {
      const t = buf[counter];
      crc = (crc << 8) ^ crc16tab_ccitt[((crc >> 8) ^ t) & 0x00FF];
    }
    return crc;
  }

  sendUpdaterVerifyInfo(agent_runaddr: number) {
    let transport_agent_count = 0;
    let data = new Uint8Array(10);
    let updater_size = this.curUpdaterArray.length;
    let erase_size = (updater_size + this.MIN_PARTITION_SIZE - 1) / this.MIN_PARTITION_SIZE * this.MIN_PARTITION_SIZE;
    /*计算crc16*/
    this.updaterCrc16Val = this.crcFunc(0, new Uint8Array(this.curUpdaterArray.buffer), this.curUpdaterArray.length);
    for (transport_agent_count = 0; transport_agent_count < erase_size - updater_size; transport_agent_count++) {
      const fill_byte = 0xFF;
      this.updaterCrc16Val = this.crcFunc(this.updaterCrc16Val, new Uint8Array([fill_byte]), 1);
    }
    console.log("updaterCrc16Val = ", this.updaterCrc16Val);
    console.log("curUpdaterArray.length = ", this.curUpdaterArray.length);

    // this.insertPlainText("发送updater代理程序校验到芯片:运行地址+文件大小+CRC16校验值", this.logOutText, 14, "white", "white");
    new DataView(data.buffer).setUint32(0, agent_runaddr, true);
    new DataView(data.buffer).setUint32(4, erase_size, true);
    new DataView(data.buffer).setUint16(8, this.updaterCrc16Val, true);
    //发送升级代理信息（起始地址，大小,CRC）
    this.curSubOtaStep = this.CUR_SUB_STEP_SEND_UPDATER_VERIFY_INFO;
    let package1 = this.newPackage(this.MSG_CMD_UPDATE_VERIFY_INFO, this.MSG_TYPE_CMD, 1, data, 10);
    this.sendPackage(package1);
    // this.delPackage(package1);
  }

  sendPackage(package1: any): number {
    let totalTempArray = new Uint8Array();
    let sendDataArray = new Uint8Array(package1.raw_data.data1.slice(0, 7));
    totalTempArray = Uint8Array.from([...totalTempArray, ...sendDataArray]);
    if (sendDataArray.length > 0) serialOTA.write(sendDataArray);  //发送包头+数据长度+消息类型+指令
    sendDataArray = new Uint8Array(package1.raw_data.data2.slice(0, package1.property.data_length));
    totalTempArray = Uint8Array.from([...totalTempArray, ...sendDataArray]);
    if (sendDataArray.length > 0) serialOTA.write(sendDataArray);  //发送数据
    sendDataArray = new Uint8Array(package1.raw_data.data3.slice(0, 3));
    totalTempArray = Uint8Array.from([...totalTempArray, ...sendDataArray]);
    if (sendDataArray.length > 0) serialOTA.write(sendDataArray);  //发送CRC加包尾
    // if (enabelSendDataLogCheckBox.isChecked()) {
    //   this.insertPlainText("发送数据:" + totalTempArray.join(' '), logOutText, 14, "yellow", "yellow");
    // }
    return totalTempArray.length;
  }

}
