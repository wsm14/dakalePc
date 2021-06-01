import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { BUSINESS_STATUS_AUDIT } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import BusinessAuditDetailShow from './components/Audit/BusinessAuditDetailShow';
import BusinessAuditDetailList from './components/Audit/BusinessAuditDetailList';
import BusinessEdit from './components/BusinessList/BusinessEdit';

const BusinessAuditList = (props) => {
  const { businessAudit, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleDetailList, setVisibleDetailList] = useState(false);
  const [visibleAuditDetail, setVisibleAuditDetail] = useState(false);

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
      select: BUSINESS_STATUS_AUDIT,
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
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
      ellipsis: true,
    },
    {
      title: '所在城市',
      dataIndex: 'cityName',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      ellipsis: true,
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
      type: 'handle',
      dataIndex: 'userMerchantVerifyId',
      render: (val, record) => [
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
      ],
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
    setVisibleAuditDetail({
      show: true,
      initialValues,
      verifyStatus,
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

  //表格额外的按钮
  const extraBtn = [
    {
      auth: 'checkDetail',
      text: '审核记录',
      onClick: () => setVisibleDetailList(true),
    },
  ];

  return (
    <>
      <TableDataBlock
        keepData
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ verifyStatus: '1' }}
        rowKey={(record) => `${record.userMerchantVerifyId}`}
        dispatchType="businessAudit/fetchGetList"
        {...businessAudit.list}
      ></TableDataBlock>
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
      <BusinessAuditDetailShow
        visible={visibleAuditDetail}
        onClose={() => setVisibleAuditDetail(false)}
      ></BusinessAuditDetailShow>
    </>
  );
};

export default connect(({ businessAudit, loading }) => ({
  businessAudit,
  loading: loading.models.businessAudit,
}))(BusinessAuditList);
