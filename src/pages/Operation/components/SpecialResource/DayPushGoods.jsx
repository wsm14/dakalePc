import React, { useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

// 已审核
const DayPushGoods = (props) => {
  const { tableRef, tabkey, globalColum = [], globalSearch, loading, specialGoods } = props;
  const [goodsList, setGoodsList] = useState([]); // 选择推荐的商品

  const searchItems = [...globalSearch];

  const getColumns = [...globalColum];
  const extraBtn = [{ auth: 'cancleRecommend', text: '取消推荐', onClick: null }];

  return (
    <>
      <TableDataBlock
        noCard={false}
        cRef={tableRef}
        btnExtra={extraBtn}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType="specialGoods/fetchGetList"
        params={{ promotionLocation: tabkey }}
        rowSelection={{
            getCheckboxProps: ({ status, deleteFlag }) => ({
              disabled: !['1', '2'].includes(status) || deleteFlag == '0', // 不是 活动中 即将开始 || 已删除
            }),
            onChange: setGoodsList,
          }}
        {...specialGoods}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ specialGoods, loading }) => ({
  specialGoods,
  loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
}))(DayPushGoods);
