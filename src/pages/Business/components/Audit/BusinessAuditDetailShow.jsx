import React from 'react';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { BUSINESS_STATUS_AUDIT } from '@/common/constant';

const BusinessAuditDetailShow = (props) => {
  const { verifyStatus, onClose, visible } = props;
  const { show = false, initialValues = {} } = visible;

  const formItems = [
    {
      label: '店铺简称',
      name: 'merchantName',
    },
    {
      label: '所在城市',
      name: 'cityName',
    },
    {
      label: '详细地址',
      name: 'address',
    },
    {
      label: '所属商圈',
      name: 'businessHub',
    },
    {
      label: '经营类目',
      name: 'topCategoryName',
      render: (val, row) => `${val} - ${row.categoryName}`,
    },
    {
      label: '平台服务费',
      name: 'commissionRatio',
      render: (val, row) => `${val}%（赠送${row.bondBean}卡豆）`,
    },
    {
      label: '申请时间',
      name: 'applyTime',
    },
    {
      label: '审核时间',
      name: 'verifyTime',
    },
    {
      label: '审核状态',
      name: 'verifyStatus',
      render: (val) => BUSINESS_STATUS_AUDIT[val],
    },
    {
      label: '驳回原因',
      name: 'rejectReason',
      render: (val) => val || '--',
    },
  ];
  const modalProps = {
    title: verifyStatus !== '2' ? '店铺详情' : '店铺驳回详情',
    visible: show,
    onClose,
  };

  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition
        formItems={formItems}
        initialValues={initialValues}
      ></DescriptionsCondition>
    </DrawerCondition>
  );
};

export default BusinessAuditDetailShow;
