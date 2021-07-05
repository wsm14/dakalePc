import React from 'react';
import { connect } from 'umi';
import { Form, Button, InputNumber } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import { NUM_PATTERN } from '@/common/regExp';
const GoodResourceSet = (props) => {
  const { visible, onClose, cRef, dispatch, loading } = props;
  const { show = false, tabKey } = visible;
  console.log(tabKey, 'tabKey');

  const [form] = Form.useForm();
  const handleSave = () => {
    form.validateFields().then((values) => {
      const { minPrice, maxPrice } = values;
      const value = {
        highCommission: '特惠商品高佣联盟条件配置',
        todayNew: '特惠商品今日上新条件配置',
      }[tabKey];
      const payload = {
        root: 'system',
        parent: 'specialGoods',
        child: tabKey,
        value,
        extraParam: {
          ...values,
          minPrice: maxPrice ? minPrice || 0 : '',
          maxPrice,
        },
      };
      dispatch({
        type: 'specialGoods/fetchSpecialConditConfig',
        payload,
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    title: '条件配置',
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave} loading={loading}>
        保存
      </Button>
    ),
  };

  const formItems = [
    {
      label: `商品上架时间小于`,
      name: 'onShelfDays',
      suffix: '天',
      addRules: [{ pattern: NUM_PATTERN, message: '输入为纯数字' }],
      visible: tabKey === 'todayNew',
    },
    {
      label: `商品佣金大于等于`,
      name: 'commission',
      addRules: [{ pattern: NUM_PATTERN, message: '输入为纯数字' }],
      suffix: '元',
      rules: [{ required: tabKey !== 'todayNew' }],
    },
    {
      label: `商品价格区间`,
      type: 'formItem',
      formItem: (
        <div style={{ display: 'flex' }}>
          <Form.Item name="minPrice">
            <InputNumber min="0" precision={0} style={{ width: 200 }} />
          </Form.Item>
          <span style={{ margin: '5px 8px' }}>~</span>
          <Form.Item name="maxPrice">
            <InputNumber min="0" precision={0} style={{ width: 200 }} />
          </Form.Item>
          <span style={{ margin: '5px 8px' }}>元</span>
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

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialConditConfig'],
}))(GoodResourceSet);
