import React from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const CommunityDetail = (props) => {
  const { cRef, visible, onClose, dispatch, loading } = props;

  const { type = 'info', show = false, detail = {} } = visible;

  // 信息
  const formItems = [
    {
      label: '提现单号',
      name: 'incomeSn',
    },
    {
      label: '提现日期',
      name: 'createTime',
    },
    {
      label: '提现账户',
      name: 'withdrawalAccount',
    },
    {
      label: `需提现金额`,
      name: 'totalFee',
      render: (val) => `￥${val}`,
    },
    {
      label: `服务费(${detail.chargeRate * 100}%)`,
      name: 'chargeCash',
      render: (val) => `-￥${val}`,
    },
    {
      label: '卡豆抵扣',
      name: 'chargeBean',
      render: (val) => (Number(val) > 0 ? `${val}豆\n(￥${val / 100})` : 0),
    },
    {
      label: '实际提现金额',
      name: 'withdrawalFee',
      render: (val) => `￥${val}`,
    },
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '用户账号',
      name: 'mobile',
    },
  ];

  const otherData = [
    {
      label: '交易截图',
      name: 'image',
      type: 'upload',
    },
    {
      label: '文字补充说明',
      name: 'mark',
    },
  ];

  // 审核通过
  const fetchAuditAllow = () => {
    dispatch({
      type: 'withdrawAudit/fetchWithdrawAuditAllow',
      payload: { directWithdrawalAuditId: detail.directWithdrawalAuditId },
      callback: () => {
        cRef.current.fetchGetData();
        setVisible(false);
      },
    });
  };

  const modalProps = {
    title: '详情',
    visible: show,
    onClose,
    footer: type === 'check' && (
      <Button onClick={fetchAuditAllow} type="primary" loading={loading}>
        审核通过
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition
        title="基础信息"
        formItems={formItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="加急审核资料详情"
        formItems={otherData}
        initialValues={detail}
      ></DescriptionsCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.withdrawAudit,
}))(CommunityDetail);
