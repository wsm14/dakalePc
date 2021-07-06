import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { COUPON_BUY_RULE, COUPON_WEEK_TIME } from '@/common/constant';

const RegularDetail = (props) => {
  const { detail } = props;
  const { useTime } = detail;
  // detail.useTime = useTime


  console.log(detail, 'detail22222');

  const RegularItems = [
    {
      name: 'activityTimeRule',
      label: '活动时间',
      render: (val, row) =>
        val == 'infinite'
          ? `长期`
          : activityStartTime
          ? `${row.activityStartTime[0].format('YYYY-MM-DD')}~${row.activityStartTime[1].format(
              'YYYY-MM-DD',
            )}`
          : '',
    },
    {
      name: 'goodsType',
      label: '使用有效期',
      render: (val, row) => {
        const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = row;
        console.log(useStartTime, useEndTime, useTimeRule, 'v');
        if (!useTimeRule) return '';
        if (useTimeRule === 'fixed') {
          return useStartTime
            ? useStartTime[0].format('YYYY-MM-DD') + '~' + useStartTime[1].format('YYYY-MM-DD')
            : '';
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      name: 'useTime', // COUPON_USER_TIME
      label: '适用时段',
      render: (val, row) => {
        console.log(val, 'val', typeof val);
        let week = '每周';
        if (row.timeSplit == 'part') {
          row.useWeek.forEach((item, index) => {
            week += `${COUPON_WEEK_TIME[item]}`;
            return week;
          });
        }
        const times = val
        //   ? val[0].format('HH:mm:ss') + '-' + val[1].format('HH:mm:ss')
        //   : row.timeType;
        return <>{row.timeSplit == 'part' ? `${week}--${times}` : `每天--${times}`}</>;
      },
    },
    {
      name: 'total',
      label: '投放总量',
      render: (val) => (val && val !== '--' ? `${val}份` : '--'),
    },
  ];

  const BuyRegularItem = [
    {
      name: 'buyRule',
      label: '购买上限',
      render: (val) => COUPON_BUY_RULE[val],
    },
    {
      label: `单人${
        { personLimit: '每人', dayLimit: '每天', unlimited: '不限' }[detail.buyRule]
      }购买份数`,
      name: { personLimit: 'maxBuyAmount', dayLimit: 'dayMaxBuyAmount' }[detail.buyRule],
      render: (val) => (val && val !== '--' ? `${val}份` : '--'),
    },
    {
      name: 'needOrder',
      label: '是否需要预约购买',
      render: (val) => (val == 1 ? '是' : '否'),
    },
    {
      name: 'buyDesc',
      label: '购买须知',
      render: (val) => val.map((items, ins) => <div key={ins}>{items}</div>),
    },
    {
      name: 'allowRefund',
      label: '退款规则',
      render: (val, row) => (
        <>
          <div>
            <span style={{ marginRight: '8px' }}>是否允许随时退款:</span>
            <span>{val == 1 ? '是' : '否'}</span>
          </div>
          <div>
            <span style={{ marginRight: '8px' }}>是否允许过期退款: </span>
            <span>{row.allowExpireRefund == 1 ? '是' : '否'}</span>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <DescriptionsCondition
        title="投放规则"
        formItems={RegularItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="购买规则"
        formItems={BuyRegularItem}
        initialValues={detail}
      ></DescriptionsCondition>
    </>
  );
};
export default RegularDetail;
