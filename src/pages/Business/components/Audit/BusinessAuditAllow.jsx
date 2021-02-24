import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import BusinessTimeSet from './BusinessTimeSet';

const BusinessAuditAllow = (props) => {
  const { dispatch, loading, categoryId, initialValues, form } = props;

  const [serviceLsit, setServiceLsit] = useState(false);
  const [speacialLsit, setSpeacialLsit] = useState(false);
  const [tagList, setTagList] = useState([]);

  // 店铺服务/基础设施
  const fetchGetService = () => {
    dispatch({
      type: 'sysTradeList/fetchDetailList',
      payload: { type: 'base' },
      callback: (val) => setServiceLsit(val),
    });
  };

  // 特色服务
  const fetchGetSpeacial = () => {
    dispatch({
      type: 'sysTradeList/fetchDetailList',
      payload: { type: 'special', categoryId },
      callback: (val) => setSpeacialLsit(val),
    });
  };

  // 店铺标签
  const fetchGetMreTag = () => {
    dispatch({
      type: 'baseData/fetchGetMreTag',
      payload: { page: 1, limit: 500 },
      callback: (val) => setTagList(val),
    });
  };

  useEffect(() => {
    fetchGetService();
    fetchGetMreTag();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchGetSpeacial();
    }
  }, [categoryId]);

  const formItems = [
    {
      title: '03 其他信息',
      label: '人均消费',
      name: 'perCapitaConsumption',
      type: 'number',
    },
    {
      label: '营业时间',
      type: 'formItem',
      rules: [{ required: false }],
      formItem: (
        <BusinessTimeSet timeObj={initialValues.businessTimeObj} form={form}></BusinessTimeSet>
      ),
    },
    {
      label: '店铺服务',
      type: 'checkbox',
      name: ['property', 'service'],
      loading: loading.effects['sysTradeList/fetchDetailList'],
      select: serviceLsit || [],
    },
    {
      label: '特色服务',
      type: 'checkbox',
      name: ['property', 'speacial'],
      rules: [{ required: false }],
      loading: loading.effects['sysTradeList/fetchDetailList'],
      select: speacialLsit || [],
    },
    {
      label: '店铺标签',
      name: 'tags',
      type: 'checkbox',
      loading: loading.effects['baseData/fetchGetMreTag'],
      select: tagList || [],
    },
    {
      label: '备注',
      type: 'textArea',
      name: 'remark',
      rules: [{ required: false }],
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ loading }) => ({ loading }))(BusinessAuditAllow);
