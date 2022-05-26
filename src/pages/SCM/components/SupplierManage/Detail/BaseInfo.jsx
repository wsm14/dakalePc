import React from 'react';
import { checkCityName } from '@/utils/utils';
import { SUPPLIER_AUTH_TYPE, SUPPLIER_STATUS } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const BaseInfo = (props) => {
  const { detail } = props;

  // 基础信息
  const baseItemArr = [
    {
      title: '基础信息',
      formItems: [
        {
          label: '供应商类型',
          name: 'type',
          render: (val) => SUPPLIER_AUTH_TYPE[val],
        },
        {
          label: '供应商名称',
          name: 'name',
        },
        {
          label: '供应商ID',
          name: 'id',
        },
        {
          label: '主营类目',
          name: 'classifyNames',
        },
        {
          label: '所属地区',
          name: 'districtCode',
          render: (val) => checkCityName(val),
        },
        {
          label: '详细地址',
          name: 'address',
        },
        {
          label: '入驻时间',
          name: 'settleTime',
        },
        {
          label: '激活时间',
          name: 'activationTime',
          show: detail.bankStatus === '3',
        },
        {
          label: '供应商状态',
          name: 'status',
          render: (val) => SUPPLIER_STATUS[val],
        },
        {
          label: '禁用原因',
          name: 'reason',
          show: detail.status === '0',
        },
      ],
    },
    {
      title: '联系人信息',
      formItems: [
        {
          label: '联系人姓名',
          name: 'contactName',
        },
        {
          label: '联系人手机号',
          name: 'contactPhone',
        },
      ],
    },
    {
      title: '介绍人信息',
      formItems: [
        {
          label: '有无介绍人',
          name: 'anyInducer',
          render: (val) => ['无', '有'][val],
        },
        {
          label: '介绍人账号',
          name: ['inducer'],
          show: detail?.anyInducer == 1,
          render: (val) => `${val.inducerName} ${val.inducerMobile} ${val.inducerBeanCode}`,
        },
      ],
    },
  ];

  return baseItemArr.map((item) => (
    <DescriptionsCondition
      key={item.title}
      title={item.title}
      formItems={item.formItems}
      initialValues={detail}
    ></DescriptionsCondition>
  ));
};

export default BaseInfo;
