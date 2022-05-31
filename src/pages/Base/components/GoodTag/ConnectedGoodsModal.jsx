import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
// import SupplierBrandDrawer from './Brand/SupplierBrandDrawer';

const ConnectedGoodsModal = (props) => {
  const { visible, onClose, dispatch, brandList, loading } = props;
  const { show = false, id, name } = visible;

  const childRef = useRef();
  const [visibleDrawer, setVisibleDrawer] = useState({ mode: 'info', show: false, detail: {} });

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
      dataIndex: 'supplierBrandId',
      render: (val, row, index) => [
        {
          type: 'eye',
          auth: true,
          click: () => fetchGetDetail(index, 'info'),
        },
        {
          type: 'edit',
          auth: true,
          click: () => fetchGetDetail(index, 'edit'),
        },
        {
          type: 'del',
          auth: true,
          popText: (
            <div>
              删除后该供应商将无法发布该品牌下的商品<div>确定要删除吗？</div>
            </div>
          ),
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

  // 获取详情
  const fetchGetDetail = (index, mode) => {
    const { supplierBrandId } = brandList.list[index];
    dispatch({
      type: 'supplierManage/fetchSupplierBrandDetail',
      payload: { supplierBrandId, mode },
      callback: (detail) => {
        setVisibleDrawer({ mode, show: true, index, detail });
      },
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
        title={`授权品牌列表 - ${name}`}
        width={1150}
        destroyOnClose
        footer={null}
        visible={show}
        zIndex={100}
        onCancel={onClose}
      >
        <TableDataBlock
          size="middle"
          noCard={false}
          cRef={childRef}
          btnExtra={btnList}
          loading={loading}
          columns={getColumns}
          params={{ supplierId: id }}
          rowKey={(row) => `${row.supplierBrandId}`}
          dispatchType="supplierManage/fetchSupplierBrandList"
          {...brandList}
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

export default connect(({ supplierManage, loading }) => ({
  brandList: supplierManage.brandList,
  loading: loading.models.supplierManage,
}))(ConnectedGoodsModal);
