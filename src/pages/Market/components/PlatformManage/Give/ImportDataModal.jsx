import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Button, Upload, message, Typography } from 'antd';
import * as XLSX from 'xlsx';
import { UploadOutlined } from '@ant-design/icons';
import ImportRecord from './ImportRecord';

const ImportDataModal = (props) => {
  const { visible, onClose, setUserList, dispatch, loading, childRef } = props;
  const { show = false, pushObj, detail } = visible;
  // 是否存在有效文件
  const [excelFile, setExcelFile] = useState(false);
  // excel数据储存
  const [excelData, setExcelData] = useState([]);

  const [fileLoading, setFileLoading] = useState(false);

  const [recordVisible, setRecordVisible] = useState(false); //导入记录

  // 导入时需要的参数配置等
  const excelProps = {
    specific: {
      excelName: '用户信息表', // excel 表名
      // excel 导出列
      excelRow: (item) => ({
        id: item['用户ID'],
        // mobile: item['手机号'],
        // username: item['用户名'],
        // level: item['级别'],
      }),
      // 模版链接
      excelModelUrl:
        'https://dakale-resource-new.oss-cn-hangzhou.aliyuncs.com/excel/%E6%89%B9%E9%87%8F%E9%80%81%E5%88%B8-%E6%A8%A1%E6%9D%BF.xlsx',
    },
  }['specific'];

  // 上传文件模版数据
  const fetchUpExcelData = () => {
    console.log(excelData, 'dddd');
    if (!Object.keys(excelData).length || !excelData.list.length) {
      message.error('excel无数据，导入失败');
      return;
    }
    dispatch({
      type: 'platformCoupon/fetchGivePlatformCoupon',
      payload: {
        giveFlag: 'batch',
        platformCouponId: detail.platformCouponId, // 赠送数据
        userIds: excelData.keys,
      },
      callback: () => {
        onClose();
        childRef.current.fetchGetData();
      },
    });
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
      console.log(data, 'data');
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
      const keys = dataSources.map((item) => item.id);
      //添加userIdString
      dataSources.forEach((items) => {
        items.userIdString = items.id;
        items.levelName = items.level;
      });
      console.log(keys, 'keys', dataSources);
      setExcelData({ keys, list: dataSources });
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
    title: `批量导入 - ${detail?.couponName}`,
    visible: show,
    onCancel: onClose,
    confirmLoading: fileLoading,
    zIndex: 1001,
    footer: [
      <Typography.Link
        key="cancle"
        onClick={() => {
          setRecordVisible({ show: true, detail: detail });
        }}
        style={{ float: 'left', marginTop: 5 }}
      >
        查看导入记录
      </Typography.Link>,
      <Button key="ok" type="primary" onClick={fetchUpExcelData} loading={loading}>
        确定导入
      </Button>,
    ],
  };

  return (
    <>
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

        <div style={{ marginTop: 20, color: 'red' }}>
          注：导入成功后将直接赠送到用户账户，请谨慎操作。
        </div>
      </Modal>

      {/*导入记录  */}
      <ImportRecord
        visible={recordVisible}
        onClose={() => {
          setRecordVisible(false);
        }}
      ></ImportRecord>
    </>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['platformCoupon/fetchGivePlatformCoupon'],
}))(ImportDataModal);
