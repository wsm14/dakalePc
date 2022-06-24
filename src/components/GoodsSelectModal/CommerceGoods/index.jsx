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
    rowSelection,
    disabled,
    loading,
    loadingProps,
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
        <Button type="link" onClick={() => fetchSeeRepertory(val, row)}>
          查看
        </Button>
      ),
    },
  ];

  // 查看佣金/库存    &&   调整库存
  const fetchSeeRepertory = (serviceId, row) => {
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
            ...row,
            ...detail,
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
        loading={loading || loadingProps}
        columns={getColumns}
        params={{
          status: 1,
          sellType: 'single',
          displayType: 'manualOrList',
        }}
        scroll={{ y: 400 }}
        rowSelection={{
          type: selectType,
          selectedRowKeys: selectItem.keys,
          preserveSelectedRowKeys: true,
          getCheckboxProps: (record) => ({
            disabled: disabled && disabled(record),
          }),
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
            handleSelectItem(selectedRowKeys, selectedRows);
          },
          // 外部传递 选择配置 覆盖当前配置 主要用于外部校验
          ...(rowSelection ? rowSelection({ selectItem, setSelectItem: handleSelectItem }) : {}),
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
