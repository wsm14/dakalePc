import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Button, Upload, message } from 'antd';
import * as XLSX from 'xlsx';
import { UploadOutlined } from '@ant-design/icons';

const ImportDataModal = (props) => {
  const { visible, onClose, setMreList, setUserList, dispatch, setGroupList } = props;
  const { show = false, role } = visible;
  // 是否存在有效文件
  const [excelFile, setExcelFile] = useState(false);
  // excel数据储存
  const [excelData, setExcelData] = useState([]);

  const [fileLoading, setFileLoading] = useState(false);

  // 导入时需要的参数配置等
  const excelProps = {
    user: {
      excelName: '直充用户信息表', // excel 表名
      // excel 导出列
      excelRow: (item) => ({
        mobile: item['用户手机号'],
        subsidyBean: item['充值卡豆数'],
      }),
      // 模版链接
      excelModelUrl:
        'https://resource-new.dakale.net/excel/%E8%A1%A5%E8%B4%B4%E7%9B%B4%E5%85%85-%E7%94%A8%E6%88%B7%E5%85%85%E5%80%BC%E4%BF%A1%E6%81%AF%E8%A1%A8.xlsx',
    },
    merchant: {
      excelName: '店铺信息表',
      excelRow: (item) => ({
        merchantName: item['店铺名'],
        subsidyBean: item['充值卡豆数'],
      }),
      excelModelUrl:
        'https://resource-new.dakale.net/excel/%E8%A1%A5%E8%B4%B4%E7%9B%B4%E5%85%85-%E5%BA%97%E9%93%BA%E4%BF%A1%E6%81%AF%E8%A1%A8.xlsx',
    },
    group: {
      excelName: '集团信息表',
      excelRow: (item) => ({
        groupName: item['集团名'],
        subsidyBean: item['充值卡豆数'],
      }),
      excelModelUrl:
        'https://resource-new.dakale.net/excel/%E8%A1%A5%E8%B4%B4%E7%9B%B4%E5%85%85-%E9%9B%86%E5%9B%A2%E4%BF%A1%E6%81%AF%E8%A1%A8.xlsx',
    },
  }[role];

  // 上传文件模版数据
  const fetchUpExcelData = () => {
    console.log(excelData, 'dddd');
    if (!excelData.list.length) {
      message.error('excel无数据，导入失败');
      return;
    }
    if (role === 'user') {
      setUserList({ ...excelData });
      onClose();
    } else if (role === 'merchant') {
      setMreList({ ...excelData });
      onClose();
    } else {
      setGroupList({ ...excelData });
      onClose();
    }
  };

  // 上传文件模版
  const uploadFilesChange = (file) => {
    if (file.file.status == 'removed') {
      setExcelFile(false);
      setExcelData([]);
      return;
    }
    // 通过FileReader对象读取文件
    let data = {};
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        // 存储获取到的数据
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          let tempData = [];
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data[sheet] = tempData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          }
        }
      } catch (e) {
        message.error('文件类型不正确！');
        setFileLoading(false);
      }

      if (!data[excelProps.excelName]) {
        setFileLoading(false);
        message.error('Excel模版不正确');
        return;
      }
      if (!data[excelProps.excelName].length) {
        setFileLoading(false);
        message.error('Excel未写入数据');
        return;
      }
      let dataSources = [];
      dataSources = data[excelProps.excelName].map((item) => excelProps.excelRow(item));
      const paramObj = {
        user: 'userInfoObjects',
        merchant: 'userMerchantObjects',
        group: 'merchantGroupObjects',
      }[role];
      dispatch({
        type: 'baseData/fetchListImportSubsidyRole',
        payload: {
          role,
          [paramObj]: dataSources,
        },
        callback: (list) => {
          const { userList = [], userMerchantList = [], merchantGroupList = [] } = list;
          switch (role) {
            case 'user':
              const keys = userList.map((item) => item.userIdString);
              setExcelData({ list: userList, keys });
              setExcelFile(true);
              break;
            case 'merchant':
              const merKeys = userMerchantList.map((item) => item.userMerchantIdString);
              setExcelData({ list: userMerchantList, keys: merKeys });
              setExcelFile(true);
              break;
            case 'group':
              const groupKeys = merchantGroupList.map((item) => item.merchantGroupIdString);
              setExcelData({ list: merchantGroupList, keys: groupKeys });
              setExcelFile(true);
              break;
          }
        },
      });
      setFileLoading(false);
      console.log(role, excelProps, data, dataSources, '2333');
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file.file);
  };
  // 下载模版
  const handleDownExcelModel = () => window.open(excelProps.excelModelUrl);

  const uploadProps = {
    listType: 'picture',
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.xls,.xlsx',
  };

  const modalProps = {
    title: `批量导入 - ${excelProps?.excelName}`,
    visible: show,
    onCancel: onClose,
    confirmLoading: fileLoading,
    okText: '确定导入',
    onOk: fetchUpExcelData,
  };

  return (
    <Modal {...modalProps}>
      <Upload
        {...uploadProps}
        beforeUpload={() => {
          setFileLoading(true);
          return false;
        }}
        onChange={uploadFilesChange}
      >
        <Button icon={<UploadOutlined />} type="primary" disabled={excelFile}>
          选择文件
        </Button>
      </Upload>

      <div style={{ marginTop: 20 }}>
        <a style={{ textDecoration: 'underline' }} onClick={handleDownExcelModel}>
          下载模板
        </a>
      </div>
    </Modal>
  );
};
export default connect()(ImportDataModal);
