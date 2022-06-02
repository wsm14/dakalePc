import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

const CommerceGoods = (props) => {
  const {
    visible,
    searchValue,
    specialGoodsList,
    selectType,
    selectItem,
    handleSelectItem,
    loading,
  } = props;

  const tableRef = useRef(null);

  useEffect(() => {
    const { id, ...other } = searchValue;
    visible && id && tableRef.current.fetchGetData({ relateId: id, ...other });
  }, [visible, searchValue]);

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
          : `¥${val}元`;
      },
    },
    {
      title: '库存',
      align: 'right',
      dataIndex: 'remain',
      render: (val) => `剩 ${val}`,
    },
  ];

  return (
    <TableDataBlock
      tableSize="small"
      noCard={false}
      firstFetch={false}
      cRef={tableRef}
      loading={loading}
      columns={getColumns}
      params={{
        merchantId: -1,
        activityType: 'commerceGoods',
        goodsStatus: 1,
      }}
      scroll={{ y: 400 }}
      rowSelection={{
        type: selectType,
        selectedRowKeys: selectItem.keys,
        preserveSelectedRowKeys: true,
        getCheckboxProps: (record) => ({
          disabled: record.name === '',
        }),
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
          handleSelectItem(selectedRowKeys, selectedRows);
        },
      }}
      rowKey={(row) => `${row.activityGoodsId || row.specialGoodsId}`}
      dispatchType="baseData/fetchGetSpecialGoodsSelect"
      {...specialGoodsList}
    ></TableDataBlock>
  );
};

export default connect(({ baseData, loading }) => ({
  specialGoodsList: baseData.specialGoods,
  loading: loading.effects['baseData/fetchGetSpecialGoodsSelect'],
}))(CommerceGoods);
