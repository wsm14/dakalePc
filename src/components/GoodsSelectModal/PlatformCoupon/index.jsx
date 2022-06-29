import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { PLATFORM_TICKET_TYPE, TAG_COLOR_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

// 平台券 platformCoupon
const PlatformCoupon = (props) => {
  const {
    disabled,
    visible,
    selectItem,
    selectType,
    searchValue,
    platformCoupon,
    handleSelectItem,
    loading,
  } = props;

  const tableRef = useRef(null);

  useEffect(() => {
    const { platformCouponId } = searchValue;
    visible &&
      tableRef.current.fetchGetData({ platformCouponId, couponName: searchValue.goodsName });
  }, [visible, searchValue]);

  const getColumns = [
    {
      title: '类型',
      align: 'center',
      width: 100,
      dataIndex: 'classType',
      render: (val, row) => (
        <Tag color={TAG_COLOR_TYPE[row.useScenesType][val]}>
          {PLATFORM_TICKET_TYPE[row.useScenesType][val] || '暂无此类'}
        </Tag>
      ),
    },
    {
      title: '券名称/ID',
      dataIndex: 'couponName',
      render: (val, row) => (
        <>
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
          <div>{row?.goodsId}</div>
        </>
      ),
    },
    {
      title: '券价值',
      align: 'center',
      dataIndex: 'couponValue',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 20 }}>￥{val}</div>
          <div>满{row.thresholdPrice}元可用</div>
        </div>
      ),
    },
    {
      title: '有效期',
      align: 'right',
      dataIndex: 'activeDate', // 使用有效期-固定时间-开始时间
      render: (val, row) => {
        const {
          endDate,
          delayDays = 0, // 使用有效期-领取后-延迟生效天数
          activeDays, // 使用有效期-领取后-有效天数
        } = row;
        return val && endDate
          ? `${val}\n~${endDate}`
          : delayDays != 0
          ? `领取后 ${delayDays} 天生效\n有效期 ${activeDays} 天`
          : `领取后 ${activeDays} 天内`;
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
      scroll={{ y: 400 }}
      params={{
        couponStatus: 1,
        giveType: 'manual', // 手动领取
      }}
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
      }}
      rowKey={(row) => `${row.goodsId}`}
      dispatchType="publicModels/fetchGetPlatformCouponList"
      {...platformCoupon}
    ></TableDataBlock>
  );
};

export default connect(({ publicModels, loading }) => ({
  platformCoupon: publicModels.platformCoupon,
  loading: loading.effects['publicModels/fetchGetPlatformCouponList'],
}))(PlatformCoupon);
