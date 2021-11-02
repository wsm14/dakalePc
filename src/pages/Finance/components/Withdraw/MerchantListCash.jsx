import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Spin, Tag } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { WITHDRAW_STATUS, ACCOUNT_TYPE } from '@/common/constant';
import TableDataBlock, { HandleSetTable } from '@/components/TableDataBlock';
import { checkCityName } from '@/utils/utils';

const MerchantListCash = (props) => {
  const { withdrawDetail, loading, dispatch } = props;

  const { totalData } = withdrawDetail;

  const toatlLoading = loading.effects['withdrawDetail/fetchWithdrawCashTotal'];

  const childRef = useRef();

  const [visible, setVisible] = useState(false); // 修改弹窗
  // 显示当前数据的时间标记
  const [searchTime, setSearchTime] = useState([
    moment().subtract(1, 'month').format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ]);

  useEffect(() => {
    fetchWithdrawCashTotal();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '提现日期',
      type: 'rangePicker',
      name: 'withdrawalDateStart',
      end: 'withdrawalDateEnd',
    },
    {
      label: '店铺',
      name: 'merchantName',
    },
    {
      label: '店铺帐号',
      name: 'merchantAccount',
    },
    {
      label: '提现单号',
      name: 'withdrawalSn',
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '提现日期',
      fixed: 'left',
      dataIndex: 'withdrawalDate',
    },
    {
      title: '流水单号',
      fixed: 'left',
      dataIndex: 'withdrawalSn',
    },
    {
      title: '店铺名称',
      width: 200,
      dataIndex: 'merchantName',
      ellipsis: { lines: 2 },
    },
    {
      title: '店铺账号',
      dataIndex: 'merchantAccount',
    },
    {
      title: '省市区',
      dataIndex: 'districtCode',
      render: (val, row) => checkCityName(val),
    },
    {
      title: '提现账户',
      align: 'center',
      dataIndex: 'withdrawalAccount',
      render: (val, row) => `${row.withdrawalChannelName}\n${val}`,
    },
    {
      title: '提现账户类型',
      align: 'right',
      dataIndex: 'withdrawalType',
      render: (val) => '现金账户',
    },
    {
      title: '提现金额',
      align: 'right',
      dataIndex: 'withdrawalFee',
      render: (val) => `￥ ${(Number(val) || 0).toFixed(2)}`,
    },
    {
      title: '实收提现手续费',
      align: 'right',
      dataIndex: 'withdrawalHandlingFee',
      render: (val) => `￥0`,
    },
    {
      title: '状态',
      align: 'right',
      fixed: 'right',
      dataIndex: 'status',
      render: (val) => WITHDRAW_STATUS[val],
    },
  ];

  // 统计数据
  const fetchWithdrawCashTotal = (payload = {}) => {
    const {
      withdrawalDateEnd = moment().format('YYYY-MM-DD'),
      withdrawalDateStart = moment().subtract(1, 'month').format('YYYY-MM-DD'),
    } = payload;
    setSearchTime([withdrawalDateStart, withdrawalDateEnd]);
    dispatch({
      type: 'withdrawDetail/fetchWithdrawCashTotal',
      payload,
    });
  };

  // 导出excel按钮
  const excelBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'withdrawDetail/fetchGetCashExcel',
      data: get(),
      exportProps: { header: getColumns.slice(0, -1) },
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        content={
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Tag color="orange">
              {searchTime[0]} ~ {searchTime[1]}
            </Tag>
            合计提现金额：
            {toatlLoading ? <Spin></Spin> : `￥${totalData.allWithdrawalFeeSum.toFixed(2)}`}
            &nbsp;&nbsp; 成功提现金额：
            {toatlLoading ? <Spin></Spin> : `￥${totalData.withdrawalFeeSum.toFixed(2)}`}
            &nbsp;&nbsp; 成功提现手续费：
            {toatlLoading ? <Spin></Spin> : `￥${totalData.withdrawalHandlingFeeSum.toFixed(2)}`}
          </div>
        }
        cRef={childRef}
        noCard={false}
        btnExtra={excelBtn}
        searchCallback={fetchWithdrawCashTotal}
        loading={loading.effects['withdrawDetail/fetchGetCashList']}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.directWithdrawalId}`}
        dispatchType="withdrawDetail/fetchGetCashList"
        {...withdrawDetail.listCash}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ withdrawDetail, loading }) => ({
  withdrawDetail,
  loading,
}))(MerchantListCash);
