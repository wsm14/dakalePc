import React, { useState } from 'react';
import { HITTING_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const PointDetail = (props) => {
  const { initialValues = {} } = props;
  const { submitterList = [] } = initialValues;

  const formItems = [
    {
      label: '点位ID',
      name: 'hittingId',
    },
    {
      label: '点位名称',
      name: 'name',
    },
    {
      label: '点位地址',
      name: 'address',
    },
    {
      label: '关联主体',
      name: 'mainName',
    },
  ];
  const userItems = [
    {
      label: '归属人姓名',
      name: 'submitterName',
    },
    {
      label: '归属人手机号',
      name: 'submitterMobile',
    },

    {
      label: '归属类型',
      name: 'hittingType',
      render: (val) => HITTING_TYPE[val],
    },

    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '注册手机号',
      name: 'userMobile',
    },
  ];

  return (
    <>
      <DescriptionsCondition
        title="点位信息"
        formItems={formItems}
        initialValues={initialValues}
      ></DescriptionsCondition>

      {submitterList?.map((item, index) => (
        <DescriptionsCondition
          key={index}
          title={`归属人${index + 1}信息`}
          formItems={userItems}
          initialValues={item}
        ></DescriptionsCondition>
      ))}
    </>
  );
};
export default PointDetail;
