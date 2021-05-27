import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { NUM_INT, NUM_PATTERN } from '@/common/regExp';
import { SUBSIDY_ACTION_ROLE, SUBSIDY_ACTION_TYPE_FORM } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const SubsidyActionSet = (props) => {
  const { form, detail, loading, tradeList } = props;

  const [handleFee, setHandleFee] = useState('mark'); // 是否显示手续费 默认不显示 到店打卡 mark 无手续费
  const [subsidyRole, setSubsidyRole] = useState(''); // 是否需要行业 补贴角色为店铺时显示行业选项

  useEffect(() => {
    setSubsidyRole(detail.subsidyRole); // 修改时根据type 展示是否需要行业
    setHandleFee(detail.subsidyType || 'mark'); // 修改时根据type 展示手续费表单
  }, []);

  const formItems = [
    {
      label: '补贴角色',
      name: 'subsidyRole',
      type: 'select',
      select: SUBSIDY_ACTION_ROLE,
      onChange: (val) => {
        setSubsidyRole(val); // 是否需要行业
        setHandleFee(false); // 是否显示手续费
        form.setFieldsValue({ subsidyType: undefined }); // 重置数据
      },
    },
    {
      label: '行业',
      type: 'select',
      name: 'categoryId',
      loading,
      select: tradeList,
      visible: subsidyRole === 'merchant',
      fieldNames: { label: 'categoryName', value: 'categoryIdString' },
      onChange: (val, item) => form.setFieldsValue({ category: item.children[0] }),
    },
    {
      label: '行业名称',
      name: 'category',
      hidden: true,
      visible: subsidyRole === 'merchant',
    },
    {
      label: '奖励类型',
      name: 'subsidyType',
      type: 'select',
      select: SUBSIDY_ACTION_TYPE_FORM[subsidyRole],
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
      visible: ['video', 'image'].includes(handleFee),
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
