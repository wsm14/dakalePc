import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const MarketActivityDetail = (props) => {
  const { initialValues } = props;

  const domShow = (befor = '', value, after = '') => (
    <label>
      {befor} <span style={{ color: '#F59A23', fontSize: 16 }}>{value}</span> {after}
    </label>
  );

  const formItems = [
    {
      label: '活动名称',
      name: 'activityName',
    },
    {
      label: '活动时间',
      name: 'startDate',
      render: (val, row) => `${val} ~ ${row.endDate}`,
    },
    {
      label: '活动规则',
      name: 'activityRuleObject',
      render: (val, row) => {
        const { activityRuleType = '', categories = [], classifies = [], discount } = val;
        const typeArr = activityRuleType.split(',');
        const textArr = [];
        if (typeArr.includes('discount')) {
          textArr.push(
            domShow(
              '报名参与本次活动的商家所提供的特惠套餐价格不可高于',
              discount,
              '折，商品结算价也根据折扣同步递减',
            ),
          );
        }
        if (typeArr.includes('categories')) {
          textArr.push(
            domShow('本次活动仅限', categories.map((i) => i.categoryName).toString(), '商户参加'),
          );
        }
        if (typeArr.includes('classifies')) {
          textArr.push(
            domShow(
              '本次活动仅限',
              classifies.map((i) => i.classifyName).toString(),
              '商户类目参加',
            ),
          );
        }
        return textArr.map((dom, i) => (
          <div key={`activityRule${i}`}>
            {i + 1}. {dom}
          </div>
        ));
      },
    },
    {
      label: '活动备注',
      name: 'activityRemarks',
    },
    {
      label: '使用规则',
      name: 'useRuleObject',
      render: (val, row) => {
        const { useRuleType = '', limit = {}, subsidy = {} } = val;
        const typeArr = useRuleType.split(',');
        const textArr = [];
        // 限购规则
        if (typeArr.includes('limit')) {
          const { type, limitNum } = limit;
          if (type === 'personLimit') textArr.push({ dom: domShow('每人限购', limitNum, '份') });
        }
        // 补贴规则
        if (typeArr.includes('subsidy')) {
          const { type, rate } = subsidy;
          if (type === 'coupon')
            textArr.push({
              title: '赠送平台券',
              dom: <div>111</div>,
            });
          if (type === 'rate') textArr.push({ dom: domShow('卡豆抵扣比例', `${rate}%`) });
        }
        return textArr.map(({ title, dom }, i) => (
          <div key={`userRule${i}`}>
            {i + 1}. {title || dom}
            {title && dom}
          </div>
        ));
      },
    },
    {
      label: '使用备注',
      name: 'useRemarks',
    },
    {
      label: '活动链接',
      name: 'url',
    },
  ];

  return (
    <DescriptionsCondition
      formItems={formItems}
      initialValues={initialValues}
    ></DescriptionsCondition>
  );
};

export default MarketActivityDetail;
