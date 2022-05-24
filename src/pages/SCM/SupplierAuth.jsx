import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Card, Tag } from 'antd';
import { checkCityName } from '@/utils/utils';
import { BUSINESS_TYPE, GOODS_CLASS_TYPE, BANK_CHECK_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import SupplierAuthDetail from './components/SupplierAuth/SupplierAuthDetail';

const tabList = [
  {
    key: '0',
    tab: '待审核',
  },
  {
    key: '1',
    tab: '已审核',
  },
];

const SupplierAuth = (props) => {
  const tableRef = useRef();
  const { dispatch, loading, list } = props;

  const [tabkey, setTabKey] = useState('0');
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示

  //组建公用的搜索条件
  const searchItems = [
    {
      label: '集团/店铺名',
      name: 'ownerId',
      type: 'merchant',
      placeholder: '请输入集团或店铺名称',
    },
    {
      label: '所在城市',
      name: 'districtCode',
      type: 'cascader',
      //   valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      //   onChange: (value, option) => {
      //     console.log(value);
      //     console.log(option);
      //   },
    },
    {
      label: '申请时间',
      type: 'rangePicker',
      name: 'createTimeBegin',
      end: 'createTimeEnd',
      show: tabkey === '0',
    },
    {
      label: '审核结果',
      name: 'auditResult',
      type: 'select',
      show: tabkey === '1',
      select: BANK_CHECK_STATUS,
    },
    {
      label: '审核时间',
      type: 'rangePicker',
      name: 'auditTimeBegin',
      end: 'auditTimeEnd',
      show: tabkey === '1',
    },
  ];

  //tab自组件Table公用的colum数据部分
  const getColumns = [
    {
      title: '店铺账号/集团ID',
      dataIndex: 'ownerId',
    },
    {
      title: '店铺/集团名称',
      dataIndex: 'ownerName',
      render: (val, row) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Ellipsis tooltip length={8} style={{ marginRight: 5 }}>
              {val}
            </Ellipsis>
            <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
          </div>
        );
      },
    },
    {
      title: '所在城市',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      show: tabkey === '1',
    },
    {
      title: '审核人',
      dataIndex: 'auditor',
      show: tabkey === '1',
    },
    {
      title: '审核结果',
      dataIndex: 'auditResult',
      show: tabkey === '1',
      render: (val) => BANK_CHECK_STATUS[val],
    },
    {
      title: '驳回原因',
      dataIndex: 'rejectReason',
      show: tabkey === '1',
      render: (val) => (
        <Ellipsis tooltip length={10}>
          {val}
        </Ellipsis>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'ownerBankBindingInfoRecordId',
      render: (val, record) => {
        return [
          {
            type: 'info',
            title: '详情',
            click: () => fetchSpecialGoodsDetail(val, 'info'),
            visible: tabkey === '1',
          },
          {
            type: 'check',
            title: '审核',
            click: () => fetchSpecialGoodsDetail(val, 'check'),
            visible: tabkey === '0',
          },
        ];
      },
    },
  ];

  // 获取详情
  const fetchSpecialGoodsDetail = (val, type) => {
    dispatch({
      type: 'bankChangeCheck/fetchGetBankBindingInfoRecordById',
      payload: { ownerBankBindingInfoRecordId: val },
      callback: (detail) => {
        setVisibleInfo({ type, detail, show: true });
      },
    });
  };
  const handleTabChange = (key) => {
    setTabKey(key);
    tableRef?.current?.fetchGetData({ auditStatus: key });
  };
  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={handleTabChange}>
        <TableDataBlock
          noCard={false}
          cRef={tableRef}
          loading={loading}
          columns={getColumns}
          searchItems={searchItems}
          params={{ auditStatus: tabkey }}
          rowKey={(record) => `${record.ownerBankBindingInfoRecordId}`}
          dispatchType="bankChangeCheck/fetchGetList"
          {...list}
        ></TableDataBlock>
      </Card>
      {/* 详情 审核 */}
      <SupplierAuthDetail
        visible={visibleInfo}
        cRef={tableRef}
        onClose={() => setVisibleInfo(false)}
      ></SupplierAuthDetail>
    </>
  );
};
export default connect(({ loading, bankChangeCheck }) => ({
  list: bankChangeCheck.list,
  loading: loading.models.bankChangeCheck,
}))(SupplierAuth);
