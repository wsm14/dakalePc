import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';

/**
 * 仓库信息
 */
const WarehouseFrom = ({ form, dispatch, loading, initialValues }) => {

  const formItems = [
    {
      title: '05 仓库信息',
      label: '联系人姓名',
      name: 'contactName',
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ loading }) => ({
  loading,
}))(WarehouseFrom);
