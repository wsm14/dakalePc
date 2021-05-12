import React, { useState } from 'react';
import { Card, Row, Col, Form, InputNumber } from 'antd';
import FormCondition from '@/components/FormCondition';
import WithdrawTable from './components/WithdrawTable';

const WithdrawRegular = (props) => {
  

  const formItems = [
    {
      label: '每笔最低提现金额',
      type: 'formItem',
      required: true,
      formItem: (
        <Row>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item label="店铺" name="username" style={{ marginBottom: '0' }}>
              <InputNumber />
            </Form.Item>
            <div style={{ lineHeight: '30px', marginLeft: '10px' }}>笔</div>
          </Col>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item label="哒人" name="username" style={{ marginBottom: '0' }}>
              <InputNumber />
            </Form.Item>
            <div style={{ lineHeight: '30px', marginLeft: '10px' }}>笔</div>
          </Col>
        </Row>
      ),
    },
    {
      label: '每日提现上限笔数',
      type: 'formItem',
      required: true,
      formItem: (
        <Row>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item label="店铺" name="username" style={{ marginBottom: '0' }}>
              <InputNumber />
            </Form.Item>
            <div style={{ lineHeight: '30px', marginLeft: '10px' }}>笔</div>
          </Col>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item label="哒人" name="username" style={{ marginBottom: '0' }}>
              <InputNumber />
            </Form.Item>
            <div style={{ lineHeight: '30px', marginLeft: '10px' }}>笔</div>
          </Col>
        </Row>
      ),
    },
    {
      label: '每月提现上限笔数',
      type: 'formItem',
      required: true,
      formItem: (
        <Row>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item label="店铺" name="username" style={{ marginBottom: '0' }}>
              <InputNumber />
            </Form.Item>
            <div style={{ lineHeight: '30px', marginLeft: '10px' }}>元</div>
          </Col>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item label="哒人" name="username" style={{ marginBottom: '0' }}>
              <InputNumber />
            </Form.Item>
            <div style={{ lineHeight: '30px', marginLeft: '10px' }}>元</div>
          </Col>
        </Row>
      ),
    },

    {
      label: '每月首次提现免手续费',
      name: 'content',
      type: 'checkbox',
      select: [
        { label: '店铺', value: 'mechent' },
        { label: '哒人', value: 'd' },
      ],
    },
    {
      label: '哒人提现个人所得税比例',
      name: 'content',
      suffix: '%',
    //   wrapperCol: {offset:0, span: 4 },
    },
  ];

  return (
    <>
      <Card title={'提现规则'} bordered={false}>
        <Row gutter={8}>
          <Col span={12}>
            <FormCondition formItems={formItems}></FormCondition>
          </Col>
        </Row>
      </Card>
      {/* <Card title="店铺提现手续费规则" bordered={false}></Card> */}
      {/* 店铺提现手续费规则 */}
      <WithdrawTable></WithdrawTable>
    </>
  );
};
export default WithdrawRegular;
