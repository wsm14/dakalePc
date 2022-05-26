import React from 'react';
import { checkCityName } from '@/utils/utils';
import { SUPPLIER_AUTH_TYPE } from '@/common/constant';
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
          name: ['supplierObject', 'type'],
          render: (val) => SUPPLIER_AUTH_TYPE[val],
        },
        {
          label: '供应商名称',
          name: 'supplierName',
        },
        {
          label: '供应商ID',
          name: 'identifyId',
        },
        {
          label: '主营类目',
          name: ['supplierObject', 'classifyNames'],
        },
        {
          label: '所属地区',
          name: ['supplierObject', 'districtCode'],
          render: (val) => checkCityName(val),
        },
        {
          label: '详细地址',
          name: 'createTime',
        },
        {
          label: '入驻时间',
          name: 'createTime',
        },
        {
          label: '激活时间',
          name: 'createTime',
        },
        {
          label: '供应商状态',
          name: 'createTime',
        },
        {
          label: '禁用原因',
          name: 'createTime',
        },
      ],
    },
    {
      title: '联系人信息',
      formItems: [
        {
          label: '联系人姓名',
          name: ['supplierObject', 'contactName'],
        },
        {
          label: '联系人手机号',
          name: ['supplierObject', 'contactPhone'],
        },
      ],
    },
    {
      title: '介绍人信息',
      formItems: [
        {
          label: '有无介绍人',
          name: ['supplierObject', 'anyInducer'],
          render: (val) => ['无', '有'][val],
        },
        {
          label: '介绍人账号',
          name: ['supplierObject', 'inducer'],
          show: detail?.supplierObject?.anyInducer == 1,
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
