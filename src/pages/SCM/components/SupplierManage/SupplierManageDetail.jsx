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

  const { supplierVerifyId } = detail;

  const [visibleRefuse, setVisibleRefuse] = useState(false); // 审核拒绝 下架原因

  // 审核通过
  const handleVerifyAllow = () => {
    dispatch({
      type: 'supplierAuth/fetchSupplierVerifyAllow',
      payload: { supplierVerifyId },
      callback: () => {
        cRef.current.fetchGetData();
        onClose();
      },
    });
  };

  // 审核驳回
  const fetchVerifyReject = (values) => {
    dispatch({
      type: 'supplierAuth/fetchSupplierVerifyReject',
      payload: {
        ...values,
        supplierVerifyId,
      },
      callback: () => {
        setVisibleRefuse(false);
        onClose();
        childRef.current.fetchGetData();
      },
    });
  };

  // 禁用启用按钮
  const handleSupplierStatus = (type) => {
    if (!type) setVisibleRefuse({ show: true, formProps: { type: 'disable', key: 'reason' } });
    else console.log(1);
  };

  const btnList = [
    {
      auth: 'status',
      onClick: () => handleSupplierStatus(1 ^ Number(detail.status)),
      text: ['启用', '禁用'][detail.status],
    },
    {
      auth: 'edit',
      onClick: () => handleVerifyAllow,
      danger: true,
      text: '编辑',
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
        loading={
          loading.effects['supplierManage/fetchGetSupplierVerifyAllow'] ||
          loading.effects['supplierManage/fetchGetSupplierVerifyReject']
        }
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
          <TabPane tab="账户信息" key="4">
            <AccountInfo detail={detail}></AccountInfo>
          </TabPane>
          <TabPane tab="结算记录" key="5">
            <SettlementInfo detail={detail}></SettlementInfo>
          </TabPane>
        </Tabs>
      </DrawerCondition>
      {/* 禁用原因 */}
      <RefuseModal
        cRef={cRef}
        visible={visibleRefuse}
        handleUpData={fetchVerifyReject}
        loading={loading}
        onClose={() => setVisibleRefuse(false)}
      ></RefuseModal>
    </>
  );
};

export default connect(({ loading, supplierManage }) => ({
  total: supplierManage.list.length,
  loading,
}))(SupplierManageDetail);
