import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { ELECTRICGOODS_SELL_PRICE_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import SkuTableModal from '@/pages/Operation/components/ElectricGoods/Detail/SkuTableModal';

// 电商品 commerceGoods
const CommerceGoods = (props) => {
  const {
    visible,
    dispatch,
    searchValue,
    onlineGoods,
    selectType,
    selectItem,
    handleSelectItem,
    loading,
  } = props;

  const tableRef = useRef(null);
  const [visibleRemain, setVisibleRemain] = useState(false); // 查看佣金、库存

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
      render: (val, row) => `${val}\n${ELECTRICGOODS_SELL_PRICE_TYPE[row.paymentModeType]}`,
    },
    {
      title: '佣金/库存',
      align: 'right',
      dataIndex: 'goodsId',
      render: (val, row) => (
        <Button type="link" onClick={() => fetchSeeRepertory(val, row.goodsName)}>
          查看
        </Button>
      ),
    },
  ];

  // 查看佣金/库存    &&   调整库存
  const fetchSeeRepertory = (serviceId, goodsName) => {
    dispatch({
      type: 'electricGoods/fetchListSkuStockByServiceId',
      payload: {
        serviceId,
        ownerId: -1,
      },
      callback: (detail) =>
        setVisibleRemain({
          show: true,
          detail: {
            ...detail,
            goodsName,
            sellType: 'single', // 零售 batch 批采
          },
        }),
    });
  };

  return (
    <>
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
      {/* 查看佣金、库存 */}
      <SkuTableModal
        visible={visibleRemain}
        onClose={() => setVisibleRemain(false)}
      ></SkuTableModal>
    </>
  );
};

export default connect(({ publicModels, loading }) => ({
  onlineGoods: publicModels.onlineGoods,
  loading:
    loading.effects['publicModels/fetchListOnlineGoodsByPage'] ||
    loading.effects['electricGoods/fetchListSkuStockByServiceId'],
}))(CommerceGoods);
