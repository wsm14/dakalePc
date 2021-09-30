import React, { useState } from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { checkCityName } from '@/utils/utils';
import { FOLLOW_TYPE, FOLLOW_MANNER, SHARE_SEX_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import HistoryFollow from './HistoryFollow';
import { Tag } from 'antd';

const UserFollowDetail = (props) => {
  const { visible, onClose } = props;
  const { show = false, detail = {} } = visible;
  const [visibleHistory, setVisibleHistory] = useState(false);

  const formItems = [
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '注册手机号',
      name: 'mobile',
    },
    {
      label: 'ID',
      name: 'userId',
    },
    {
      label: '身份',
      name: 'levelName',
    },
    {
      label: '性别',
      name: 'gender',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      label: '地区',
      name: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      label: '注册时间',
      name: 'createTime',
    },
    {
      label: '最后行为时间',
      name: 'finalActTime',
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
      name: 'manner',
      render: (val) => FOLLOW_MANNER[val],
    },
    {
      label: '跟进类型',
      name: 'type',
      render: (val) => FOLLOW_TYPE[val],
    },
    {
      label: '跟进内容',
      name: 'content',
      span: 2,
    },
    {
      label: '跟进标签',
      name: 'tags',
      span: 2,
      render: (val) => {
        return val.split(',').map((tags) => {
          return (
            <Tag key={tags} color="blue">
              {tags}
            </Tag>
          );
        });
      },
    },
    {
      label: '跟进结果',
      name: 'result',
      span: 2,
    },
    {
      label: '跟进人',
      name: 'follower',
    },
    {
      label: '跟进时间',
      name: 'followTime',
    },
  ];

  const modalProps = {
    title: '详情',
    visible: show,
    onClose,
  };
  const handleOpenRecord = () => {
    setVisibleHistory(true);
  };
  return (
    <>
      <DrawerCondition {...modalProps}>
        <DescriptionsCondition
          title="用户信息"
          labelStyle={{ width: 120 }}
          formItems={formItems}
          column={2}
          initialValues={detail}
        ></DescriptionsCondition>
        {/* <DescriptionsCondition
          title="用户标签"
          labelStyle={{ width: 120 }}
          formItems={tagItems}
          initialValues={detail}
        ></DescriptionsCondition> */}
        <div>
          <a style={{ float: 'right', marginTop: 5 }} onClick={handleOpenRecord}>
            历史跟进情况
          </a>
          <DescriptionsCondition
            title="跟进详情"
            labelStyle={{ width: 120 }}
            formItems={followItem}
            column={2}
            initialValues={detail}
          ></DescriptionsCondition>
        </div>
      </DrawerCondition>
      <HistoryFollow
        visible={visibleHistory}
        onClose={() => setVisibleHistory(false)}
        userId={detail.userId}
      ></HistoryFollow>
    </>
  );
};
export default UserFollowDetail;
