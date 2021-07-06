import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { SERVICE_TYPE, DIVISION_TEMPLATE_TYPE, TEMPLATE_CREATE_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import ExtraButton from '@/components/ExtraButton';
import TemplateDrawSet from './components/CommissionTemplate/TemplateDrawSet';
import TemplateDetail from './components/CommissionTemplate/TemplateDetail';
const tabList = [
  {
    key: 'specialGoods',
    tab: '特惠商品',
  },
  {
    key: 'reduceCoupon',
    tab: '优惠券',
  },
];

const CommissionTempate = (props) => {
  const { commissionTemplate, loading, dispatch, tradeList, cRef } = props;
  const tableRef = useRef();
  const [tabKey, setTabKey] = useState('specialGoods');
  const [visibleSet, setVisibleSet] = useState(false);
  const [visibleInfo, setVisibleInfo] = useState(false);

  useEffect(() => {
    tableRef.current.fetchGetData({ serviceType: tabKey });
    getCateList();
  }, [tabKey]);

  //获取行业类目
  const getCateList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  const fetchGetDetail = (divisionTemplateId, type) => {
    dispatch({
      type: 'commissionTemplate/fetchDivisionTemplateDetail',
      payload: {
        divisionTemplateId,
      },
      callback: (detail) => {
        if (type == 'info') {
          setVisibleInfo({ show: true, detail });
        } else {
          setVisibleSet({ show: true, type, detail });
        }
      },
    });
  };

  const globalSearch = [
    {
      label: '分佣方式',
      name: 'divisionTemplateType',
      type: 'select',
      select: DIVISION_TEMPLATE_TYPE,
    },
    {
      label: '关联行业',
      name: 'categoryId',
      type: 'select',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString' },
    },
  ];

  const globalColum = [
    {
      title: '关联行业',
      align: 'center',
      dataIndex: 'categoryName',
    },
    {
      title: '类别',
      align: 'center',
      dataIndex: 'serviceType',
      render: (val) => SERVICE_TYPE[val],
    },
    {
      title: '分佣方式',
      align: 'center',
      dataIndex: 'divisionTemplateType',
      render: (val) => DIVISION_TEMPLATE_TYPE[val],
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'creatorName',
      render: (val, row) => `${TEMPLATE_CREATE_TYPE[row.creatorType]}--${val}`,
    },
    {
      type: 'handle',
      dataIndex: 'divisionTemplateId',
      width: 180,
      render: (val, record) => {
        const { status } = record;
        return [
          {
            type: 'info',
            title: '详情',
            click: () => fetchGetDetail(val, 'info'),
          },
          {
            type: 'edit',
            title: '编辑',
            click: () => fetchGetDetail(val, 'edit'),
          },
        ];
      },
    },
  ];

  const extraBtn = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisibleSet({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
        }}
        btnExtra={extraBtn}
        cRef={tableRef}
        loading={loading}
        columns={globalColum}
        searchItems={globalSearch}
        rowKey={(record) => `${record.divisionTemplateId}`}
        dispatchType="commissionTemplate/fetchDivisionTemplateList"
        params={{ serviceType: tabKey }}
        {...commissionTemplate}
      ></TableDataBlock>
      {/* 新增/编辑 */}
      <TemplateDrawSet
        visible={visibleSet}
        cRef={tableRef}
        tabKey={tabKey}
        tradeList={tradeList}
        onClose={() => setVisibleSet(false)}
      ></TemplateDrawSet>
      {/* 详情 */}
      <TemplateDetail
        visible={visibleInfo}
        tabKey={tabKey}
        tradeList={tradeList}
        onClose={() => setVisibleInfo(false)}
      ></TemplateDetail>
    </>
  );
};

export default connect(({ commissionTemplate, loading, sysTradeList }) => ({
  commissionTemplate,
  tradeList: sysTradeList.list.list,
  loading: loading.models.commissionTemplate,
}))(CommissionTempate);
