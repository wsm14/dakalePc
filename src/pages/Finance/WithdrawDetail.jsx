import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import ExcelButton from '@/components/ExcelButton';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import WithdrawRemark from './components/Withdraw/WithdrawRemark';

const WithdrawDetail = (props) => {
  const { withdrawDetail, loading, dispatch } = props;

  const { totalData } = withdrawDetail;

  const toatlLoading = loading.effects['withdrawDetail/fetchWithdrawTotal'];

  const childRef = useRef();
  // 修改弹窗
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchWithdrawTotal();
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
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'merchantBeanWithdrawalId',
      render: (val, row, index) => index + 1,
    },
    {
      title: '提现日期',
      fixed: 'left',
      dataIndex: 'withdrawalDate',
    },
    {
      title: '提现单号',
      dataIndex: 'withdrawalSn',
    },
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
    },
    {
      title: '店铺账号',
      dataIndex: 'merchantAccount',
    },
    {
      title: '提现账户',
      align: 'center',
      dataIndex: 'withdrawalAccount',
      render: (val, row) => `${row.withdrawalChannelName}\n${val}`,
    },
    {
      title: '提现卡豆数',
      align: 'right',
      dataIndex: 'withdrawalBeanAmount',
    },
    {
      title: '提现金额',
      align: 'right',
      dataIndex: 'withdrawalFee',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '实收提现手续费',
      align: 'right',
      dataIndex: 'withdrawalHandlingFee',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '备注',
      fixed: 'right',
      align: 'right',
      dataIndex: 'remark',
      render: (val, record) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                click: () => setVisible({ shwo: true, detail: record }),
              },
            ]}
          />
        );
      },
    },
  ];

  // 统计数据
  const fetchWithdrawTotal = (payload) => {
    dispatch({
      type: 'withdrawDetail/fetchWithdrawTotal',
      payload,
    });
  };

  return (
    <>
      <DataTableBlock
        title={() => (
          <div style={{ textAlign: 'right', marginTop: -16 }}>
            合计提现金额：{toatlLoading ? <Spin></Spin> : `￥${totalData.withdrawalFeeSum}`}{' '}
            &nbsp;&nbsp; 合计提现手续费：
            {toatlLoading ? <Spin></Spin> : `￥${totalData.withdrawalHandlingFeeSum}`}
          </div>
        )}
        btnExtra={({ get }) => (
          <ExcelButton
            dispatchType={'withdrawDetail/fetchGetExcel'}
            dispatchData={get()}
            exportProps={{ header: getColumns.slice(0, -1) }}
          ></ExcelButton>
        )}
        searchCallback={fetchWithdrawTotal}
        cRef={childRef}
        loading={loading.effects['withdrawDetail/fetchGetList']}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.merchantBeanWithdrawalId}`}
        dispatchType="withdrawDetail/fetchGetList"
        {...withdrawDetail.list}
      ></DataTableBlock>
      <WithdrawRemark
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></WithdrawRemark>
    </>
  );
};

export default connect(({ withdrawDetail, loading }) => ({
  withdrawDetail,
  loading,
}))(WithdrawDetail);
