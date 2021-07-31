import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import * as XLSX from 'xlsx';
import { UploadOutlined } from '@ant-design/icons';

const ImportDataModal = (props) => {
  const { visible, onClose, setMreList, setUserList } = props;
  const { show = false, tabKey } = visible;
  // 是否存在有效文件
  const [excelFile, setExcelFile] = useState(false);
  // excel数据储存
  const [excelData, setExcelData] = useState([]);

  const [fileLoading, setFileLoading] = useState(false);

  // 导入时需要的参数配置等
  const excelProps = {
    user: {
      excelName: '用户信息表', // excel 表名
      // excel 导出列
      excelRow: (item) => ({
        id: item['ID'],
        mobile: item['手机号'],
        username: item['用户名'],
        level: item['级别'],
      }),
      // 模版链接
      excelModelUrl:
        'https://resource-new.dakale.net/excel/%E8%90%A5%E9%94%80%E7%89%A9%E6%96%99-%E5%AF%BC%E5%85%A5%E7%94%A8%E6%88%B7.xlsx',
    },
    merchant: {
      excelName: '商户信息表',
      excelRow: (item) => ({
        id: item['ID'],
        mobile: item['店铺账号'],
        merchantName: item['商户名称'],
      }),
      excelModelUrl:
        'https://resource-new.dakale.net/excel/%E8%90%A5%E9%94%80%E7%89%A9%E6%96%99-%E5%AF%BC%E5%85%A5%E5%95%86%E6%88%B6.xlsx',
    },
  }[tabKey];

  // 上传文件模版数据
  const fetchUpExcelData = () => {
    if (!excelData.length) {
      message.error('excel无数据，导入失败');
      return;
    }
    if (tabKey === 'user') {
      setUserList(excelData);
      onClose();
    } else {
      setMreList(excelData.map((i) => ({ userMerchantIdString: i.id, ...i })));
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
      setExcelData(dataSources);
      setExcelFile(true);
      setFileLoading(false);
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
export default ImportDataModal;
