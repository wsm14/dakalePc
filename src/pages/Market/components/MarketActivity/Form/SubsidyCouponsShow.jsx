import React, { useState } from 'react';
import { Form, Button, Space } from 'antd';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import SubsidyCouponsTable from './SubsidyCouponsTable';

// 赠送平台券 表格
const SubsidyCouponsShow = (props) => {
  const { form, data } = props;

  // 补贴规则
  const subsidyList = data || Form.useWatch(['useRuleObject', 'subsidy', 'coupons'], form) || [];
  const [visible, setVisible] = useState(false); // 弹窗

  // 选择券
  const handleSelectCoupon = (list) => {
    const oldData = form.getFieldValue(['useRuleObject', 'subsidy', 'coupons']) || [];
    form.setFieldsValue({
      useRuleObject: {
        subsidy: {
          coupons: [...oldData, ...list.map((i) => ({ ...i, couponId: i.goodsId }))],
        },
      },
    });
  };

  return (
    <>
      <Form.List
        name={['useRuleObject', 'subsidy', 'coupons']}
        rules={[
          {
            validator: async (_, datas) => {
              if (!datas || !datas.length) return Promise.reject(new Error('请添加券'));
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <Space direction={'vertical'}>
            <Button type="dashed" onClick={() => setVisible(true)} style={{ width: 250 }}>
              添加
            </Button>
            <div style={{ color: '#00000073', whiteSpace: 'pre-line', lineHeight: 1.5715 }}>
              1. 不支持选择券规则中带有城市规则的券{`\n`}2. 仅支持选择手动领取的券
            </div>
            <Form.ErrorList errors={errors} />
            <div style={{ width: 460 }}>
              <SubsidyCouponsTable form={form} remove={remove}></SubsidyCouponsTable>
            </div>
          </Space>
        )}
      </Form.List>
      <GoodsSelectModal
        visible={visible}
        showTag={['platformCoupon']}
        disabled={(row) => subsidyList.some((i) => i.couponId === row.goodsId)}
        onClose={() => setVisible(false)}
        onSumbit={({ list }) => handleSelectCoupon(list)}
      ></GoodsSelectModal>
    </>
  );
};

export default SubsidyCouponsShow;
