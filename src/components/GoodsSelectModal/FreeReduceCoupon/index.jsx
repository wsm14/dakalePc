import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { TAG_COLOR_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

// 免费券 freeReduceCoupon
const FreeCoupon = (props) => {
  const {
    visible,
    selectItem,
    selectType,
    searchValue,
    freeCouponList,
    handleSelectItem,
    loading,
  } = props;

  const tableRef = useRef(null);

  useEffect(() => {
    // merchantId,
    // ownerId: merchantId,
    // ownerType, // merchant: '单店', group: '集团'
    visible && searchValue.merchantId && tableRef.current.fetchGetData(searchValue);
  }, [visible, searchValue]);

  const getColumns = [
    {
      title: '类型',
      align: 'center',
      width: 100,
      dataIndex: 'activityType',
      render: (val, row) => <Tag color={TAG_COLOR_TYPE[val]}>免费券</Tag>,
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
      dataIndex: 'reduceObject',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 20 }}>￥{val.couponPrice}</div>
          <div>{row.thresholdPrice ? `满${row.thresholdPrice}元可用` : '无门槛'}</div>
        </div>
      ),
    },
    {
      title: '有效期',
      align: 'right',
      dataIndex: 'activeDateStr', // 使用有效期-固定时间-开始时间
      render: (val, row) => {
        const {
          activeDate,
          endDateStr, //  使用有效期-固定时间-结束时间
          endDate,
          delayDays = 0, // 使用有效期-领取后-延迟生效天数
          activeDays, // 使用有效期-领取后-有效天数
        } = row;
        return (val && endDateStr) || (activeDate && endDate)
          ? `${val || activeDate}\n~${endDateStr || endDate}`
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
      params={{ couponType: 'reduce' }}
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
      pagination={false}
      rowKey={(row) => `${row.goodsId}`}
      dispatchType="publicModels/fetchGetFreeCouponSelect"
      {...freeCouponList}
    ></TableDataBlock>
  );
};

export default connect(({ publicModels, loading }) => ({
  freeCouponList: publicModels.freeCouponList,
  loading: loading.effects['publicModels/fetchGetFreeCouponSelect'],
}))(FreeCoupon);
