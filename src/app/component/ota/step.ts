//ota当前主要步骤
enum mainStep {
    CUR_MAIN_STEP_IDEL,                             //空闲状态
    CUR_MAIN_STEP_CHECK_UPDATER_PARTITION_INFO,     //检测升级信息
    CUR_MAIN_STEP_UPDATE_USERCODE,                  //更新代码分区
    CUR_MAIN_STEP_UPDATE_ASR,                       //更新ASR分区
    CUR_MAIN_STEP_UPDATE_DNN,                       //更新DNN分区
    CUR_MAIN_STEP_UPDATE_VOICE,                     //更新VOICE分区
    CUR_MAIN_STEP_UPDATE_USERFILE,                  //更新USERFILE分区
};

//ota各个子步骤
enum subStep {
    CUR_SUB_STEP_RESET_CHIP = 0,                                     //复位芯片
    CUR_SBU_STEP_RESET_ANS = 1,
    CUR_SUB_STEP_RESET_SYNC_CHIP = 2,                                //复位成功后的握手同步
    CUR_SUB_STEP_SEND_UPDATER_VERIFY_INFO = 3,                       //发送updater运行地址，大小和CRC给芯片
    CUR_SUB_STEP_SEND_UPDATER_DATA = 4,                              //发送updater数据，芯片请求工具应答形式
    CUR_SUB_STEP_VERIFY_UPDAGER = 5,                                 //发送完updater，校验updater写入是否成功
    CUR_SUB_STEP_CHECK_UPDATER_RUN_READY = 6,                        //检测updater是否运行OK
    CUR_SUB_STEP_CHANGE_CHIP_BAUDRATE = 7,                           //切换串口波特率-2Mbps
    CUR_SUB_STEP_CHECK_CHANGE_BAUDRATE_OK = 8,                       //检测串口波特率是否切换成功
    CUR_SUB_STEP_SET_FW_VER_V1 = 9,                                  //设置固件版本为V1
    CUR_SUB_STEP_GET_PAR_INFO = 10,                                   //获取分区表信息
    CUR_SUB_STEP_UPDATE_TABLE1_SEND_PARTITION_INFO = 11,             //更新分区表1-发送分区表信息
    CUR_SUB_STEP_UPDATE_TABLE1_ERASE_PARTITION = 12,                 //更新分区表1-擦除分区表
    CUR_SUB_STEP_UPDATE_TABLE1_WRITE_PARTITION_DATA = 13,            //更新分区表1-发送分区表数据
    CUR_SUB_STEP_UPDATE_TABLE1_VERIRY_PARTITION = 14,                //校验写入分区表1
    CUR_SUB_STEP_UPDATE_TABLE2_SEND_PARTITION_INFO = 15,             //更新分区表2-发送分区表信息
    CUR_SUB_STEP_UPDATE_TABLE2_ERASE_PARTITION = 16,                 //更新分区表2-擦除分区表
    CUR_SUB_STEP_UPDATE_TABLE2_WRITE_PARTITION_DATA = 17,            //更新分区表2-发送分区表数据
    CUR_SUB_STEP_UPDATE_TABLE2_VERIRY_PARTITION = 18,                //校验写入分区表2

    CUR_SUB_STEP_UPDATE_USER_CODE_INDEX1_SEND_PARTITION_INFO = 19,   //升级用户user code(1/2)-发送分区表信息
    CUR_SUB_STEP_UPDATE_USER_CODE_INDEX1_ERASE_PARTITION = 20,       //升级用户user code(1/2)-擦除分区
    CUR_SUB_STEP_UPDATE_USER_CODE_INDEX1_VERIRY_PARTITION = 21,      //校验写入分区数据
    CUR_SUB_STEP_SECOND_UPDATE_TABLE1_SEND_PARTITION_INFO = 22,      //第二次更新分区表1-发送分区表信息
    CUR_SUB_STEP_SECOND_UPDATE_TABLE1_ERASE_PARTITION = 23,          //第二次更新分区表1-擦除分区表
    CUR_SUB_STEP_SECOND_UPDATE_TABLE1_WRITE_PARTITION_DATA = 24,     //第二次更新分区表1-发送分区表数据
    CUR_SUB_STEP_SECOND_UPDATE_TABLE1_VERIRY_PARTITION = 25,         //第二次校验写入分区表1
    CUR_SUB_STEP_SECOND_UPDATE_TABLE2_SEND_PARTITION_INFO = 26,      //第二次更新分区表2-发送分区表信息
    CUR_SUB_STEP_SECOND_UPDATE_TABLE2_ERASE_PARTITION = 27,          //第二次更新分区表2-擦除分区表
    CUR_SUB_STEP_SECOND_UPDATE_TABLE2_WRITE_PARTITION_DATA = 28,     //第二次更新分区表2-发送分区表数据
    CUR_SUB_STEP_SECOND_UPDATE_TABLE2_VERIRY_PARTITION = 29,         //第二次校验写入分区表2
    CUR_SUB_STEP_UPDATE_USER_CODE_INDEX2_SEND_PARTITION_INFO = 30,   //升级用户user code(1/2)-发送分区表信息
    CUR_SUB_STEP_UPDATE_USER_CODE_INDEX2_ERASE_PARTITION = 31,       //升级用户user code(1/2)-擦除分区
    CUR_SUB_STEP_UPDATE_USER_CODE_INDEX2_VERIRY_PARTITION = 32,      //校验写入分区数据

    CUR_SUB_STEP_UPDATE_ASR_SEND_PARTITION_INFO = 33,                //升级ASR分区-发送分区信息
    CUR_SUB_STEP_UPDATE_ASR_ERASE_PARTITION = 34,                    //升级ASR分区-擦除分区
    CUR_SUB_STEP_UPDATE_ASR_VERIRY_PARTITION = 35,                   //升级ASR分区-校验分区写入数据

    CUR_SUB_STEP_UPDATE_DNN_SEND_PARTITION_INFO = 36,                //升级DNN分区-发送分区信息
    CUR_SUB_STEP_UPDATE_DNN_ERASE_PARTITION = 37,                    //升级DNN分区-擦除分区
    CUR_SUB_STEP_UPDATE_DNN_VERIRY_PARTITION = 38,                   //升级DNN分区-校验分区写入数据
    CUR_SUB_STEP_UPDATE_VOICE_SEND_PARTITION_INFO = 39,              //升级VOICE分区-发送分区信息
    CUR_SUB_STEP_UPDATE_VOICE_ERASE_PARTITION = 40,                  //升级VOICE分区-擦除分区
    CUR_SUB_STEP_UPDATE_VOICE_VERIRY_PARTITION = 41,                 //升级VOICE分区-校验分区写入数据

    CUR_SUB_STEP_UPDATE_USERFILE_SEND_PARTITION_INFO = 42,           //升级USERFILE分区-发送分区信息
    CUR_SUB_STEP_UPDATE_USERFILE_ERASE_PARTITION = 43,               //升级USERFILE分区-擦除分区
    CUR_SUB_STEP_UPDATE_USERFILE_VERIRY_PARTITION = 44,              //升级USERFILE分区-校验分区写入数据
    CUR_SUB_STEP_UPDATE_OVER_RESET_CHIP = 45,                        //更新完成重启芯片

};