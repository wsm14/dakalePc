import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { ELECTRICGOODS_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

// 电商品
const EnrollCommerceGoods = (props) => {
  const { dispatch, id, onlineGoods, classifyList, loading } = props;

  const childRef = useRef();

  useEffect(() => {
    fetchGetGoodsClassify();
  }, []);

  // 获取电商品后台类目
  const fetchGetGoodsClassify = () => {
    dispatch({ type: 'baseData/fetchParentListClassify' });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '供应商名称',
      name: 'relateId',
      type: 'supplier',
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '类目',
      name: 'categoryId',
      type: 'cascader',
      select: classifyList,
      fieldNames: { label: 'classifyName', value: 'classifyId', children: 'childList' },
    },
  ];

  const getColumns = [
    {
      title: '供应商名称',
      align: 'center',
      dataIndex: 'goodsImg',
      ellipsis: true,
    },
    {
      title: '参与活动商品名称/ID',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <div>
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
          <div style={{ marginTop: 5 }}>{row.goodsId}</div>
        </div>
      ),
    },
    {
      title: '类目',
      dataIndex: 'relateName',
    },
    {
      title: '当前售价',
      align: 'right',
      dataIndex: 'price',
    },
    {
      title: '当前商家结算价',
      align: 'right',
      dataIndex: 'prddice',
    },
    {
      title: '活动售价',
      align: 'right',
      dataIndex: 'prdsddice',
    },
    {
      title: '活动结算价',
      align: 'right',
      dataIndex: 'prdssdice',
    },
    {
      title: '活动库存',
      align: 'right',
      dataIndex: 'prddaice',
    },
  ];

  return (
    <TableDataBlock
      noCard={false}
      tableSize="small"
      scroll={{ y: 400 }}
      cRef={childRef}
      loading={loading}
      searchItems={searchItems}
      columns={getColumns}
      params={{ marketingActivityId: id }}
      rowKey={(row) => `${row.goodsId}`}
      dispatchType="marketActivity/fetchMarketActivityOnlineGoods"
      {...onlineGoods}
    ></TableDataBlock>
  );
};

export default connect(({ baseData, marketActivity, loading }) => ({
  classifyList: baseData.classifyParentList,
  onlineGoods: marketActivity.onlineGoods,
  loading: loading.effects['marketActivity/fetchMarketActivityOnlineGoods'],
}))(EnrollCommerceGoods);
