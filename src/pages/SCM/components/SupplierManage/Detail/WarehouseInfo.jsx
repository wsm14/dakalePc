import React from 'react';
import { checkCityName } from '@/utils/utils';
import { SUPPLIER_AUTH_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const WarehouseInfo = (props) => {
  const { detail } = props;

  const itemArr = [
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
  ];

  return <DescriptionsCondition formItems={itemArr} initialValues={detail}></DescriptionsCondition>;
};

export default WarehouseInfo;
