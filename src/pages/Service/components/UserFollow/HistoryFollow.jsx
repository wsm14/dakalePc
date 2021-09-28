import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { checkCityName } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';

const HistoryFollow = (props) => {
  const { visible, onClose } = props;

  const followItem = [
    {
      label: '跟进方式',
      name: 'pushObjectType',
    },
    {
      label: '跟进类型',
      name: 'pushObjectType',
    },
    {
      label: '跟进内容',
      name: 'pushObjectType',
      span: 2,
    },
    {
      label: '跟进标签',
      name: 'pushObjectType',
      span: 2,
    },
    {
      label: '跟进结果',
      name: 'pushObjectType',
      span: 2,
    },
  ];

  const modalProps = {
    title: '历史跟进情况',
    visible,
    onClose,
  };
  return (
    <DrawerCondition {...modalProps}>
      <div style={{ color: '#999', marginBottom: 15 }}>
        炜烽 <span style={{ marginLeft: 10 }}>2021-08-18 17:02</span>
      </div>
      <DescriptionsCondition
        title="用户信息"
        labelStyle={{ width: 120 }}
        formItems={followItem}
        column={2}
      ></DescriptionsCondition>
    </DrawerCondition>
  );
};
export default HistoryFollow;
