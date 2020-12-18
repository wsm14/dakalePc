import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import FormCondition from '@/components/FormCondition';
// import aliOssUpload from '@/utils/aliOssUpload';
import BusinessTimeSet from './BusinessTimeSet';

const BusinessAuditAllow = (props) => {
  const { dispatch, loading, categoryId, initialValues, form } = props;

  const [serviceLsit, setServiceLsit] = useState(false);
  const [speacialLsit, setSpeacialLsit] = useState(false);

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

  useEffect(() => {
    fetchGetService();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchGetSpeacial();
    }
  }, [categoryId]);

  const formItems = [
    // {
    //   label: '店铺主图',
    //   name: 'allImages',
    //   type: 'upload',
    //   maxFile: 3,
    // },
    {
      title: '03 其他信息',
      label: '人均消费',
      name: 'perCapitaConsumption',
      type: 'number',
    },
    {
      label: '营业时间',
      type: 'childrenOwn',
      rules: [{ required: false }],
      childrenOwn: (
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
      select: [
        { label: '人气商家', value: '人气商家' },
        { label: '景观店家', value: '景观店家' },
        { label: '品牌连锁', value: '品牌连锁' },
      ],
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
