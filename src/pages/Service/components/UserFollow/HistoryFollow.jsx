import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { checkCityName } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';

const HistoryFollow = (props) => {
  const { visible, onClose } = props;
  const { show = false, detail = {} } = visible;

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
    title: '详情',
    visible: show,
    onClose,
  };
  return (
    <DrawerCondition {...modalProps}>
      <div style={{ color: '#999', margin: 5 }}>炜烽 2021-08-18 17:02</div>
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
