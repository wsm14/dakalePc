import React from 'react';
import { connect } from 'umi';
import { MarkAwardSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

const PlatformSet = (props) => {
  const { form, initialValues } = props;

  // 信息
  const formItems = [
    {
      label: '每日打赏次数',
      name: 'dayCount',
      addonAfter: '次',
    },
    {
      label: '添加卡豆奖池',
      name: 'beanPoolList',
      type: 'noForm',
      formItem: <MarkAwardSet name={'beanPoolList'} form={form}></MarkAwardSet>,
    },
    {
      label: '特殊时间段打卡次数',
      name: 'total',
      addonAfter: '次',
    },
    {
      label: '特殊时间段',
      name: 'videoId',
    },
    {
      label: '特殊时间段剩余打卡次数',
      name: 'remain',
      addonAfter: '次',
    },
    {
      label: '选择卡豆奖池',
      name: 'beanPoolRange',
    },
    {
      label: '其他奖品',
      name: 'hittingRewardRightGoodsObject',
      rules: [{ required: false }],
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </>
  );
};

export default connect(({ baseData, loading }) => ({
  groupMreList: baseData.groupMreList,
  loading,
}))(PlatformSet);
