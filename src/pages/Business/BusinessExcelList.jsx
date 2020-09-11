import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Upload } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import BusinessAdd from './components/BusinessList/BusinessEdit';
import * as XLSX from 'xlsx';
import ExportJsonExcel from 'js-export-excel';

const BusinessExcelList = (props) => {
  const { businessList, tradeList, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleAdd, setVisibleAdd] = useState(false);

  // table 表头
  const getColumns = [
    {
      title: '商户简称',
      fixed: 'left',
      dataIndex: 'merchantName',
      render: (val) => val || '暂未授权',
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
              // click: () => fetchGetDetail(val),
            },
          ]}
        />
      ),
    },
  ];

  const uploadFilesChange = (file) => {
    console.log(file);
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        // 存储获取到的数据
        let data = {
          sg_input_rules: [],
        };
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          let tempData = [];
          // esline-disable-next-line
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data[sheet] = tempData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          }
        }
        //上传成功啦,data为上传后的数据
        this.setState({
          data: data.sg_input_rules,
        });
        // 最终获取到并且格式化后的 json 数据
        message.success('上传成功！');
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件类型不正确！');
      }
      console.log(this.state.data);
      let columns = [];
      let dataSource = [];
      let keys = Object.keys(this.state.data[0]);
      columns = keys.map((item, index) => {
        return {
          title: item,
          dataIndex: item,
          key: item,
        };
      });
      columns.push({
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a style={{ marginRight: 16 }}>Invite {record.name}</a>
            <a>Delete</a>
          </span>
        ),
      });
      dataSource = this.state.data.map((item, index) => {
        return {
          key: index.toString(),
          规则协议: item['规则协议'],
          端口: item['端口'],
          来源: item['来源'],
          策略: item['策略'],
          备注: item['备注'],
          修改时间: item['修改时间'],
        };
      });
      this.setState({
        tableHeader: columns,
        tableData: dataSource,
      });
      console.log(this.state.tableData);
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file.file);
  };

  return (
    <>
      <DataTableBlock
        btnExtra={
          <Upload
            name="file"
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
        {...businessList}
      ></DataTableBlock>
      <BusinessAdd
        cRef={childRef}
        visible={visibleAdd}
        onClose={() => setVisibleAdd(false)}
      ></BusinessAdd>
    </>
  );
};

export default connect(({ businessList, sysTradeList, loading }) => ({
  businessList,
  tradeList: sysTradeList.list.list,
  loading,
}))(BusinessExcelList);
