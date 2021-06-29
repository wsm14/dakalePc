import React, { useState } from 'react';
import { Form, Button, InputNumber } from 'antd';
import { PAGE_STATUS, BANNER_AREA_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import { CitySet, JumpFormSet } from '@/components/FormListCondition';
const GatherSet = (props) => {
  const [form] = Form.useForm();
  const [showArea, setShowArea] = useState(false); // 区域

  const modalProps = {
    visible: false,
    title: '配置',
    footer: <Button type="primary">确定</Button>,
  };

  const formItems = [
    {
      label: '应用范围',
      type: 'radio',
      name: 'areaType',
      select: BANNER_AREA_TYPE,
      onChange: (e) => setShowArea(e.target.value === 'detail'),
    },
    {
      label: '选择区县',
      type: 'formItem',
      visible: showArea,
      formItem: (
        <CitySet
          name="provinceCityDistrictObjects"
          form={form}
          maxLength={10}
          changeOnSelect={true}
        ></CitySet>
      ),
    },
    {
      label: '唤醒配置',
      type: 'formItem',
      formItem: <>222</>,
    },
    {
      label: '推荐配置',
      type: 'formItem',
      formItem: (
        <div>
          <div style={{ height: 30, width: '100%' }}></div>
          <div style={{ display: 'flex', alignItem: 'center' }}>
            <Form.Item label="价格" name="singleMinMoney" rules={[{ required: true }]}>
              <InputNumber style={{ width: 150 }} min={0} />
            </Form.Item>
            <span style={{ margin: '5px 10px' }}>至</span>
            <Form.Item name="singleMinMoney" rules={[{ required: true }]}>
              <InputNumber style={{ width: 150 }} min={0} />
            </Form.Item>
            <span style={{ margin: '5px 10px' }}>元</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form}></FormCondition>
    </DrawerCondition>
  );
};
export default GatherSet;
