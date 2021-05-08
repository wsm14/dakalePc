import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { NUM_INT, NUM_PATTERN } from '@/common/regExp';
import { SUBSIDY_ACTION_ROLE, SUBSIDY_ACTION_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const SubsidyActionSet = (props) => {
  const { form, detail, loading, dispatch, tradeList } = props;

  // 是否显示手续费 默认不显示 到店打卡 mark 无手续费
  const [handleFee, setHandleFee] = useState('mark');

  useEffect(() => {
    // 修改时根据type 展示手续费表单
    setHandleFee(detail.subsidyType || 'mark');
  }, []);

  const formItems = [
    {
      label: '行业',
      type: 'select',
      name: 'categoryId',
      loading,
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString' },
      onChange: (val, item) => form.setFieldsValue({ category: item.children[0] }),
    },
    {
      label: '行业名称',
      name: 'category',
      hidden: true,
    },
    {
      label: '补贴角色',
      name: 'subsidyRole',
      type: 'select',
      select: SUBSIDY_ACTION_ROLE,
    },
    {
      label: '奖励类型',
      name: 'subsidyType',
      type: 'select',
      select: SUBSIDY_ACTION_TYPE,
      onChange: setHandleFee,
    },
    {
      label: `单用户最高补贴卡豆`,
      name: 'subsidyBean',
      suffix: '卡豆',
      addRules: [{ pattern: NUM_INT, message: '卡豆数量应为整数' }],
    },
    {
      label: `手续费`,
      name: 'handlingFee',
      suffix: '%',
      addRules: [{ pattern: NUM_PATTERN, message: '手续费应为整数数字' }],
      visible: handleFee !== 'mark',
    },
    {
      label: '备注',
      name: 'remark',
      type: 'textArea',
      rules: [{ required: false }],
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default connect(({ sysTradeList, loading }) => ({
  tradeList: sysTradeList.list.list,
  loading: loading.effects['sysTradeList/fetchGetList'],
}))(SubsidyActionSet);
