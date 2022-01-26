import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Input, Button, Checkbox, InputNumber } from 'antd';
import { SPECIAL_TIME_TYPE, OTHER_PRIZE_TYPE } from '@/common/constant';
import { MarkAwardSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

const PlatformSet = (props) => {
  const { form, initialValues } = props;

  const [specialTimes, setSpecialTime] = useState('all'); // 特殊时间段类型
  const [goodsType, setGoodsType] = useState([]); // 选择的其他奖品类型

  // 改变选择的其他奖品类型
  const handleChange = (val) => {
    setGoodsType(val);
  };

  // 信息
  const formItems = [
    {
      label: '每日打赏次数',
      name: 'dayCount',
      addonAfter: '次',
    },
    {
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
      },
    },
    {
      label: '固定时间',
      type: 'formItem',
      visible: specialTimes === 'fixedTime',
      required: true,
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
      type: 'noForm',
      visible: specialTimes === 'fixedTime',
      formItem: (
        <Form.Item
          required
          label={'选择卡豆奖池'}
          shouldUpdate={(prevValues, curValues) => {
            return (
              JSON.stringify(prevValues.beanPoolList) !== JSON.stringify(curValues.beanPoolList)
            );
          }}
        >
          {() => {
            return (
              <Form.Item name="beanPoolRange" rules={[{ required: true, message: '请选择奖池' }]}>
                <Checkbox.Group>
                  {form.getFieldValue('beanPoolList')?.map((item, index) => (
                    <div key={index}>
                      <Checkbox value={index}>
                        {`每次打卡领取卡豆数池${index + 1}  ${item?.minBean || 0}~${
                          item?.maxBean || 0
                        } 卡豆`}
                      </Checkbox>
                    </div>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            );
          }}
        </Form.Item>
      ),
    },
    {
      label: '其他奖品',
      name: 'goodsObject',
      type: 'formItem',
      formItem: (
        <Checkbox.Group onChange={handleChange}>
          {Object.keys(OTHER_PRIZE_TYPE).map((item) => (
            <div key={item}>
              <Checkbox value={item}>
                <span>{OTHER_PRIZE_TYPE[item]}</span>
                {goodsType.includes(item) && (
                  <Button type="link">
                    {item === 'hittingRewardRightGoodsObject' ? '+选择' : '+新增'}
                  </Button>
                )}
              </Checkbox>
            </div>
          ))}
        </Checkbox.Group>
      ),
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
