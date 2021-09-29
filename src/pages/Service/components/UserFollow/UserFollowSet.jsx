import React, { useState } from 'react';
import { checkCityName } from '@/utils/utils';
import { connect } from 'umi';
import { Button, Form, Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import HistoryFollow from './HistoryFollow';
import TagModal from './TagModal';

const UserFollowSet = (props) => {
  const { visible, onClose, childRef } = props;
  const { show = false, type } = visible;
  const tagList = ['Unremovable', 'Tag 2', 'Tag 3'];
  const [visibleTag, setVisibleTag] = useState(false);
  const modalProps = {
    title: { add: '新增', edit: '编辑' }[type],
    visible: show,
    onClose,
    footer: <Button type="primary">确定</Button>,
  };
  const handleClose = (removedTag) => {
    const tags = tagList.filter((tag) => tag !== removedTag);
  };

  const useItem = [
    {
      label: '用户',
      name: 'pushStatus',
    },
  ];

  const followwItem = [
    {
      title: '用户标签',
      label: '用户标签',
      name: 'pushStatus',
    },
    {
      title: '跟进详情',
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
      type: 'formItem',
      formItem: (
        <>
          {tagList.map((tag, index) => (
            <Tag className="edit-tag" key={tag} closable onClose={() => handleClose(tag)}>
              {tag}
            </Tag>
          ))}
          <Tag style={{ padding: '0 20px' }} onClick={() => setVisibleTag(true)}>
            <PlusOutlined />
          </Tag>
        </>
      ),
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

  return (
    <>
      <DrawerCondition {...modalProps}>
        <FormCondition formItems={useItem}></FormCondition>
        <DescriptionsCondition
          labelStyle={{ width: 120 }}
          formItems={formItems}
          column={2}
        ></DescriptionsCondition>
        <FormCondition formItems={followwItem}></FormCondition>
      </DrawerCondition>
      <TagModal visible={visibleTag} onClose={() => setVisibleTag(false)}></TagModal>
    </>
  );
};

export default connect()(UserFollowSet);
