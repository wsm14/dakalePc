import React, { useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';

const SettlementEdit = (props) => {
  const { form, initialValues = {}, dispatch, loading } = props;

  const [selectList, setSelectList] = useState([]);

  // 搜索
  const fetchGetSearch = debounce((content) => {
    if (!content.replace(/'/g, '')) return;
    dispatch({
      type: 'baseData/fetchSearchSupplierManage',
      payload: {
        name: content.replace(/'/g, ''),
      },
      callback: setSelectList,
    });
  }, 500);

  const formItems = [
    {
      label: '供应商名称',
      name: 'supplierId',
      type: 'select',
      select: selectList,
      loading,
      onSearch: (val) => fetchGetSearch(val),
      onChange: (val, option) => {
        form.setFieldsValue({
          supplierName: option.option.name,
        });
      },
    },
    {
      label: '供应商名',
      name: 'supplierName',
      rules: [{ required: false }],
      hidden: true,
    },
    {
      label: '收款方户名',
      name: 'legalPerson',
      readOnly: true,
      bordered: false,
      rules: [{ required: false }],
    },
    {
      label: '收款方账号',
      name: 'cardNo',
      readOnly: true,
      bordered: false,
      rules: [{ required: false }],
    },
    {
      label: '收款方银行',
      name: 'bankBranchName',
      readOnly: true,
      bordered: false,
      rules: [{ required: false }],
    },
    {
      label: '结算金额',
      name: 'settleAmount',
      type: 'number',
      suffix: '元',
      precision: 2,
      min: 0,
      max: 9999999999.99,
    },
    {
      label: '付款方账号',
      name: 'payerAccount',
      maxLength: 24,
      normalize: (val) => {
        let str = val;
        str = str.replace(/\D/g, '');
        let ncard = '';
        for (let n = 0; n < str.length; n = n + 4) {
          ncard += str.substring(n, n + 4) + ' ';
        }
        return ncard.replace(/(\s*$)/g, '');
      },
    },
    {
      label: '结算流水号',
      name: 'settleNum',
    },
    {
      label: '交易时间',
      name: 'settleTime',
      type: 'dataPicker',
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
      disabledDate: (current) => current && current > moment().endOf('day'),
    },
    {
      label: '凭证',
      name: 'certificate',
      type: 'upload',
      maxFile: 1,
      isCut: false,
      rules: [{ required: false }],
    },
    {
      label: '备注',
      name: 'remarks',
      type: 'textArea',
      maxLength: 200,
      rules: [{ required: false }],
    },
  ];

  return (
    <FormCondition form={form} formItems={formItems} initialValues={initialValues}></FormCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['baseData/fetchSearchSupplierManage'],
}))(SettlementEdit);
