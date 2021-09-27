import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { NEW_SHAREPUBLISHTIME_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

/**
 * 发布设置
 */
const SharePushSet = (props) => {
  const { form, detail } = props;

  const [timeSelect, setTimeSelect] = useState(false); // 投放时长

  useEffect(() => {
    setTimeSelect(detail.rewardCycle);
  }, []);

  // 定时投放不超过当前时间31天
  const disabledDate = (current) =>
    (current && current < moment().endOf('day').subtract(1, 'day')) ||
    current > moment().add(31, 'days');

  const formItems = [
    {
      label: '视频时长',
      name: 'length',
      suffix: 's',
      disabled: true,
    },
    {
      title: '发布时间',
      label: '发布时间',
      name: 'publishType',
      type: 'radio',
      select: NEW_SHAREPUBLISHTIME_TYPE,
      onChange: (e) => setTimeSelect(e.target.value),
    },
    {
      label: '预发布时间',
      name: 'publishTime',
      type: 'dataPicker',
      visible: timeSelect === 'fixed',
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
      disabledDate,
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default SharePushSet;
