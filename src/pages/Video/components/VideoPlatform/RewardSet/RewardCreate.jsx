import React, { useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { NUM_INT } from '@/common/regExp';
import { Button, Form } from 'antd';
import { NEW_SHARETIME_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

/**
 * 打赏创建
 * type videoAdvert 视频广告 新增时没有画像设置
 */
const RewardCreate = (props) => {
  const { dispatch, visible, params, childRef, onClose, loading } = props;

  // 默认选择项
  const inputData = {
    momentDTO: { gender: 'ALL' },
    tippingTimeType: 'permanent',
    areaType: 'all',
    taste: 'all',
    age: '0-100',
  };

  const [form] = Form.useForm();

  const [timeSelect, setTimeSelect] = useState(false); // 投放时长
  const [totalBean, setTotalBean] = useState({ pnum: 0, bnum: 0 }); // 计算总卡豆

  // 确认新增
  const handleRewardCreate = () => {
    form.validateFields().then((values) => {
      const { rewardStartTime: time, ...other } = values;
      dispatch({
        type: 'videoPlatform/fetchNewShareRewardSave',
        payload: {
          ...params,
          ...other,
          beginDate: time && time[0].format('YYYY-MM-DD'),
          endDate: time && time[1].format('YYYY-MM-DD'),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '投放时长',
      name: 'tippingTimeType',
      type: 'radio',
      select: NEW_SHARETIME_TYPE,
      onChange: (e) => setTimeSelect(e.target.value),
    },
    {
      label: '时间选择',
      name: 'rewardStartTime',
      type: 'rangePicker',
      visible: timeSelect === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '单次曝光打赏',
      name: 'tippingBean',
      suffix: '卡豆/人',
      addRules: [{ pattern: NUM_INT, message: '应为大于0的整数数字' }],
      onChange: (e) => setTotalBean((old) => ({ ...old, bnum: Number(e.target.value) })),
    },
    {
      label: '目标曝光量',
      name: 'tippingCount',
      suffix: '人',
      addRules: [{ pattern: NUM_INT, message: '应为大于0的整数数字' }],
      onChange: (e) => setTotalBean((old) => ({ ...old, pnum: Number(e.target.value) })),
    },
  ];

  /**
   * 统计卡豆
   */
  const totalDom = () => {
    return (
      <div style={{ width: '100%', backgroundColor: '#f6fbff', padding: 20, borderRadius: 5 }}>
        <div>平台补贴总需：{totalBean.pnum * totalBean.bnum}卡豆</div>
      </div>
    );
  };

  const modalProps = {
    title: '新增打赏',
    visible,
    onClose,
    closeCallBack: () => {
      setTimeSelect(false);
    },
    footer: (
      <Button type="primary" onClick={handleRewardCreate} loading={loading}>
        确认新增
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={inputData}>
        {totalDom()}
      </FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['videoPlatform/fetchNewShareRewardSave'],
}))(RewardCreate);
