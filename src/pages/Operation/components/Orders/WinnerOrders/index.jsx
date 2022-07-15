import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { GAME_FREE_STATUS, GAME_SIGN_PACKAGE_TYPE, GAME_TYPE_NAME } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import GameSignDrawer from './GameSignDrawer';
import excelProps from './ExcelProps';

const WinnerOrders = ({ gameSignList, loading, dispatch, tabkey }) => {
  const tableRef = useRef();

  // 设置 发货 详情（查看物流）
  const [visible, setVisible] = useState(false);

  // 搜索
  const searchItems = [
    {
      label: '中奖编号',
      name: 'userPackageId',
    },
    {
      label: '游戏名称',
      name: 'channel',
      type: 'select',
      select: GAME_TYPE_NAME,
      allItem: false,
    },
    {
      label: '中奖用户',
      name: 'userId',
      type: 'user',
    },
    {
      label: '奖品名称',
      name: 'packageName',
    },
    {
      label: '中奖时间',
      type: 'rangePicker',
      name: 'createTimeBegin',
      end: 'createTimeEnd',
    },
    {
      label: '发放状态',
      type: 'select',
      name: 'status',
      select: GAME_FREE_STATUS,
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
      title: '奖品名称',
      dataIndex: 'packageName',
    },
    {
      title: '游戏名称/中奖编号',
      dataIndex: 'userPackageId',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          <div>{GAME_TYPE_NAME[row.channel]}</div>
          <div>{val}</div>
        </div>
      ),
    },
    {
      title: '中奖用户昵称/手机号',
      dataIndex: 'username',
      render: (val, row) => (
        <div>
          <div style={{ textAlign: 'center' }}>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
            <div>{row.mobile}</div>
          </div>
        </div>
      ),
    },
    {
      title: '用户豆号/所属地区',
      dataIndex: 'districtCode',
      render: (val, row) => (
        <div>
          <div style={{ textAlign: 'center' }}>
            <div>{row.beanCode}</div>
            <div>{checkCityName(val)}</div>
          </div>
        </div>
      ),
    },
    {
      title: '中奖/兑换时间',
      dataIndex: 'createTime',
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
          type: 'goodsDeliver', // 发货
          visible: row.status === '1',
          click: () => fetchBoxDeatil(val, row, 'add'),
        },
        {
          type: 'goodsView', // 查看物流
          visible: row.status === '2',
          click: () => fetchBoxDeatil(val, row, 'info'),
        },
      ],
    },
  ];

  // 获取详情 type：info 查看
  const fetchBoxDeatil = (id, row, type) => {
    const { userAddressObject = {}, userId, logisticsInfo = '', mobile, companyCode } = row;
    let userAddressContent = {};
    if (userAddressObject) {
      // const contentObj = JSON.parse(row.contentParam);
      userAddressContent = `${userAddressObject?.addressName || '-'},${
        userAddressObject?.mobile || '-'
      },${checkCityName(userAddressObject?.districtCode) || '-'}${
        userAddressObject?.address || '-'
      }`;
    }

    if (type === 'add') {
      setVisible({
        type: 'add',
        show: true,
        detail: { userPackageId: id, userId, userAddressObject: userAddressContent },
      });
    } else {
      dispatch({
        type: 'refundOrder/fetchGetExpressInfo',
        payload: {
          expressCompany: companyCode,
          expressNo: logisticsInfo.split('|')[1],
          receiveUserMobile: mobile,
        },
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
      data: get(),
      exportProps: excelProps,
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        btnExtra={btnList}
        cRef={tableRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userPackageId}`}
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
}))(WinnerOrders);
