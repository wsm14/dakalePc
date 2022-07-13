import React, { useRef } from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';

// 助力免单
const HelpFreeList = ({ helpFreeList, loading }) => {
  const tableRef = useRef();

  const searchItems = [
    {
      label: '中奖记录编号',
      name: 'blindBoxRewardId',
    },
    {
      label: '中奖用户',
      name: 'userId',
      type: 'user',
    },
    {
      label: '用户所属地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  const getColumns = [
    {
      title: '中奖记录编号',
      dataIndex: 'blindBoxRewardId',
    },
    {
      title: '用户信息',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '用户所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '领取时间',
      dataIndex: 'createTime',
    },
    {
      title: '领取奖品名称/ID',
      dataIndex: 'luckDrawType',
    },
  ];

  return (
    <TableDataBlock
      order
      cRef={tableRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      cardProps={{ bordered: false }}
      rowKey={(record) => `${record.blindBoxRewardId}`}
      dispatchType="boxLottery/fetchHelpFreeList"
      {...helpFreeList}
    ></TableDataBlock>
  );
};
export default connect(({ boxLottery, loading }) => ({
  helpFreeList: boxLottery.helpFreeList,
  loading: loading.models.boxLottery,
}))(HelpFreeList);
