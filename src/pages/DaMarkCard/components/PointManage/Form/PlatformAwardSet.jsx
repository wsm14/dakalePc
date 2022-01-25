import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Input, Button, Row, Col, InputNumber } from 'antd';
import { SPECIAL_TIME_TYPE } from '@/common/constant';
import { MarkAwardSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

const PlatformSet = (props) => {
  const { form, initialValues } = props;

  const [specialTimes, setSpecialTime] = useState('all');

  // 信息
  const formItems = [
    {
      label: '每日打赏次数',
      name: 'dayCount',
      addonAfter: '次',
    },
    {
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
      label: '特殊时间段剩余打卡次数',
      name: 'remain',
      addonAfter: '次',
    },
    {
      label: '特殊时间段',
      name: 'specialTime',
      type: 'radio',
      select: SPECIAL_TIME_TYPE,
      onChange: (e) => {
        setSpecialTime(e.target.value);
        console.log(e.target.value);
      },
    },
    {
      label: '固定时间',
      type: 'formItem',
      visible: specialTimes === 'fixedTime',
      formItem: (
        <Input.Group size="small" compact>
          <Form.Item
            noStyle
            name="timeRangeStart"
            rules={[{ required: true, message: '请输入时间' }]}
          >
            <InputNumber max={24} min={0} precision={0} />
          </Form.Item>
          <div style={{ lineHeight: '32px', margin: '0 10px' }}>至</div>
          <Form.Item
            noStyle
            name="timeRangeEnd"
            rules={[{ required: true, message: '请输入时间' }]}
          >
            <InputNumber max={24} min={0} precision={0} />
          </Form.Item>
        </Input.Group>
      ),
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
