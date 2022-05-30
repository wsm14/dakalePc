import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { SERVICE_TYPE, DIVISION_TEMPLATE_TYPE, TEMPLATE_CREATE_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import TemplateDrawSet from './components/CommissionTemplate/TemplateDrawSet';
import TemplateDetail from './components/CommissionTemplate/TemplateDetail';

const CommissionTempate = (props) => {
  const { commissionTemplate, loading, dispatch, tradeList, CategoryList } = props;
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
    dispatch({
      type: 'Category/fetchGetList',
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
      label: '关联类目',
      name: 'classifyId',
      type: 'select',
      select: CategoryList,
      fieldNames: { label: 'classifyName', value: 'classifyId' },
      show: tabKey === 'commerceGoods',
    },
    {
      label: '关联行业',
      name: 'categoryId',
      type: 'select',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString' },
      show: tabKey !== 'commerceGoods',
    },
  ];

  const globalColum = [
    {
      title: tabKey === 'commerceGoods' ? '关联类目' : '关联行业',
      align: 'center',
      dataIndex: tabKey === 'commerceGoods' ? 'classifyName' : 'categoryName',
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
          tabList: Object.keys(SERVICE_TYPE).map((item) => ({
            key: item,
            tab: SERVICE_TYPE[item],
          })),
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
        CategoryList={CategoryList}
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

export default connect(({ commissionTemplate, loading, sysTradeList, Category }) => ({
  commissionTemplate,
  tradeList: sysTradeList.list.list,
  CategoryList: Category.list.list,
  loading: loading.models.commissionTemplate,
}))(CommissionTempate);
