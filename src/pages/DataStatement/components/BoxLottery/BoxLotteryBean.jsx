import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { BOXLOTTERY_STATUS, BOXLOTTERY_TYPE } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import BoxDrawer from './components/BoxLotteryBean/BoxDrawer';
import excelProps from './components/BoxLotteryBean/ExcelProps';

const BoxLotteryBean = ({ beanBoxList, loading }) => {
  const tableRef = useRef();
  // 设置 发货 详情
  const [visible, setVisible] = useState(false);

  const searchItems = [
    {
      label: '中奖记录编号',
      name: 'blindBoxRewardId',
    },
    {
      label: '抽奖用户',
      name: 'userId',
      type: 'user',
    },
    {
      label: '抽奖场次',
      type: 'select',
      name: 'luckDrawType',
      select: BOXLOTTERY_TYPE,
    },
    {
      label: '状态',
      type: 'select',
      name: 'logisticsStatus',
      select: BOXLOTTERY_STATUS,
    },
    {
      label: '抽奖结果',
      name: 'showName',
    },
    {
      label: '抽奖时间',
      type: 'rangePicker',
      name: 'luckDrawStartTime',
      end: 'luckDrawEndTime',
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
      title: '用户昵称',
      dataIndex: 'userName',
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
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '抽奖时间',
      dataIndex: 'createTime',
    },
    {
      title: '抽奖场次',
      dataIndex: 'luckDrawType',
      render: (val) => BOXLOTTERY_TYPE[val],
    },
    {
      title: '消耗卡豆数',
      dataIndex: 'consumeNum',
      render: (val, row) => (row.luckDrawType === 'bean' ? val : '--'),
    },
    {
      title: '抽奖结果',
      dataIndex: 'showName',
    },
    {
      title: '奖品ID',
      dataIndex: 'awardId',
    },
  ];

  // 导出excel按钮
  const btnList = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'boxLottery/fetchGetExcel',
      data: get(),
      exportProps: excelProps,
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        cRef={tableRef}
        loading={loading}
        btnExtra={btnList}
        columns={getColumns}
        searchItems={searchItems}
        cardProps={{ bordered: false }}
        rowKey={(record) => `${record.blindBoxRewardId}`}
        dispatchType="boxLottery/fetchGetList"
        {...beanBoxList}
      ></TableDataBlock>
      {/* 发货、查看物流 */}
      <BoxDrawer childRef={tableRef} visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};
export default connect(({ boxLottery, loading }) => ({
  beanBoxList: boxLottery.beanBoxList,
  loading: loading.models.boxLottery,
}))(BoxLotteryBean);
