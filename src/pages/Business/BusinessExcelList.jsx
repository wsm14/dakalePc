import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { useLocation } from 'umi';
import { KeepAlive } from 'react-activation';
import { Button, Upload, message } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessAdd from './components/Excel/BusinessEdit';
import * as XLSX from 'xlsx';
import aliOssUpload from '@/utils/aliOssUpload';

const BusinessExcelList = (props) => {
  const { loading, dispatch } = props;

  const match = useLocation();
  const childRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [initialValues, setInitialValues] = useState(false);

  // 经营类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  useEffect(() => {
    fetchTradeList();
  }, []);

  // table 表头
  const getColumns = [
    {
      title: '商户简称',
      fixed: 'left',
      dataIndex: 'merchantName',
      render: (val) => val || '暂未授权',
    },
    {
      title: '数据缺失',
      dataIndex: 'error',
      render: (val) => (val !== '无' ? <div style={{ color: 'red' }}>{val}</div> : ''),
    },
    {
      title: '是否已录',
      dataIndex: 'status',
      render: (val) => (val ? <div style={{ color: 'green' }}>已录</div> : ''),
    },
    {
      title: '操作',
      dataIndex: 'userMerchantIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              visible: !record.status,
              click: () => {
                aliOssUpload(record.interiorImg).then((res) => {
                  setInitialValues({
                    show: true,
                    value: { ...record, interiorImg: res.toString(), coverImg: res[0].toString() },
                  });
                });
              },
            },
          ]}
        />
      ),
    },
  ];

  const urlToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.crossOrigin = '';
      image.src = url;
      image.onload = function () {
        let canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        const w = image.width;
        const h = image.height;
        const scale = h / w;
        canvas.width = 375;
        canvas.height = 375 * scale;
        context.clearRect(0, 0, 375, 375 * scale);
        // 将图片插入画布并开始绘制
        context.drawImage(image, 0, 0, 375, 375 * scale);
        // result
        let result = canvas.toDataURL('image/jpg');
        resolve(result);
      };
      // 图片加载失败的错误处理
      image.onerror = () => {
        console.log(false);
      };
    });
  };

  const uploadFilesChange = (file) => {
    // 通过FileReader对象读取文件
    let data = {};
    let row = {};
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
        message.success('导入Excel成功！');
      } catch (e) {
        message.error('文件类型不正确！');
      }
      let dataSources = [];
      dataSources = data['商家信息登记表'].map((item, index) => {
        const imgArr = [];
        let error = '无';
        if (!item['负责人手机']) {
          error += ' 注册帐号';
        }
        if (!item['店铺名']) {
          error += ' 商户简称';
        }
        if (!item['店铺地址']) {
          error += ' 详细地址';
        }
        if (!item['门店电话'] && !item['负责人手机']) {
          error += ' 商户电话';
        }
        if (!item['图片']) {
          error += ' 图片';
        } else {
          item['图片']
            .split('https://static.dingtalk.com')
            .filter((i) => i)
            .forEach(async (url, i) => {
              await urlToBase64(url).then((res) => {
                let fileblob = {};
                const arr = res.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                  u8arr[n] = bstr.charCodeAt(n);
                }
                fileblob = new Blob([u8arr], { type: mime });
                const file = new File([fileblob], url + '.jpg', { type: mime });
                imgArr.splice(i, 0, file);
              });
            });
        }
        return {
          userMerchantIdString: index.toString(),
          mobile: item['负责人手机'],
          merchantName: item['店铺名'],
          address: item['店铺地址'],
          telephone: item['门店电话'] || item['负责人手机'],
          interiorImg: imgArr,
          error,
        };
      });
      setDataSource(dataSources);
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file.file);
  };

  return (
    <>
      <span style={{ color: 'red' }}>临时页面</span>
      <DataTableBlock
        btnExtra={
          <Upload
            name="file"
            accept=".xls,.xlsx"
            beforeUpload={() => false}
            onChange={uploadFilesChange}
            showUploadList={false}
          >
            <Button className="dkl_green_btn">导入Excel</Button>
          </Upload>
        }
        cRef={childRef}
        loading={loading.effects['businessList/fetchGetList']}
        columns={getColumns}
        rowKey={(record) => `${record.userMerchantIdString}`}
        dispatchType="businessList/fetchGetList"
        list={dataSource}
      ></DataTableBlock>
      <BusinessAdd
        cRef={childRef}
        visible={initialValues.show}
        onClose={() => setInitialValues({ show: false, value: {} })}
        initialValues={initialValues.value}
        dataSource={dataSource}
        setDataSource={setDataSource}
      ></BusinessAdd>
    </>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(BusinessExcelList);
