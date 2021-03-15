import React from 'react';
import { Button } from 'antd';
import {
  SHARE_SCOPE_TYPE,
  BUSINESS_TYPE,
  SHARE_TIME_TYPE,
  SHARE_STATUS,
  SHARE_SEX_TYPE,
} from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const ShareDetail = (props) => {
  const { visible, onClose, loading } = props;

  const { type = 'img', show = false, detail = {} } = visible;

  // 信息
  const formItems = [
    {
      title: '所属店铺',
      label: '店铺类型',
      name: 'userType',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      label: '店铺名称',
      name: 'merchantName',
    },
    {
      title: '分享内容',
      label: `视频`,
      name: 'videoContent',
    },
    {
      label: '标题',
      name: 'title',
    },
    {
      label: '内容详情',
      name: 'customCategoryName',
    },
    {
      label: '行业分类',
      name: 'topCategoryName',
      render: (val, row) => `${val}/${row.categoryName}`,
    },
    {
      title: '投放详情',
      label: '用户群',
      name: 'scope',
      render: (val) => SHARE_SCOPE_TYPE[val],
    },
    {
      label: '性别',
      name: 'gender',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      label: '年龄',
      name: 'age',
      render: (val) => (val === '1-100' ? '不限' : val),
    },
    {
      label: '地域',
      name: 'area',
    },
    {
      label: '兴趣',
      name: 'tags',
    },
    {
      title: '打赏详情',
      label: '发布状态',
      name: 'status',
      render: (val) => SHARE_STATUS[val],
    },
    {
      label: '卡豆打赏',
      name: 'aaa',
      children: (
        <div>
          <div>目标曝光量：{detail.personBeanAmount}</div>
          <div>单次曝光打赏：{detail.beanAmount}</div>
          <div>投放时长：{SHARE_TIME_TYPE[detail.rewardCycle]}</div>
          <div>
            投放时间：
            {detail.rewardCycle !== '0'
              ? `${detail.rewardStartTime} ~ ${detail.rewardEndTime}`
              : '--'}
          </div>
        </div>
      ),
    },
    {
      label: '平台补贴打赏奖励',
      name: 'bbb',
      children: (
        <div>
          <div>预计补贴人数：--</div>
          <div>单用户补贴卡豆数：--</div>
        </div>
      ),
    },
  ];

  const modalProps = {
    title: '分享详情',
    visible: show,
    onClose,
    footer: (
      <Button type="primary" loading={loading}>
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
    </DrawerCondition>
  );
};

export default ShareDetail;
