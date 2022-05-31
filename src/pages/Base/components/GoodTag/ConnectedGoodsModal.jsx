import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
// import SupplierBrandDrawer from './Brand/SupplierBrandDrawer';

const tabList = [
  {
    key: 'commerceGoods',
    tab: '电商品',
  },
  {
    key: 'specialGoods',
    tab: '特惠商品',
  },
];

const ConnectedGoodsModal = (props) => {
  const { visible, onClose, dispatch, configGoodsList, loading } = props;
  const { show = false, id, name } = visible;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('commerceGoods');
  const [visibleDrawer, setVisibleDrawer] = useState({ mode: 'info', show: false, detail: {} });

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ goodsType: tabKey });
  }, [tabKey]);

  const getColumns = [
    {
      title: '商品主图',
      align: 'center',
      dataIndex: 'brandName',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '商品名称/ID',
      align: 'center',
      dataIndex: 'authorizeCompany',
    },
    {
      title: '所属类目/供应商',
      align: 'center',
      dataIndex: 'startDate',
    },
    {
      title: '零售价',
      align: 'center',
      dataIndex: 'endDate',
    },
    {
      title: '商品状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ['失效', '有效'][val],
    },
    {
      type: 'handle',
      dataIndex: 'goodsId',
      render: (val, row, index) => [
        {
          type: 'del',
          title: '移除',
          auth: true,
          click: () => fetchDelBrand(val),
        },
      ],
    },
  ];

  // 删除
  const fetchDelBrand = (supplierBrandId) => {
    dispatch({
      type: 'supplierManage/fetchSupplierBrandSet',
      payload: { supplierBrandId, mode: 'del' },
      callback: childRef.current.fetchGetData,
    });
  };

  const btnList = [
    {
      text: '新增',
      onClick: () => setVisibleDrawer({ show: true, mode: 'add' }),
    },
  ];

  return (
    <>
      <Modal
        title={`关联商品 - ${name}`}
        width={1150}
        destroyOnClose
        footer={null}
        visible={show}
        zIndex={100}
        onCancel={onClose}
      >
        <TableDataBlock
          cardProps={{
            tabList: tabList,
            activeTabKey: tabKey,
            onTabChange: setTabKey,
          }}
          size="middle"
          noCard={false}
          cRef={childRef}
          btnExtra={btnList}
          loading={loading}
          columns={getColumns}
          params={{ goodsTagId: id, goodsType: tabKey }}
          rowKey={(row) => `${row.goodsId}`}
          dispatchType="goodsTag/fetchConfigGoodsList"
          {...configGoodsList}
        ></TableDataBlock>
      </Modal>
      {/* <SupplierBrandDrawer
        childRef={childRef}
        supplierId={id}
        visible={visibleDrawer}
        getDetail={fetchGetDetail}
        onClose={() => setVisibleDrawer(false)}
      ></SupplierBrandDrawer> */}
    </>
  );
};

export default connect(({ goodsTag, loading }) => ({
  configGoodsList: goodsTag.configGoodsList,
  loading: loading.effects['goodsTag/fetchConfigGoodsList'],
}))(ConnectedGoodsModal);
