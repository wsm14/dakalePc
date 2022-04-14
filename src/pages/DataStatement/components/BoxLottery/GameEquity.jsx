import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { GAME_SIGN_STATUS, GAME_FREE_STATUS, GAME_SIGN_PACKAGE_TYPE } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import excelProps from './components/GameSign/ExcelPropsEquity';

const GameSign = ({ gameEquityList, loading, tabkey, twoTabkey }) => {
  const twoType = {
    gameSign: 'signGame',
    gameFree: 'freeGoodGame',
    gameGather: 'gatherCardGame',
    gameFarm: 'farmGame',
  };
  const tableRef = useRef();

  useEffect(() => {
    tableRef.current.fetchGetData({ gameName: twoType[tabkey] });
  }, [twoTabkey]);

  // 搜索
  const searchItems = [
    {
      label: '中奖记录编号',
      name: 'gameRecordId',
    },
    {
      label: '抽奖用户',
      name: 'userIdString',
      type: 'user',
    },
    {
      label: '奖品类型',
      type: 'select',
      name: 'prizeType',
      select: GAME_SIGN_PACKAGE_TYPE,
    },
    {
      label: '中奖结果',
      name: 'prize',
      placeholder: '请输入卡豆数',
    },
    {
      label: '抽奖时间',
      type: 'rangePicker',
      name: 'createTimeBegin',
      end: 'createTimeEnd',
    },
    {
      label: '用户所属地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];
  // 表头
  const getColumns = [
    {
      title: '中奖记录编号',
      dataIndex: 'gameRecordId',
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
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '抽奖时间',
      dataIndex: 'createTime',
    },
    {
      title: '奖品类型',
      dataIndex: 'prizeType',
      render: (val) => GAME_SIGN_PACKAGE_TYPE[val],
    },
    {
      title: '中奖结果',
      dataIndex: 'prizeName',
    },
  ];

  // 导出excel按钮
  const btnList = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'boxLottery/fetchListUserPackageManagementBeanExport',
      data: {
        ...get(),
        gameName: twoType[tabkey],
      },
      exportProps: excelProps,
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        firstFetch={false}
        noCard={false}
        btnExtra={btnList}
        cRef={tableRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.gameRecordId}`}
        params={{ gameName: twoType[tabkey] }}
        dispatchType="boxLottery/fetchListUserPackageManagementBean"
        {...gameEquityList}
      ></TableDataBlock>
    </>
  );
};
export default connect(({ boxLottery, loading }) => ({
  gameEquityList: boxLottery.gameEquityList,
  loading: loading.models.boxLottery,
}))(GameSign);
