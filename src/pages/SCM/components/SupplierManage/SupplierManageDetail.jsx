import React, { useState } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { RefuseModal } from '@/components/PublicComponents';
import ExtraButton from '@/components/ExtraButton';
import DrawerCondition from '@/components/DrawerCondition';
import BaseInfo from './Detail/BaseInfo';
import IntelligenceInfo from './Detail/IntelligenceInfo';
import AccountInfo from './Detail/AccountInfo';
import SettlementInfo from './Detail/SettlementInfo';

const { TabPane } = Tabs;

const SupplierManageDetail = (props) => {
  const { visible, onClose, getDetail, loading, dispatch, total, cRef } = props;

  const { show = false, detail = {}, index } = visible;
  const { supplierId } = detail;

  const [visibleRefuse, setVisibleRefuse] = useState(false); // 审核拒绝 下架原因

  // 启用
  const fetchSupplierEnable = () => {
    dispatch({
      type: 'supplierManage/fetchSupplierEnable',
      payload: { supplierId },
      callback: () => {
        cRef.current.fetchGetData();
        onClose();
      },
    });
  };

  // 禁用
  const fetchSupplierDisable = (values) => {
    dispatch({
      type: 'supplierManage/fetchSupplierDisable',
      payload: {
        ...values,
        supplierId,
      },
      callback: () => {
        cRef.current.fetchGetData();
        setVisibleRefuse(false);
        onClose();
      },
    });
  };

  // 禁用启用按钮
  const handleSupplierStatus = (type) => {
    if (!type) setVisibleRefuse({ show: true, formProps: { type: 'disable', key: 'reason' } });
    else fetchSupplierEnable();
  };

  const btnList = [
    {
      auth: 'status',
      text: ['启用', '禁用'][detail.status],
      danger: [false, true][detail.status],
      onClick: () => handleSupplierStatus(1 ^ Number(detail.status)),
    },
    {
      auth: 'edit',
      text: '编辑',
      typeBtn: 'primary',
      onClick: () => {
        onClose();
        getDetail(index, 'edit');
      },
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: '详情',
    visible: show,
    loading: loading.effects['supplierManage/fetchGetSupplierManageDetail'],
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size),
    },
    footer: (
      <ExtraButton
        list={btnList}
        loading={loading.effects['supplierManage/fetchSupplierEnable']}
      ></ExtraButton>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <Tabs type="card">
          <TabPane tab="基础信息" key="1">
            <BaseInfo detail={detail}></BaseInfo>
          </TabPane>
          <TabPane tab="供应商资质" key="2">
            <IntelligenceInfo detail={detail}></IntelligenceInfo>
          </TabPane>
          {/* <TabPane tab="仓库信息" key="3">
            <WarehouseInfo  detail={detail}></WarehouseInfo>
          </TabPane> */}
          {/* 未激活时不显示账户信息和结算记录 */}
          {detail.bankStatus === '3' && (
            <>
              <TabPane tab="账户信息" key="4">
                <AccountInfo detail={detail}></AccountInfo>
              </TabPane>
              <TabPane tab="结算记录" key="5">
                <SettlementInfo supplierId={supplierId} detail={detail}></SettlementInfo>
              </TabPane>
            </>
          )}
        </Tabs>
      </DrawerCondition>
      {/* 禁用原因 */}
      <RefuseModal
        cRef={cRef}
        visible={visibleRefuse}
        handleUpData={fetchSupplierDisable}
        onClose={() => setVisibleRefuse(false)}
        loading={loading.effects['supplierManage/fetchSupplierDisable']}
      ></RefuseModal>
    </>
  );
};

export default connect(({ loading, supplierManage }) => ({
  loading,
  total: supplierManage.list.list.length,
}))(SupplierManageDetail);
