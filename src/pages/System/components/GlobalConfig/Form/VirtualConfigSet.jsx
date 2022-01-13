import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Form, Button } from 'antd';
import { VIRTUAL_CONFIG_TYPE, VIR_OPEN_STATE, VIR_OPEN_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const VirtualConfigSet = (props) => {
  const { visible, onClose, childRef, dispatch, loading } = props;
  const { show, type, initialValues = {} } = visible;

  const [ruleTypes, setRuleTypes] = useState('0'); // 优惠次数类型

  const [form] = Form.useForm();

  useEffect(() => {
    if (type === 'edit' || type === 'info') {
      setRuleTypes(initialValues?.ruleType);
    }
  }, [type]);

  const formItems = [
    {
      label: '优惠类型',
      name: 'type',
      type: 'select',
      select: VIRTUAL_CONFIG_TYPE,
      disabled: type === 'info' || type === 'edit',
      render: (val) => VIRTUAL_CONFIG_TYPE[val],
    },
    {
      label: '优惠活动名称',
      name: 'activityName',
      disabled: type === 'info',
    },
    {
      label: '最高优惠比例',
      name: 'maxBeanAndCoupon',
      type: 'number',
      addonAfter: '%',
      min: 0,
      max: 99,
      disabled: type === 'info' || type === 'edit',
      render: (val) => `${val}%`,
    },
    {
      label: '限优惠次数',
      name: 'ruleType',
      type: 'radio',
      select: VIR_OPEN_TYPE,
      onChange: (e) => {
        setRuleTypes(e.target.value);
      },
      disabled: type === 'info' || type === 'edit',
      render: (val) => VIR_OPEN_TYPE[val],
    },
    {
      label: '每人限优惠次数',
      name: 'buyLimit',
      type: 'number',
      visible: ruleTypes !== '0',
      addonAfter: '次',
      min: 1,
      disabled: type === 'info' || type === 'edit',
      show: ruleTypes !== '0',
      render: (val) => `${val}次`,
    },
    {
      label: '活动时间',
      name: 'activityDate',
      type: 'rangePicker',
      disabledDate: (current) => {
        return current && current < moment().subtract(1, 'days');
      },
      disabled: [
        type === 'info' || (type === 'edit' && !moment().isBefore(initialValues?.startDate)),
        type === 'info',
      ],
      render: (val, row) => `${row.startDate}~${row.endDate}`,
    },
    {
      label: '启用状态',
      name: 'status',
      type: 'switch',
      rules: [{ required: true }],
      disabled: type === 'info',
      render: (val) => VIR_OPEN_STATE[val],
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
          startDate: activityDate[0].format('YYYY-MM-DD'),
          endDate: activityDate[1].format('YYYY-MM-DD'),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    title: { edit: '编辑', info: '详情', add: '新增' }[type],
    visible: show,
    width: 700,
    onClose,
    closeCallBack: () => {
      setRuleTypes('0');
    },
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
}))(VirtualConfigSet);
