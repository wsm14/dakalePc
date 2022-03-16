import React from 'react';
import {
  PLATFORM_TICKET_SCENE,
  PLATFORM_TICKET_TYPE,
  CONPON_RULES_TYPE,
  COUPON_GIVE_TYPE,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GoodsDetail = (props) => {
  const { detail = {} } = props;

  const mreFormItems = [
    {
      label: '券类型',
      name: 'useScenesType',
      render: (val, row) => `${PLATFORM_TICKET_SCENE[val]}`,
    },
    {
      label: '券类型',
      name: 'classType',
      render: (val, row) => `${PLATFORM_TICKET_TYPE[row.useScenesType][val]}`,
    },
    {
      label: '券编号',
      name: 'platformCouponId',
    },
    {
      label: '券标题',
      name: 'couponName',
    },
    {
      label: '券描述',
      name: 'couponDesc',
    },
    {
      label: '券价值',
      name: 'couponValue',
      render: (val) => `￥${val}`,
    },
    {
      label: '使用门槛',
      name: 'thresholdPrice',
      render: (val) => `满${val}元可用`,
    },
    {
      label: '券有效期',
      name: 'useTimeRule',
      render: (val, row) => {
        const { activeDate, delayDays, activeDays } = row;
        if (val == 'fixed') {
          return activeDate[0].format('YYYY-MM-DD') + '~' + activeDate[1].format('YYYY-MM-DD');
        } else {
          if (delayDays === '0') {
            return `领取后立即生效,有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效,有效期${activeDays}天`;
        }
      },
    },
    {
      label: '发放总量',
      name: 'total',
      render: (val) => `${val}张`,
    },
    {
      label: '领取上限',
      name: 'ruleType',
      render: (val, row) =>
        ({
          unlimited: '不限',
          personLimit: `每人限制领取${row.personLimit}张`,
          dayLimit: `每人每天限制领取${row.dayMaxBuyAmount}张`,
        }[val]),
    },
    {
      label: '发放方式',
      name: 'giveType',
      render: (val, row) => COUPON_GIVE_TYPE[val],
    },
    {
      label: '是否可膨胀',
      name: 'increaseRule',
      render: (val, row) =>
        val == '0'
          ? '不可膨胀'
          : `可使用${row.beanNum || 0}卡豆进行膨胀，最高可膨胀${row.maxValue || 0}元`,
    },
    {
      label: '其他说明',
      name: 'otherDesc',
    },
  ];

  const getColumns = [
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      render: (val) => CONPON_RULES_TYPE[val],
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (val) => {
        const str = val.slice(2);
        return str && `${str}可用`;
      },
    },
  ];

  return (
    <>
      <DescriptionsCondition
        formItems={mreFormItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <div
        style={{
          height: 30,
          fontSize: 20,
          fontWeight: 'bold',
          margin: '10px 0',
        }}
      >
        使用规则
      </div>
      <TableDataBlock
        noCard={false}
        size="small"
        columns={getColumns}
        pagination={false}
        rowKey={(record) => `${record.ruleId}`}
        list={detail.ruleList}
      ></TableDataBlock>
    </>
  );
};

export default GoodsDetail;
