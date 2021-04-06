import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { NUM_INT } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const PeasShareSet = (props) => {
  const { cRef, dispatch, visible = {}, onClose, loading } = props;

  const { type, show = false, initialValues = {} } = visible;

  const [form] = Form.useForm();

  const fetchPeasShareAdd = () => {
    form.validateFields().then((values) => {
      const { configMomentIdString: configMomentId } = initialValues;
      const payload = {
        add: { type: 'sysPeasShare/fetchPeasShareAdd' },
        edit: { type: 'sysPeasShare/fetchPeasShareEdit' },
      }[type];
      dispatch({
        type: payload.type,
        payload: {
          configMomentId,
          ...initialValues,
          ...values,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '观看时长',
      name: 'watchTime',
      addonAfter: '秒',
      addRules: [{ pattern: NUM_INT, message: '观看时长应为整数' }],
    },
    {
      label: '最低卡豆数',
      name: 'limitBean',
      addonAfter: '个',
      addRules: [{ pattern: NUM_INT, message: '最低卡豆数应为整数' }],
    },
  ];

  const modalProps = {
    title: `${{ add: '新增卡豆分享', edit: '卡豆分享设置' }[type]}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchPeasShareAdd} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.sysPeasShare,
}))(PeasShareSet);
