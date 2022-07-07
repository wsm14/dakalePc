import React from 'react';
import { Empty } from 'antd';
import { checkCityName } from '@/utils/utils';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const WarehouseInfo = (props) => {
  const { detail = {} } = props;
  const { supplierObject = {}, logisticList } = detail;
  const { logisticList: authList } = supplierObject;

  const arr = authList || logisticList || [];

  // 仓库信息
  const wareHouseFormItem = [
    {
      label: '收货人',
      name: 'addressName',
    },
    {
      label: '手机号码',
      name: 'mobile',
    },
    {
      label: '所在地区',
      name: 'districtCode',
      render: (val, row) => checkCityName(row.districtCode),
    },
    {
      label: '详细地址',
      name: 'address',
    },
  ];

  return arr.length ? (
    arr?.map((item, index) => (
      <DescriptionsCondition
        key={`地址 ${index + 1}`}
        title={`地址 ${index + 1}`}
        formItems={wareHouseFormItem}
        initialValues={item}
      ></DescriptionsCondition>
    ))
  ) : (
    <Empty></Empty>
  );
};

export default WarehouseInfo;
