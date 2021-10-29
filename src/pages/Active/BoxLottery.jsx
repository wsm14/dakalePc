import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { BOXLOTTERY_STATUS, BOXLOTTERY_TYPE } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import BoxDrawer from './components/BoxLottery/BoxDrawer';

const BoxLottery = ({ boxLottery, loading, dispatch }) => {
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
      // fixed: 'left',
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
    },
    {
      title: '抽奖结果',
      dataIndex: 'showName',
    },
    {
      title: '奖品ID',
      dataIndex: 'awardId',
    },
    {
      title: '发放状态',
      // fixed: 'right',
      dataIndex: 'logisticsStatus',
      render: (val, row) => BOXLOTTERY_STATUS[val] || '--',
    },
    {
      type: 'handle',
      dataIndex: 'blindBoxRewardId',
      render: (val, row) => [
        {
          type: 'goodsDeliver',
          visible: row.logisticsStatus === '1',
          click: () => fetchBoxDeatil(val, row, 'add'),
        },
        {
          type: 'goodsView',
          visible: row.logisticsStatus === '2',
          click: () => fetchBoxDeatil(val, row, 'info'),
        },
      ],
    },
  ];

  // 获取详情 type：info 查看
  const fetchBoxDeatil = (id, row, type) => {
    let contentParam = {};
    if (row.contentParam) {
      const contentObj = JSON.parse(row.contentParam);
      contentParam = `${contentObj.addressName},${contentObj.mobile},${checkCityName(
        contentObj.districtCode,
      )}${contentObj.address}`;
    }

    if (type === 'add') {
      setVisible({ type: 'add', shwo: true, detail: { blindBoxRewardId: id, contentParam } });
    } else {
      dispatch({
        type: 'boxLottery/fetchBoxPushDetail',
        payload: { blindBoxRewardId: id, userId: row?.userId },
        callback: (detail) =>
          setVisible({
            type,
            shwo: true,
            detail: { ...detail, contentParam },
          }),
      });
    }
  };

  // 导出excel按钮
  const btnList = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'boxLottery/fetchGetExcel',
      data: get(),
      exportProps: { header: getColumns },
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
        rowKey={(record) => `${record.blindBoxRewardId}`}
        dispatchType="boxLottery/fetchGetList"
        {...boxLottery}
      ></TableDataBlock>
      {/* 发货、查看物流 */}
      <BoxDrawer childRef={tableRef} visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};
export default connect(({ boxLottery, loading }) => ({
  boxLottery,
  loading: loading.models.boxLottery,
}))(BoxLottery);
