import React, { useRef } from 'react';
import { connect } from 'umi';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

const CommerceGoods = (props) => {
  const { id, specialGoodsList, selectType, handleSelectItem, loading } = props;

  const childRef = useRef();

  const getColumns = [
    {
      title: '图片',
      align: 'center',
      width: 100,
      dataIndex: 'goodsImg',
      render: (val) => <PopImgShow width={60} url={val} />,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '价格',
      align: 'right',
      dataIndex: 'realPrice',
      render: (val, row) => {
        const { paymentModeObject = {} } = row;
        return paymentModeObject.type === 'self'
          ? `¥${paymentModeObject.cash}+${paymentModeObject.bean}卡豆`
          : `¥${realPrice}元`;
      },
    },
    {
      title: '库存',
      align: 'right',
      dataIndex: 'remain',
      render: (val) => `剩余${val}张`,
    },
  ];

  return (
    <TableDataBlock
      tableSize="small"
      noCard={false}
      // firstFetch={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      params={{
        relateId: '1425385024611303425',
        merchantId: -1,
        activityType: 'commerceGoods',
        goodsStatus: 1,
      }}
      scroll={{ y: 400 }}
      rowSelection={{
        type: selectType,
        preserveSelectedRowKeys: true,
        getCheckboxProps: (record) => ({
          disabled: record.name === '',
        }),
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
          handleSelectItem(selectedRowKeys, selectedRows);
        },
      }}
      rowKey={(row) => `${row.activityGoodsId}`}
      dispatchType="baseData/fetchGetSpecialGoodsSelect"
      {...specialGoodsList}
    ></TableDataBlock>
  );
};

export default connect(({ baseData, loading }) => ({
  specialGoodsList: baseData.specialGoods,
  loading: loading.effects['baseData/fetchGetSpecialGoodsSelect'],
}))(CommerceGoods);
