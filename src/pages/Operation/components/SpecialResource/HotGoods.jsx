import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

// 已审核
const HotGoods = (props) => {
  const {
    tableRef,
    tabkey,
    globalColum = [],
    globalSearch,
    loading,
    specialGoods,
    dispatch,
  } = props;
  const [goodsList, setGoodsList] = useState([]); // 选择推荐的商品

  const searchItems = [...globalSearch];

  const getColumns = [...globalColum];

  // 表格额外按钮
  const extraBtn = [{ auth: 'cancleRecommend', text: '取消推荐', onClick: null }];

  const handleCancleRecommend = (list) => {
    console.log(list, 'liiii');
    setGoodsList(list);
    dispatch({
      type: 'specialGoods/cancleRecommend',
      payload: {
        chooseList: list,
        tabkey: tabkey,
      },
    });
    setTimeout(() => {
      console.log(goodsList, 'good');
    }, 2000);
  };

  return (
    <>
      <TableDataBlock
        noCard={false}
        cRef={tableRef}
        // btnExtra={extraBtn}
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
          onChange: (list) => handleCancleRecommend(list),
        }}
        {...specialGoods}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ specialGoods, loading }) => ({
  specialGoods,
  loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
}))(HotGoods);
