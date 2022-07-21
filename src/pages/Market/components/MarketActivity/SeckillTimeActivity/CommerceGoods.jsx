import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

const SeckillTimeActivity = (props) => {
  const { loading, dispatch, list, childRef } = props;

  const [visible, setVisible] = useState(false);
  const [visibleGoods, setVisibleGoods] = useState(false);

  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '商品ID',
      name: 'goodsId',
    },
    {
      label: '供应商名称',
      name: 'relateName',
    },
  ];

  const getColumns = [
    {
      title: '供应商名称',
      dataIndex: 'relateName',
      ellipsis: true,
    },
    {
      title: '秒杀商品名称/ID',
      dataIndex: 'goodsName',
      render: (val, row) => `${val}\n${row.goodsId}`,
    },
    {
      title: '类目',
      dataIndex: 'categoryName',
    },
    {
      title: '当前售价',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) => tabPriceShow('sellPrice', row),
    },
    {
      title: '当前商家结算价',
      align: 'center',
      dataIndex: 'updateTime',
      render: (val, row) => tabPriceShow('settlePrice', row),
    },
    {
      title: '秒杀价格',
      align: 'center',
      dataIndex: 'updasteTime',
      render: (val, row) => tabPriceShow('activitySellPrice', row),
    },
    {
      title: '秒杀时间',
      align: 'center',
      dataIndex: 'seckillTimeObjectList',
      render: (val, row) => {
        const { seckillBeginTime, seckillEndTime } = val[0];
        return `${seckillBeginTime} ~ ${seckillEndTime}\n每天 10:00-12:00`;
      },
    },
    {
      title: '秒杀库存',
      align: 'right',
      dataIndex: 'updadsteTisme',
      render: (val, row) => checkKeyMaxMin({ key: 'activityRemain', data: row.skuList }),
    },
    {
      title: '限购规则',
      align: 'center',
      dataIndex: ['useRuleObject', 'limit'],
      render: (val, row) => {
        const { type = 'unlimited', limitNum = 0 } = val;
        return { unlimited: '不限', personLimit: `每人限购${limitNum}件` }[type];
      },
    },
    {
      title: '秒杀状态',
      align: 'center',
      dataIndex: 'updadssteTime',
      render: (val, row) => {
        const { seckillBeginTime, seckillEndTime } = val[0];
        let text = '';
        if (!moment().isBefore(seckillEndTime)) {
          text = '已结束';
        } else if (moment().isBefore(seckillBeginTime)) {
          text = '未开始';
        } else {
          text = '进行中';
        }
        return text;
      },
    },
    {
      type: 'handle',
      dataIndex: 'goodsId',
      render: (val, row) => {
        const { offLineGoodsNum, onLineGoodsNum, startDate } = row;
        return [
          {
            type: 'changeRemain',
            click: () => fetchGetDetail(row, 'info'),
          },
          {
            title: '设置规则',
            type: 'batchEditRule', // 即将开始 无报名商品
            visible: offLineGoodsNum === 0 && onLineGoodsNum === 0 && moment().isBefore(startDate),
            click: () => fetchGetDetail(row, 'edit'),
          },
        ];
      },
    },
  ];

  const tabPriceShow = (key, row) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
      <div style={{ display: 'inline-block' }}>
        {checkKeyMaxMin({ key, data: row.skuList, payType: row.payType })}
      </div>
      <Button type="link" onClick={() => hanldeOpenEdit(row)}>
        查看
      </Button>
    </div>
  );

  const hanldeOpenEdit = (detail = {}) => {
    setVisibleEdit({ show: true, detail: { marketingActivityId: id, ...detail } });
  };

  /**
   * sku数据回显处理
   * @param {String} key 处理的key
   * @param {Array} data sku数据列表
   * @param {String} payType 支付类型 self特殊处理
   * @returns
   */
  const checkKeyMaxMin = ({ key, data = [], payType }) => {
    if (!data.length) return '';
    // 遍历值
    const valueArr = data.map((item) => {
      if (payType === 'self' && !['settlePrice', 'activitySettlePrice'].includes(key)) {
        if (key == 'sellPrice') return item['sellBean'] + item['sellPrice'] * 100;
        else return item['activitySellBean'] + item['activitySellPrice'] * 100;
      }
      if (item[key] === undefined) {
        return '';
      } else {
        return Number(item[key]);
      }
    });

    // 最大值
    const maxNum = Math.max.apply(Math, valueArr) || 0;
    // 最小值
    const minNum = Math.min.apply(Math, valueArr) || 0;

    if (payType === 'self' && !['settlePrice', 'activitySettlePrice'].includes(key)) {
      let beanKey = 'activitySellBean';
      let priceKey = 'activitySellPrice';
      if (key == 'sellPrice') {
        beanKey = 'sellBean';
        priceKey = 'sellPrice';
      }
      const maxIndex = valueArr.indexOf(maxNum); // 最大值下标
      const minIndex = valueArr.indexOf(minNum); // 最小值下标
      const maxObj = data[maxIndex] || {};
      const minObj = data[maxIndex] || {};
      const maxText = `${maxObj[beanKey] || 0}卡豆 + ￥${maxObj[priceKey] || 0}`;
      const minText = `${minObj[beanKey] || 0}卡豆 + ￥${minObj[priceKey] || 0}`;
      if (maxIndex === minIndex) {
        return minText;
      }
      return `${minText}\n~${maxText}`;
    }

    // 显示区间
    let num = `￥${minNum}~${maxNum}`;

    // 最高最低相同只显示一个
    if (minNum === maxNum) {
      num = `￥${minNum}`;
    }

    // 显示价格
    return num || 0;
  };

  // 详情
  const fetchGetDetail = (row, mode) => {
    const { marketingActivityId } = row;
    dispatch({
      type: 'marketActivity/fetchMarketActivityDetail',
      payload: { marketingActivityId, mode },
      callback: (detail) => {
        if (mode === 'enrollGoods') {
          setVisibleGoods({ show: true, detail });
        } else {
          setVisible({ show: true, detail, mode });
        }
      },
    });
  };

  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        cardProps={{ bordered: false }}
        rowKey={(record) => `${record.goodsId}`}
        dispatchType="seckillTimeActivity/fetchSeckillTimeCommerceGoodsList"
        {...list}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ loading, seckillTimeActivity }) => ({
  list: seckillTimeActivity.onlineGoods,
  loading: loading.effects['seckillTimeActivity/fetchSeckillTimeCommerceGoodsList'],
}))(SeckillTimeActivity);
