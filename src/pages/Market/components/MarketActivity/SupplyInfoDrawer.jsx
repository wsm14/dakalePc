import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SupplyInfoFormItem from './SupplyInfoFormItem';

// 补充信息
const SupplyInfoDrawer = (props) => {
  const {
    loading,
    visible,
    dispatch,
    childRef,
    goodsType,
    activeDetail,
    marketingActivityId,
    onClose,
  } = props;

  const { show = false, detail = {} } = visible;
  const { activityName, activityRuleObject = {} } = activeDetail;
  const { activityRuleType = '', discount = '' } = activityRuleObject;

  // 获取活动折扣 表单折扣上限为活动折扣
  const typeArr = activityRuleType.split(',');
  let discountMax = '';
  if (typeArr.includes('discount')) {
    discountMax = discount;
  } else discountMax = 10;

  const [form] = Form.useForm();

  const handleUpData = () => {
    form.validateFields().then((value) => {
      console.log(value);
      return;
      dispatch({
        type: 'marketActivity/fetchMarketActivitySet',
        payload: {},
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 弹出窗属性
  const modalProps = {
    title: `补充信息 - ${activityName}`,
    visible: show,
    width: 550,
    onClose,
    zIndex: 1010,
    afterCallBack: () => {
      console.log(detail);
      form.setFieldsValue(detail);
    },
    footer: (
      <Button onClick={handleUpData} type="primary" loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <Form form={form}>
        <Form.List name={goodsType}>
          {(fields, { add, remove, move }, { errors }) =>
            fields.map((field, index) => (
              <SupplyInfoFormItem
                form={form}
                index={index}
                key={field.key}
                ruleTypeArr={typeArr}
                goodsType={goodsType}
                discountMax={discountMax}
              />
            ))
          }
        </Form.List>
      </Form>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketActivity/fetchMarketActivitySet'],
}))(SupplyInfoDrawer);
