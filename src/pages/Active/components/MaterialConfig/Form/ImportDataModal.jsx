import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { connect } from 'umi';
import * as XLSX from 'xlsx';
import { UploadOutlined } from '@ant-design/icons';

const ImportDataModal = (props) => {
  const { dispatch, visible, onClose } = props;
  const { show = false, tabKey } = visible;
  // 是否存在有效文件
  const [excelFile, setExcelFile] = useState(false);
  // excel数据储存
  const [excelData, setExcelData] = useState([]);
  // 导入记录弹窗显示
  const [visibleList, setVisibleList] = useState(false);

  const [fileLoading, setFileLoading] = useState(false);
  // 上传文件模版数据
  const fetchUpExcelData = () => {
    if (!excelData.length) {
      message.error('excel无数据，导入失败');
      return;
    }
    dispatch({
      type: 'waitMerchant/fetchImportExcel',
      payload: {
        undevelopedMerchantDTOS: excelData,
      },
      callback: () => onClose(),
    });
  };

  // 上传文件模版
  const uploadFilesChange = (file) => {
    if (file.file.status == 'removed') {
      setExcelFile(false);
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
      if (!data['商户信息登记表']) {
        setFileLoading(false);
        message.error('Excel模版不正确');
        return;
      }
      if (!data['商户信息登记表'].length) {
        setFileLoading(false);
        message.error('Excel未写入数据');
        return;
      }
      let dataSources = [];
      dataSources = data['商户信息登记表'].map((item) => {
        return {
          category: item['经营类目'],
          merchantName: item['商户名称'],
          telephone: item['商户电话'],
          provinceName: item['省'],
          cityName: item['市'],
          address: item['地址'],
          businessHub: item['所属商圈'],
          businessTime: item['营业时间'],
          perCapitaConsumption: item['人均消费'],
          storeService: item['店铺服务'],
        };
      });
      setExcelData(dataSources);
      setExcelFile(true);
      setFileLoading(false);
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file.file);
  };
  // 下载模版
  const handleDownExcelModel = () => {
    window.open(
      `https://resource-new.dakale.net/excel/%E5%95%86%E6%88%B7%E4%BF%A1%E6%81%AF%E7%99%BB%E8%AE%B0%E8%A1%A8.xlsx`,
    );
  };

  const uploadProps = {
    listType: 'picture',
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.xls,.xlsx',
  };

  const modalProps = {
    title: '批量导入',
    visible: show,
    onCancel: onClose,
    footer: (
      <Button
        key="submit"
        type="primary"
        disabled={!excelFile}
        // loading={loading || fileLoading}
        onClick={fetchUpExcelData}
      >
        确定导入
      </Button>
    ),
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
export default connect(({ loading }) => ({
  loading: loading.effects['waitMerchant/fetchImportExcel'],
}))(ImportDataModal);
