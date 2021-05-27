import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { NUM_PATTERN } from '@/common/regExp';
import { VIDEO_AREA_TYPE, VIDEO_TIME_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

/**
 * 发布设置
 */
const VideoPushSet = (props) => {
  const { form, detail } = props;

  const [totalBean, setTotalBean] = useState({ pnum: 0, bnum: 0 }); // 计算总卡豆
  const [areaItem, setAreaItem] = useState(false); // 区域表单显示隐藏
  const [timeSelect, setTimeSelect] = useState(false); // 投放时长

  useEffect(() => {
    setTotalBean({ pnum: detail.beanPersonAmount || 0, bnum: detail.beanAmount || 0 });
    setAreaItem(detail.areaType);
    setTimeSelect(detail.rewardCycle);
  }, []);

  const formItems = [
    {
      title: '投放区域',
      label: '区域类型',
      name: 'areaType',
      type: 'radio',
      select: VIDEO_AREA_TYPE,
      onChange: (e) => setAreaItem(e.target.value),
    },
    {
      label: '区域',
      name: 'area',
      type: 'cascader',
      visible: areaItem === 'district',
    },
    {
      title: '卡豆打赏',
      label: '目标曝光量',
      name: 'beanPersonAmount',
      suffix: '人',
      onChange: (e) => setTotalBean({ ...totalBean, pnum: Number(e.target.value) }),
      addRules: [{ pattern: NUM_PATTERN, message: '应为整数数字' }],
    },
    {
      label: '单次曝光打赏',
      name: 'beanAmount',
      suffix: '卡豆',
      onChange: (e) => setTotalBean({ ...totalBean, bnum: Number(e.target.value) }),
      addRules: [{ pattern: NUM_PATTERN, message: '应为整数数字' }],
    },
    {
      title: '时间设置',
      label: '投放时长',
      name: 'rewardCycle',
      type: 'radio',
      select: VIDEO_TIME_TYPE,
      onChange: (e) => setTimeSelect(e.target.value),
    },
    {
      label: '时间选择',
      name: 'rewardStartTime',
      type: 'rangePicker',
      visible: timeSelect === '1',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
  ];

  /**
   * 统计卡豆
   */
  const totalDom = () => {
    return (
      <div style={{ width: '100%', backgroundColor: '#f6fbff', padding: 20, borderRadius: 5 }}>
        <div>卡豆总数：{totalBean.pnum * totalBean.bnum}卡豆</div>
      </div>
    );
  };

  return (
    <FormCondition form={form} formItems={formItems} initialValues={detail}>
      {totalDom()}
    </FormCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['shareManage/fetchShareGetPlatformBean'],
}))(VideoPushSet);
