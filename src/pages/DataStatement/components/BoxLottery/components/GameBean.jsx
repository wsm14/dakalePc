import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { GAME_FREE_STATUS, GAME_SIGN_PACKAGE_TYPE } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import excelProps from './GameSign/ExcelProps';
import GameSignDrawer from './GameSign/GameSignDrawer';

const GameSign = ({ gameSignList, loading, tabkey }) => {
  const tableRef = useRef();

  useEffect(() => {
    tableRef.current.fetchGetData({ channel: tabkey });
  }, [tabkey]);
  // 设置 发货 详情（查看物流）
  const [visible, setVisible] = useState(false);

  // 搜索
  const searchItems = [
    {
      label: '中奖记录编号',
      name: 'userPackageId',
    },
    {
      label: '抽奖用户',
      name: 'userId',
      type: 'user',
    },
    {
      label: '发放状态',
      type: 'select',
      name: 'status',
      select: GAME_FREE_STATUS,
    },
    {
      label: '中奖结果',
      name: 'packageName',
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
      dataIndex: 'userPackageId',
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
      title: tabkey === 'mark' ? '中奖时间' : '抽奖时间',
      dataIndex: 'createTime',
    },
    {
      title: '奖品类型',
      dataIndex: 'packageType',
      show: tabkey !== 'mark',
      render: (val) => GAME_SIGN_PACKAGE_TYPE[val],
    },
    {
      title: '中奖结果',
      dataIndex: 'packageName',
    },
  ];

  // 导出excel按钮
  const btnList = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'boxLottery/fetchGetGameExcel',
      data: {
        ...get(),
        channel: tabkey,
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
        rowKey={(record) => `${record.userPackageId}`}
        params={{ channel: tabkey }}
        dispatchType="boxLottery/fetchListUserPackageManagement"
        {...gameSignList}
      ></TableDataBlock>
      {/* 发货、查看物流 */}
      <GameSignDrawer childRef={tableRef} visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};
export default connect(({ boxLottery, loading }) => ({
  gameSignList: boxLottery.gameSignList,
  loading: loading.models.boxLottery,
}))(GameSign);
