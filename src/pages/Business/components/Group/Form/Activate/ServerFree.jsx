import React from 'react';
import { connect } from 'umi';
import QuestionTooltip from '@/components/QuestionTooltip';
import FormCondition from '@/components/FormCondition';

/**
 * 服务费比例
 */
const OpenAccountPermit = ({ form }) => {
  const formItems = [
    {
      title: '服务费比例',
      label: '扫码付比例（%）',
      type: 'number',
      min: 0,
      precision: 0,
      name: 'scanCommissionRatio',
      disabled: true,
    },
    {
      label: (
        <QuestionTooltip
          title="商品核销（%）"
          content={'指特惠商品、抵扣券等线上购买业务创建商品/券所需要扣减的服务费'}
        ></QuestionTooltip>
      ),
      min: 0,
      precision: 0,
      name: 'commissionRatio',
      placeholder: '请输入商品核销（%）',
      disabled: true,
      rules: [{ required: true, message: '请输入商品核销费' }],
    },
  ];

  return <FormCondition formItems={formItems} form={form} />;
};

export default connect(({ loading }) => ({
  loading: loading.effects['groupSet/fetchGetOcrBusinessLicense'],
}))(OpenAccountPermit);
