import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Switch, DatePicker } from 'antd';
import FormCondition from '@/components/FormCondition';

const { RangePicker } = DatePicker;

const BusinessAddQuality = (props) => {
  const { dispatch, initialValues = {}, form, loading, brandList } = props;

  const formItems = [
    {
      title: '02 资质信息',
      label: '营业执照',
      name: 'den',
      type: 'upload',
      maxFile: 1,
    },
    {
      label: '商户名称',
      name: 'acTisme',
    },
    {
      label: '统一社会信用代码',
      name: 'acTime',
    },
    {
      label: '注册地址',
      name: 'deion',
    },
    {
      label: '营业期限',
      name: 'deiossn',
    },
    {
      label: '经营范围',
      name: 'dendassd',
    },
  ];

  return (
    <FormCondition
      formItems={formItems}
      initialValues={initialValues}
      form={form}
      loading={loading}
    />
  );
};

export default connect(({ businessList, loading }) => ({
  brandList: businessList.brandList.list,
  loading: loading.models.businessList,
}))(BusinessAddQuality);
