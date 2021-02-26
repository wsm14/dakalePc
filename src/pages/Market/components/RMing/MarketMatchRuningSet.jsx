import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const MarketMatchRuningSet = (props) => {
  const { dispatch, childRef, visible = false, onClose, loading } = props;

  const [form] = Form.useForm();

  const fetchRuningSet = (values) => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'marketCardRMing/fetchMarketMatchRuningSet',
        payload: values,
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      type: 'number',
      label: '报名卡豆数',
      name: 'walkSignBeanAmount',
    },
    {
      type: 'number',
      label: '目标步数',
      name: 'walkStepCount',
      extra: '设置成功之后，对下一期生效',
    },
  ];

  const modalProps = {
    title: '步数挑战赛设置',
    visible,
    onClose,
    footer: (
      <Button type="primary" onClick={() => fetchRuningSet()} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketCardRMing/fetchMarketMatchRuningSet'],
}))(MarketMatchRuningSet);
