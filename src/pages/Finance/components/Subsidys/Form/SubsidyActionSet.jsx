import React, { useEffect } from 'react';
import { connect } from 'umi';
import { SUBSIDY_ACTION_ROLE, SUBSIDY_ACTION_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const SubsidyActionSet = (props) => {
  const { form, detail, loading, dispatch, tradeList } = props;

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 行业
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  const formItems = [
    {
      label: '行业',
      type: 'select',
      name: 'categoryId',
      loading,
      select: tradeList,
      fieldNames: { labelKey: 'categoryName', valueKey: 'categoryIdString' },
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
      select: Object.keys(SUBSIDY_ACTION_ROLE).map((item) => ({
        name: SUBSIDY_ACTION_ROLE[item],
        value: item,
      })),
    },
    {
      label: '奖励类型',
      name: 'subsidyType',
      type: 'select',
      select: Object.keys(SUBSIDY_ACTION_TYPE).map((item) => ({
        name: SUBSIDY_ACTION_TYPE[item],
        value: item,
      })),
    },
    {
      label: `单用户最高补贴卡豆`,
      name: 'subsidyBean',
      type: 'number',
      precision: 0,
      min: 0,
      max: 999999999,
      suffix: '卡豆',
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
