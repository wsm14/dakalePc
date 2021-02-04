import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { SALE_ACCOUNT_TYPE, COMPANY_PROV_STATUS } from '@/common/constant';
import CITYJSON from '@/common/city';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import SaleAccountDrawer from './components/Sale/SaleAccountDrawer';

const SaleAccount = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  // 选择框类型 判断所属地区可选项目
  const [agentType, setAgentType] = useState(undefined);
  // drawer { type: add新增/edit修改/detail详情 detail详情数据 show显示/隐藏}
  const [visible, setVisible] = useState(false);

  // 获取账户详情 sellMainId type类型：detail 详情
  const fetchSaleAccountDetail = ({ sellMainId, type }) => {
    dispatch({
      type: 'saleAccount/fetchSaleAccountDetail',
      payload: {
        sellMainId,
      },
      callback: (detail) => setVisible({ type, show: true, detail }),
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '类型',
      name: 'agentType',
      type: 'select',
      select: SALE_ACCOUNT_TYPE,
      handle: (form) => ({
        onChange: (val) => {
          setAgentType(val);
          form.setFieldsValue({ agentCode: undefined });
        },
      }),
    },
    {
      label: '所属地区',
      name: 'agentCode',
      type: 'cascader',
      select: {
        undefined: [],
        province: CITYJSON.map((item) => ({ label: item.label, value: item.value })),
        city: CITYJSON.map((item) => ({
          label: item.label,
          value: item.value,
          children: item.children.map((citem) => ({ ...citem, children: undefined })),
        })),
        district: undefined,
      }[agentType],
    },
    {
      label: '联系人姓名',
      name: 'adminName',
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: COMPANY_PROV_STATUS,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      dataIndex: 'districtName',
      fixed: 'left',
      render: (val, row, i) => i + 1,
    },
    {
      title: '类型',
      fixed: 'left',
      dataIndex: 'agentType',
      render: (val) => SALE_ACCOUNT_TYPE[val],
    },
    {
      title: '所属地区',
      align: 'center',
      fixed: 'left',
      dataIndex: 'agentName',
    },
    {
      title: '联系人姓名',
      align: 'center',
      dataIndex: 'sellMainName',
    },
    {
      title: '联系人电话',
      align: 'center',
      dataIndex: 'contactMobile',
      render: (val) => val || '--',
    },
    {
      title: '开通日期',
      align: 'right',
      dataIndex: 'agentDate',
    },
    {
      title: '状态',
      align: 'right',
      dataIndex: 'status',
      render: (val) => COMPANY_PROV_STATUS[val],
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'sellMainId',
      render: (sellMainId, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'info',
              click: () => fetchSaleAccountDetail({ type: 'detail', sellMainId }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        btnExtra={
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              key="1"
              onClick={() => setVisible({ type: 'add', show: true })}
            >
              新增
            </Button>
          </AuthConsumer>
        }
        resetSearch={() => setAgentType(undefined)}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.sellMainId}`}
        dispatchType="saleAccount/fetchGetList"
        {...list}
      ></TableDataBlock>
      <SaleAccountDrawer childRef={childRef} visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ saleAccount, loading }) => ({
  list: saleAccount.list,
  loading: loading.models.saleAccount,
}))(SaleAccount);
