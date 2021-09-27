import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { checkCityName } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';

const UserFollowDetail = (props) => {
  const { visible, onClose } = props;
  const { show = false, detail = {} } = visible;
  
  const formItems = [
    {
      label: '用户昵称',
      name: 'pushStatus',
    },
    {
      label: '注册手机号',
      name: 'userType',
    },
    {
      label: 'ID',
      name: 'title',
    },
    {
      label: '身份',
      name: 'content',
    },
    {
      label: '性别',
      name: 'linkType',
    },
    {
      label: '地区',
      name: 'messageType',
    },
    {
      label: '注册时间',
      name: 'pushTime',
    },
    {
      label: '最后行为时间',
      name: 'pushObjectType',
    },
  ];
  const tagItems = [
    {
      label: '用户标签',
      name: 'tags',
    },
  ];

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
    {
      label: '跟进人',
      name: 'pushObjectType',
    },
    {
      label: '跟进时间',
      name: 'pushObjectType',
    },
  ];

  const modalProps = {
    title: '详情',
    visible: show,
    onClose,
  };
  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition
        title="用户信息"
        labelStyle={{ width: 120 }}
        formItems={formItems}
        column={2}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="用户标签"
        labelStyle={{ width: 120 }}
        formItems={tagItems}
      ></DescriptionsCondition>
      <div>
        <a style={{ float: 'right', marginTop: 5 }}>历史跟进情况</a>
        <DescriptionsCondition
          title="跟进详情"
          labelStyle={{ width: 120 }}
          formItems={followItem}
          column={2}
        ></DescriptionsCondition>
      </div>
    </DrawerCondition>
  );
};
export default UserFollowDetail;
