import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { GOODS_CLASS_TYPE, TAG_COLOR_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

// 本地生活品（特惠商品）
const SpecialGoods = (props) => {
  const {
    visible,
    searchValue,
    selectItem,
    offlineGoods,
    selectType,
    handleSelectItem,
    loading,
  } = props;

  const tableRef = useRef(null);

  useEffect(() => {
    const { ...other } = searchValue;
    visible && tableRef.current.fetchGetData({ ...other });
  }, [visible, searchValue]);

  const getColumns = [
    {
      title: '类型',
      align: 'center',
      width: 100,
      dataIndex: 'productType',
      render: (val) => <Tag color={TAG_COLOR_TYPE[val]}>{GOODS_CLASS_TYPE[val]}</Tag>,
    },
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
        <div>
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
          <div style={{ display: 'flex' }}>{row?.goodsId}</div>
        </div>
      ),
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityTimeRule', // 使用有效期-固定时间-开始时间
      render: (val, row) => {
        const { activityStartTime, activityEndTime } = row;
        return { fixed: `${activityStartTime} - ${activityEndTime}`, infinite: '长期' }[val];
      },
    },
    {
      title: '价格',
      align: 'right',
      dataIndex: 'sellPrice',
      render: (val, row) => (
        <div>
          <div>¥{val}</div>
          <div
            style={{
              textDecoration: 'line-through',
              color: '#9e9e9e',
            }}
          >
            ¥{row.oriPrice}
          </div>
        </div>
      ),
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
      // params={{ status: 1 }}
      scroll={{ y: 400 }}
      rowSelection={{
        type: selectType,
        selectedRowKeys: selectItem.keys,
        preserveSelectedRowKeys: true,
        getCheckboxProps: (record) => ({
          disabled: record.status === '0',
        }),
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
          handleSelectItem(selectedRowKeys, selectedRows);
        },
      }}
      rowKey={(row) => `${row.goodsId}`}
      dispatchType="publicModels/fetchListOfflineGoodsByPage"
      {...offlineGoods}
    ></TableDataBlock>
  );
};

export default connect(({ publicModels, loading }) => ({
  offlineGoods: publicModels.offlineGoods,
  loading: loading.effects['publicModels/fetchListOfflineGoodsByPage'],
}))(SpecialGoods);
