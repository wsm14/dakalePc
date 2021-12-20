import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { GAME_SIGN_STATUS, GAME_FREE_STATUS, GAME_SIGN_PACKAGE_TYPE } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import GameSignDrawer from './components/GameSign/GameSignDrawer';
// import excelProps from './components/BoxLotteryBean/ExcelProps';

const GameSign = ({ gameSignList, loading, dispatch, tabkey }) => {
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
      label: '奖品类型',
      type: 'select',
      name: 'packageType',
      select: GAME_SIGN_PACKAGE_TYPE,
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
      title: '抽奖时间',
      dataIndex: 'createTime',
    },
    {
      title: '奖品类型',
      dataIndex: 'packageType',
      render: (val) => GAME_SIGN_PACKAGE_TYPE[val],
    },
    {
      title: '中奖结果',
      dataIndex: 'packageName',
    },
    {
      title: '发放状态',
      dataIndex: 'status',
      render: (val, row) => GAME_FREE_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'userPackageId',
      render: (val, row) => [
        {
          type: 'goodsDeliver',
          visible: row.status === '1',
          click: () => fetchBoxDeatil(val, row, 'add'),
        },
        {
          type: 'goodsView',
          visible: row.status === '2',
          click: () => fetchBoxDeatil(val, row, 'info'),
        },
      ],
    },
  ];

  // 获取详情 type：info 查看
  const fetchBoxDeatil = (id, row, type) => {
    const { userAddressObject, userId } = row;
    let userAddressContent = {};
    if (userAddressObject) {
      // const contentObj = JSON.parse(row.contentParam);
      userAddressContent = `${userAddressObject.addressName || '-'},${
        userAddressObject.mobile || '-'
      },${checkCityName(userAddressObject.districtCode) || '-'}${userAddressObject.address || '-'}`;
    }

    if (type === 'add') {
      setVisible({
        type: 'add',
        show: true,
        detail: { userPackageId: id, userId, userAddressObject: userAddressContent },
      });
    } else {
      dispatch({
        type: 'boxLottery/fetchGetUserPackageByIdDetail',
        payload: { userPackageId: id },
        callback: (detail) =>
          setVisible({
            type,
            show: true,
            detail: { ...detail, userAddressObject: userAddressContent },
          }),
      });
    }
  };

  // 导出excel按钮
  const btnList = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'boxLottery/fetchGetGameExcel',
      data: {
        ...get(),
        channel: tabkey,
      },
      // exportProps: excelProps,
    },
  ];

  return (
    <>
      <TableDataBlock
        order
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
