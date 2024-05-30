// 定义常量
export const OTA_BOOTLOADER_BAUDRATE = 115200; // 最大921600 (目前只支持115200)
export const OTA_UPDATER_BAUDRATE = 921600; // 最大2000000

export const OTA_CLOUD_SIZE = 4096 * 10; // >=MAX_DATA_LENGTH ,且能整除4096
export const MAX_DATA_LENGTH = 1024 * 4; // 必须大于等于32，小于等于4096，且能整除4096
export const MAX_PACKAGE_LENGTH = MAX_DATA_LENGTH + 10;
export const MIN_PARTITION_SIZE = 4096;
export const ERASE_BLOCK_SIZE = 4096;

// MESSAGE TYPE
export const MSG_TYPE_CMD = 0xA0;
export const MSG_TYPE_REQ = 0xA1;
export const MSG_TYPE_ACK = 0xA2;
export const MSG_TYPE_NOTIFY = 0xA3;

export const MSG_CMD_UPDATE_REQ = 0x03; // 握手消息
export const MSG_CMD_GET_INFO = 0x04; // 获取分区表信息
export const MSG_CMD_UPDATE_CHECK_READY = 0x05; // 检测设备是否重启成功
export const MSG_CMD_UPDATE_VERIFY_INFO = 0x06; // 发送UPDATE信息
export const MSG_CMD_UPDATE_ERA = 0x07;
export const MSG_CMD_UPDATE_WRITE = 0x08;
export const MSG_CMD_UPDATE_BLOCK_WRITE_DONE = 0x09;
export const MSG_CMD_UPDATE_VERIFY = 0x0A;
export const MSG_CMD_CHANGE_BAUDRATE = 0x0B;
export const MSG_CMD_TEST_BAUDRATE = 0x0C;
export const MSG_CMD_PROGRESS = 0x11;
export const MSG_CMD_SET_FW_FMT_VER = 0x12; // 设置固件格式版本号，1个字节数据即版本号

export const MSG_CMD_SYS_RST = 0xA1; // 复位命令

export const PARTITION_USER1_FLAG_MASK = 0x0001; // 需要升级user code 1
export const PARTITION_USER2_FLAG_MASK = 0x0002; // 需要升级user code 2
export const PARTITION_ASR_FLAG_MASK = 0x0004; // 需要升级ASR
export const PARTITION_DNN_FLAG_MASK = 0x0008; // 需要升级DNN
export const PARTITION_VOICE_FLAG_MASK = 0x0010; // 需要升级voice
export const PARTITION_USERFILE_FLAG_MASK = 0x0020; // 需要升级user file
export const PARTITION_UPDATE_ALL = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020;
export const PARTITION_INVALID_FILE_MASK = 0x8000; // 无效的固件文件

export const PARTITION_TABLE1_START_ADDR = 0x6000; // 分区表起始地址
export const PARTITION_TABLE2_START_ADDR = 0x8000; // 分区表起始地址
export const PROGRAM_AGENT_ADDR = 0x1ff58000; // 3代updater运行地址

export function GET_LWORD(p: Uint8Array): number {
    return p[0] + (p[1] << 8) + (p[2] << 16) + (p[3] << 24);
}

export function GET_SWORD(p: Uint8Array): number {
    return p[0] + (p[1] << 8);
}

// 启英三代OTA芯片协议
export const OTA_RESET_CMD = "a5a55a5a000001050000000078563412"; // 复位指令-芯片使用的是小端模式
export const OTA_RESET_ANS = "a50f0000b00300acabff"; // 复位应答指令
export const OTA_REQUEST_CMD = "a50f0000a00300cfe8ff"; // 和bootloader握手指令

// 分区信息结构体
export interface PartitionInfo {
    version: number; // 分区版本
    address: number; // 分区起始地址
    size: number; // 分区大小
    crc: number; // 分区CRC16校验
    status: number; // 分区当前状态 0xF0-分区有效  0xFC-需要更新的分区  0xC0-无效分区
}

// 分区表结构体
export interface PartitionTable {
    ManufacturerID: number; // 厂商ID
    ProductID: number[]; // 产品ID
    HWName: number[]; // 硬件名称
    HWVersion: number; // 硬件版本
    SWName: number[]; // 软件名称
    SWVersion: number; // 软件版本
    BootLoaderVersion: number; // bootloader版本
    ChipName: string; // 芯片名称
    FirmwareFormatVer: number; // 固件格式版本
    reserve: number[]; // 预留
    user_code1: PartitionInfo; // 代码分区1信息
    user_code2: PartitionInfo; // 代码分区2信息
    asr_cmd_model: PartitionInfo; // asr分区信息
    dnn_model: PartitionInfo; // dnn分区信息
    voice: PartitionInfo; // voice分区信息
    user_file: PartitionInfo; // user_file分区信息
    ConsumerDataStartAddr: number; // nv_data分区起始地址-ota无需关注
    ConsumerDataSize: number; // nv_data分区大小 -ota无需关注
    PartitionTableChecksum: number; // 分区表校验值
}

export const PartitionTableSize = 144; // 分区表大小


// 固件格式版本
export enum FwFmtVer {
    FW_FMT_VER_1 = 1, // 固件格式版本1，现用于CI110X SDK和CI130X_SDK、CI230X_SDK、 CI231X_SDK
    FW_FMT_VER_2, // 固件格式版本2，现用于CI110X_SDK_Lite和CI112X_SDK
    FW_FMT_VER_MAX,
}

// 传输包原始数据类型，用于传输
export interface PackageRawData {
    data1: Uint8Array;
    data2: Uint8Array;
    data3: Uint8Array;
}

// 传输包解析结构类型，用于构造和解包
export interface PackageProperty {
    head?: number; // 包头
    data_length?: number; // 数据长度
    msg_type?: number; // 消息类型
    cmd?: number; // 指令
    seq?: number;
    data?: Uint8Array; // 数据
    crc?: number; // CRC16校验
    tail?: number; // 包尾
}

// 传输包类型
export interface Package {
    raw_data?: PackageRawData;
    property?: PackageProperty;
};
