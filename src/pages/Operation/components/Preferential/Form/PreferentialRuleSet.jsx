import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const PreferentialRuleSet = ({ visible, loading, onClose, dispatch }) => {
  const { show = false, preData } = visible;

  const [form] = Form.useForm();
  // 商品类型 goodsType 店铺范围 shopType
  const [radioData, setRadioData] = useState({ goodsType: 'single', shopType: '0' });

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 信息
  const formItems = [
    {
      label: '店铺范围',
      type: 'radio',
      name: 'shopType',
      select: ['全部', '部分'],
      onChange: (e) => saveSelectData({ shopType: e.target.value }),
    },
  ];

  // 弹窗属性
  const modalProps = {
    title: '规则设置',
    visible: show,
    onClose,
    footer: (
      <Button type="primary" loading={loading}>
        发布申请
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={{ ownerType: 'merchant', goodsType: 'single', groupGoods: [{}] }}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ businessList, loading }) => ({
  selectList: businessList.selectList,
  loading: loading.models.businessList,
}))(PreferentialRuleSet);
