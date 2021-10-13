import React, { useState, useEffect } from 'react';
import { Space, Button, Row, Col } from 'antd';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';

const BoxPushSet = (props) => {
  const { form } = props;

  const formItems = [
    {
      label: '物流公司',
      name: 'title',
    },
    {
      label: '物流单号',
      name: 'content',
    },
  ];

  return (
    <>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </>
  );
};

export default BoxPushSet;
