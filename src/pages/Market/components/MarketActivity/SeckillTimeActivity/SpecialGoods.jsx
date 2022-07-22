import React from 'react';
import moment from 'moment';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import NumberValueSet from '@/components/FormListCondition/NumberValueSet';

const SeckillTimeActivity = (props) => {
  const { loading, dispatch, list, childRef, setSelectItem, handleSetShow } = props;

  const searchItems = [
    {
      label: '商品名称',
      name: 'activityName',
    },
    {
      label: '商品ID',
      name: 'marketingActivityId',
    },
    {
      label: '店铺名称',
      name: 'status',
    },
  ];

  const getColumns = [
    {
      title: '店铺/品牌名称',
      dataIndex: 'activityName',
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
      align: 'right',
      dataIndex: 'sellPrice',
    },
    {
      title: '当前商家结算价',
      align: 'right',
      dataIndex: 'settlePrice',
    },
    {
      title: '秒杀价格',
      align: 'center',
      dataIndex: 'activitySellPrice',
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
      dataIndex: 'activityRemain',
      render: (val, row) => (
        <NumberValueSet
          value={val}
          valueKey="activityTotal"
          loading={loading}
          inputProps={{ min: 0, precision: 0 }}
          onSubmit={(number) =>
            fetchUpdateRemain({
              ownerId: row.ownerId,
              goodsId: row.goodsId,
              marketingSeckillId: row.id,
              goodsType: 'specialGoods',
              skuList: [
                {
                  skuId: row.skuId,
                  ...number,
                },
              ],
            })
          }
        ></NumberValueSet>
      ),
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
      dataIndex: 'seckillTimeObjectList',
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
      dataIndex: 'id',
      render: (val, row) => {
        const { seckillEndTime } = row;
        return [
          {
            title: '设置规则',
            type: 'batchEditRule', // 即将开始 无报名商品
            visible: !moment().isBefore(seckillEndTime),
            click: () => handleSetShow([row]),
          },
        ];
      },
    },
  ];

  // 修改库存
  const fetchUpdateRemain = (values) => {
    dispatch({
      type: 'seckillTimeActivity/fetchSeckillTimeActivityGoodsEditRemain',
      payload: values,
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
        rowSelection={{
          preserveSelectedRowKeys: true,
          getCheckboxProps: (record) => {
            const { seckillEndTime } = record.seckillTimeObjectList[0];
            return {
              disabled: !moment().isBefore(seckillEndTime), // 已结束可选
            };
          },
          onChange: (selectedRowKeys, selectedRows) => setSelectItem(selectedRows),
        }}
        searchItems={searchItems}
        cardProps={{ bordered: false }}
        rowKey={(record) => `${record.goodsId}`}
        dispatchType="seckillTimeActivity/fetchSeckillTimeSpecialGoodsList"
        {...list}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ loading, seckillTimeActivity }) => ({
  list: seckillTimeActivity.offlineGoods,
  loading:
    loading.effects['seckillTimeActivity/fetchSeckillTimeSpecialGoodsList'] ||
    loading.effects['seckillTimeActivity/fetchSeckillTimeActivityGoodsEditRemain'],
}))(SeckillTimeActivity);
