import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Form, Button } from 'antd';
import { VIRTUAL_ORDER_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const VirtualConfigDefaultSet = (props) => {
  const { visible, onClose, childRef, dispatch, loading } = props;
  const { show, type, initialValues = {} } = visible;

  const [form] = Form.useForm();

  console.log(initialValues);

  const formItems = [
    {
      label: '下单方式名称',
      name: 'activityName',
      disabled: true,
    },
    {
      label: '最高抵扣比例',
      name: 'maxBeanAndCoupon',
      type: 'number',
      addonAfter: '%',
      precision: 0,
      min: 0,
      max: 99,
      disabled: type === 'info',
      render: (val) => `${val}%`,
    },
  ];

  //   提交
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { buyLimit = 0, maxBeanAndCoupon, activityDate, ruleType, ...other } = values;
      dispatch({
        type: {
          add: 'globalConfig/fetchSavePreferentialActivity',
          edit: 'globalConfig/fetchUpdatePreferentialActivity',
        }[type],
        payload: {
          preferentialActivityId: initialValues?.preferentialActivityId,
          ...other,
          preferentialActivityRuleObject: {
            buyLimit,
            maxBeanAndCoupon: Number((maxBeanAndCoupon / 100).toFixed(2)),
          },
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    title: { edit: '编辑', info: '详情' }[type],
    visible: show,
    width: 700,
    onClose,
    footer: type !== 'info' && (
      <Button type="primary" onClick={handleSave} loading={loading}>
        保存
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      {type !== 'info' ? (
        <FormCondition
          formItems={formItems}
          initialValues={initialValues}
          form={form}
        ></FormCondition>
      ) : (
        <DescriptionsCondition
          formItems={formItems}
          initialValues={initialValues}
        ></DescriptionsCondition>
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.globalConfig,
}))(VirtualConfigDefaultSet);
