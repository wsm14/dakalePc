import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

// 电商品
const CommerceGoods = (props) => {
  const {
    visible,
    searchValue,
    onlineGoods,
    selectType,
    selectItem,
    handleSelectItem,
    loading,
  } = props;

  const tableRef = useRef(null);

  useEffect(() => {
    const { id, ...other } = searchValue;
    visible && tableRef.current.fetchGetData(other);
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
      title: '商品名称/ID',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <>
          <Ellipsis length={20} tooltip>
            {val}
          </Ellipsis>
          <div>{row?.goodsId}</div>
        </>
      ),
    },
    {
      title: '价格',
      align: 'right',
      dataIndex: 'sellPriceRange',
    },
    {
      title: '库存',
      align: 'right',
      dataIndex: 'remain',
      render: (val) => `剩 ${val || 0}`,
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
        status: 1,
        sellType: 'single',
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
      rowKey={(row) => `${row.goodsId}`}
      dispatchType="publicModels/fetchListOnlineGoodsByPage"
      {...onlineGoods}
    ></TableDataBlock>
  );
};

export default connect(({ publicModels, loading }) => ({
  onlineGoods: publicModels.onlineGoods,
  loading: loading.effects['publicModels/fetchListOnlineGoodsByPage'],
}))(CommerceGoods);
