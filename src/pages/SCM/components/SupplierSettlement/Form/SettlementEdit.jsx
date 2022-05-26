import React from 'react';
import moment from 'moment';
import FormCondition from '@/components/FormCondition';

const SettlementEdit = (props) => {
  const { form, initialValues = {} } = props;

  const formItems = [
    {
      label: '供应商名称',
      name: 'supplierId',
      type: 'select',
      select: [],
    },
    {
      label: '收款方户名',
      name: 'supplierName',
      readOnly: true,
      bordered: false,
      rules: [{ required: false }],
    },
    {
      label: '收款方账号',
      name: 'customTsssdditle',
      readOnly: true,
      bordered: false,
      rules: [{ required: false }],
    },
    {
      label: '收款方银行',
      name: 'cussstomTssditle',
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

export default SettlementEdit;
