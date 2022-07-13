import React, { useRef } from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import ExcelPropsOther from './BoxLotteryBean/ExcelPropsOther';

const DayDrawOther = ({ prizeList, loading, tabkey }) => {
  const tableRef = useRef();

  const searchItems = [
    {
      label: '中奖记录编号',
      name: 'winPrizeId',
    },
    {
      label: '抽奖用户',
      name: 'userId',
      type: 'user',
    },
  ];

  const getColumns = [
    {
      title: '中奖记录编号',
      dataIndex: 'prizeRecordId',
    },
    {
      title: '用户昵称',
      dataIndex: 'username',
      ellipsis: true,
    },
    {
      title: '用户手机号',
      dataIndex: 'mobile',
    },
    {
      title: '用户豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '用户所属地区',
      dataIndex: 'distinctCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '抽奖时间',
      dataIndex: 'luckDrawTime',
    },
    {
      title: '消耗卡豆数',
      dataIndex: 'needBeanNums',
    },
    {
      title: '抽奖结果',
      dataIndex: 'prizeName',
    },
    {
      title: '奖品ID',
      dataIndex: 'prizeId',
    },
  ];

  // 导出excel按钮
  const btnList = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'boxLottery/fetchAllPrizeRecordExport',
      data: { belongChannel: tabkey, ...get() },
      exportProps: ExcelPropsOther,
    },
  ];

  return (
    <TableDataBlock
      order
      noCard={false}
      btnExtra={btnList}
      cRef={tableRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.prizeRecordId}`}
      params={{ belongChannel: tabkey }}
      dispatchType="boxLottery/fetchGetLuckDrawRecord"
      {...prizeList}
    ></TableDataBlock>
  );
};
export default connect(({ boxLottery, loading }) => ({
  prizeList: boxLottery.prizeList,
  loading: loading.models.boxLottery,
}))(DayDrawOther);
