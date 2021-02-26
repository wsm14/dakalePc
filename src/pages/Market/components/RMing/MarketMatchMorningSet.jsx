import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const MarketMatchMorningSet = (props) => {
  const { dispatch, childRef, visible = false, onClose } = props;

  const [form] = Form.useForm();

  const fetchMorningSet = (values) => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'marketCardRMing/fetchMarketMatchMorningSet',
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
      name: 'wakeUpSignBeanAmount',
      extra: '设置成功之后，对下一期生效',
    },
  ];

  const modalProps = {
    title: '早起挑战赛设置',
    visible,
    onClose,
    footer: (
      <Button type="primary" onClick={() => fetchMorningSet()}>
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

export default connect(({ marketCardRMing, loading }) => ({
  marketCardRMing,
  loading,
}))(MarketMatchMorningSet);
