import React from 'react';
import { Form, InputNumber } from 'antd';
import { MARKETACTIVITY_BUY_RULE } from '@/common/constant';
import { Radio } from '@/components/FormCondition/formModule';
import FormCondition from '@/components/FormCondition';
import SeckillTimeSelect from './SeckillTimeSelect';

const SeckillTimeActivityBaseForm = (props) => {
  const { initialValues = {}, form } = props;

  // 限购规则
  const limitRule = Form.useWatch(['useRuleObject', 'limit', 'type'], form) || '';

  const formItems = [
    {
      label: '秒杀时间',
      type: 'noForm',
      required: true,
      formItem: <SeckillTimeSelect keys="seckillTimeObjectList"></SeckillTimeSelect>,
    },
    {
      label: '限购规则',
      type: 'formItem',
      required: true,
      formItem: (
        <>
          <div style={{ marginTop: limitRule === 'personLimit' && 5 }}>
            <Form.Item
              noStyle
              name={['useRuleObject', 'limit', 'type']}
              rules={[{ required: true, message: '请选择限购规则' }]}
            >
              <Radio select={MARKETACTIVITY_BUY_RULE} />
            </Form.Item>
          </div>
          {limitRule === 'personLimit' && (
            <div style={{ lineHeight: '31px', marginTop: 24 }}>
              每人限购
              <Form.Item
                noStyle
                name={['useRuleObject', 'limit', 'limitNum']}
                rules={[{ required: true, message: '请输入限购数量' }]}
              >
                <InputNumber
                  min={0}
                  max={99999999}
                  precision={0}
                  addonAfter={'份'}
                  placeholder="请输入"
                  style={{ width: 120, marginLeft: 5 }}
                />
              </Form.Item>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <FormCondition form={form} formItems={formItems} initialValues={initialValues}></FormCondition>
  );
};

export default SeckillTimeActivityBaseForm;
