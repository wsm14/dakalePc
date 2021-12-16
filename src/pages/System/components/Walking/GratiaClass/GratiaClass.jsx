import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const GratiaClassManage = (props) => {
  const { loading, dispatch, visible = {}, onClose, gratiaClassInfoList } = props;
  const { show, detail = {} } = visible;
  const { userOs, version, area, cityCode } = detail;

  const childRef = useRef();

  // 删除
  const fetchDetailDel = (configSpecialGoodsCategoryId) => {
    dispatch({
      type: 'walkingManage/fetchUpdateConfigSpecialGoodsCategory',
      payload: {
        configSpecialGoodsCategoryId,
        flag: 'delete',
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '类目',
      align: 'center',
      // editable: true,
      dataIndex: 'categoryName',
      inputType: 'select',
    },
    {
      title: '显示文案',
      align: 'center',
      // editable: true,
      dataIndex: 'showCopy',
    },
    {
      title: '副标题',
      align: 'center',
      // editable: true,
      required: false,
      dataIndex: 'subtitle',
    },
    {
      type: 'handle',
      dataIndex: 'configSpecialGoodsCategoryId',
      render: (val, record) => {
        return [
          {
            type: 'edit',
            auth: true,
            click: () => {},
          },
          {
            type: 'del',
            auth: true,
            click: () => fetchDetailDel(val),
          },
        ];
      },
    },
  ];

  const modalProps = {
    title: '特惠商品类目配置',
    visible: show,
    onCancel: onClose,
    width: 1000,
    maskClosable: true,
    footer: false,
  };
  const cardBtnList = [
    {
      auth: true,
      text: '新增',
      className: 'dkl_blue_btn',
      onClick: () => {
        setVisibleDrawer({ type: 'add', show: true, detail: { userOs, version, areaType } });
      },
    },
  ];
  return (
    <Modal destroyOnClose {...modalProps}>
      <TableDataBlock
        noCard={false}
        btnExtra={cardBtnList}
        cRef={childRef}
        loading={loading}
        pagination={false}
        columns={getColumns}
        rowKey={(record) => `${record.categoryId}`}
        params={{ userOs, version, area, cityCode, isAutomatic: 0, deleteFlag: 1 }}
        dispatchType="walkingManage/fetchListConfigSpecialGoodsCategoryInfo"
        {...gratiaClassInfoList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ walkingManage, loading }) => ({
  gratiaClassInfoList: walkingManage.gratiaClassInfoList,
  loading: loading.effects['walkingManage/fetchListConfigSpecialGoodsCategoryInfo'],
}))(GratiaClassManage);
