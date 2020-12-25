import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { BUSINESS_STATUS_AUDIT } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import businessAuditDetailShow from './components/Audit/BusinessAuditDetailShow';
import BusinessAuditDetailList from './components/Audit/BusinessAuditDetailList';
import BusinessEdit from './components/BusinessList/BusinessEdit';

const BusinessAuditList = (props) => {
  const { businessAudit, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleDetailList, setVisibleDetailList] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '店铺名称',
      name: 'merchantName',
    },
    {
      label: '店铺账号',
      name: 'mobile',
    },
    {
      label: '审核状态',
      name: 'verifyStatus',
      type: 'select',
      select: { list: BUSINESS_STATUS_AUDIT },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '店铺账号',
      fixed: 'left',
      dataIndex: 'account',
      render: (val) => val || '暂未授权',
    },
    {
      title: '店铺名称',
      fixed: 'left',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '所在城市',
      dataIndex: 'cityName',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '所属商圈',
      dataIndex: 'businessHub',
    },
    {
      title: '经营类目',
      align: 'center',
      dataIndex: 'topCategoryName',
      render: (val, row) => `${val} / ${row.categoryName}`,
    },
    {
      title: '经营面积',
      align: 'right',
      dataIndex: 'businessArea',
      render: (val) => (val ? `${val}m²` : '--'),
    },
    {
      title: '申请时间',
      align: 'center',
      dataIndex: 'applyTime',
    },
    {
      title: '审核时间',
      align: 'center',
      dataIndex: 'verifyTime',
      render: (val) => val || '--',
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'verifyStatus',
      render: (val) => BUSINESS_STATUS_AUDIT[val],
    },
    {
      title: '操作',
      dataIndex: 'userMerchantVerifyId',
      align: 'right',
      fixed: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'check',
              visible: record.verifyStatus === '1',
              click: () => fetchGetDetail(val),
            },
            {
              type: 'eye',
              visible: record.verifyStatus != '1',
              click: () => handleShowUserDetail(record, record.verifyStatus),
            },
          ]}
        />
      ),
    },
  ];

  // 获取商家详情
  const fetchGetDetail = (userMerchantVerifyId) => {
    dispatch({
      type: 'businessAudit/fetchMerchantAuditDetail',
      payload: { userMerchantVerifyId },
      callback: (record) => setVisible({ type: 'audit', show: true, record }),
    });
  };

  // 用户详情展示
  const handleShowUserDetail = (initialValues, verifyStatus) => {
    dispatch({
      type: 'drawerForm/show',
      payload: businessAuditDetailShow({ initialValues, verifyStatus }),
    });
  };

  // 经营类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  useEffect(() => {
    fetchTradeList();
  }, []);

  return (
    <>
      <DataTableBlock
        keepName="审核列表"
        btnExtra={
          <AuthConsumer auth="checkDetail">
            <Button className="dkl_green_btn" onClick={() => setVisibleDetailList(true)}>
              审核记录
            </Button>
          </AuthConsumer>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ verifyStatus: 1 }}
        rowKey={(record) => `${record.userMerchantVerifyId}`}
        dispatchType="businessAudit/fetchGetList"
        {...businessAudit.list}
      ></DataTableBlock>
      <BusinessEdit
        cRef={childRef}
        visible={visible}
        initialValues={visible.record}
        onClose={() => setVisible(false)}
      ></BusinessEdit>
      <BusinessAuditDetailList
        visible={visibleDetailList}
        setVisible={setVisibleDetailList}
      ></BusinessAuditDetailList>
    </>
  );
};

export default connect(({ businessAudit, loading }) => ({
  businessAudit,
  loading: loading.models.businessAudit,
}))(BusinessAuditList);
