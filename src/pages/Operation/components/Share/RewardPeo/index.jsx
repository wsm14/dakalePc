import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Col, Row, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const RewardPeo = (props) => {
  const { onClose, visible = {}, childRef, loading, dispatch } = props;
  const { show = false, userMomentIdString } = visible;
  const [total, setTotal] = useState('');
  const [form] = Form.useForm();

  const modalProps = {
    visible: show,
    title: '新增打赏人数',
    onClose,
    footer: (
      <Button type="primary" onClick={() => handleSave()} loading={loading}>
        保存
      </Button>
    ),
  };
  useEffect(() => {
    if (show) {
      setTotal('');
    }
  }, [show]);
  const handleSave = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        userMomentIdString,
      };
      dispatch({
        type: 'shareManage/fetchShareRewardPeo',
        payload,
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '新增打赏人数',
      name: 'beanPersonAmount',
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6} style={{ textAlign: 'right', marginRight: 5 }}>
          打赏卡豆数:
        </Col>
        <Col>10卡豆/人</Col>
      </Row>
      <FormCondition
        form={form}
        formItems={formItems}
        onValuesChange={(val) => {
          const numTotal = 10 * Number(val.beanPersonAmount);
          setTotal(numTotal);
        }}
      ></FormCondition>
      <Row gutter={16}>
        <Col span={6} style={{ textAlign: 'right', marginRight: 5 }}>
          消耗卡豆数:
        </Col>
        <Col>{total ? total + '卡豆' : '自动计算'}</Col>
      </Row>
    </DrawerCondition>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['shareManage/fetchShareRewardPeo'],
}))(RewardPeo);
