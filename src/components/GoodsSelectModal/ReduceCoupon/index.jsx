import React, { useRef } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const ReduceCoupon = (props) => {
  const { id, couponList, selectType, handleSelectItem, loading } = props;

  const childRef = useRef();

  const getColumns = [
    {
      title: '类型',
      align: 'center',
      width: 100,
      dataIndex: 'buyFlag',
      render: (val) => (
        <Tag color={val === '0' ? 'orange' : 'magenta'}>{['免费券', '抵扣券'][val]}</Tag>
      ),
    },
    {
      title: '券名称',
      dataIndex: 'couponName',
    },
    {
      title: '有效期',
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
          ? `${val || activeDate} - ${endDateStr || endDate}`
          : delayDays != 0
          ? `领取后${delayDays}天生效｜有效期${activeDays}天`
          : `领取后${activeDays}天内`;
      },
    },
    {
      title: '使用门槛',
      align: 'center',
      dataIndex: 'thresholdPrice',
      render: (val) => (val ? `满${val}元可用` : '无门槛'),
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
        merchantId: '1425385024611303425',
        goodsStatus: 1,
        couponType: 'reduce',
        buyFlag: 1, // 有价券
      }}
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
      rowKey={(row) => `${row.ownerCouponIdString}`}
      dispatchType="baseData/fetchGetBuyCouponSelect"
      {...couponList}
    ></TableDataBlock>
  );
};

export default connect(({ baseData, loading }) => ({
  couponList: baseData.buyCoupon,
  loading: loading.effects['baseData/fetchGetBuyCouponSelect'],
}))(ReduceCoupon);
