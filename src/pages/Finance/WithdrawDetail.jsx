import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button, Spin } from 'antd';
import exportExcel from '@/utils/exportExcel';
import AuthConsumer from '@/layouts/AuthConsumer';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import SubsidyDrawer from './components/subsidy/SubsidyDrawer';

const WithdrawDetail = (props) => {
  const { withdrawDetail, loading, dispatch } = props;

  const { totalData } = withdrawDetail;

  const toatlLoading = loading.effects['withdrawDetail/fetchWithdrawTotal'];

  const childRef = useRef();
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
                click: () => fetchShareDetail(val, record.contentType),
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

  // 导出excel 数据
  const fetchGetExcel = (payload) => {
    const header = getColumns.slice(1);
    dispatch({
      type: 'withdrawDetail/fetchGetExcel',
      payload,
      callback: (data) => exportExcel({ header, data }),
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
          <AuthConsumer auth="exportList">
            <Button
              className="dkl_green_btn"
              loading={loading.effects['withdrawDetail/fetchGetExcel']}
              onClick={() => fetchGetExcel(get())}
            >
              导出
            </Button>
          </AuthConsumer>
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
      <SubsidyDrawer visible={visible} setVisible={setVisible}></SubsidyDrawer>
    </>
  );
};

export default connect(({ withdrawDetail, loading }) => ({
  withdrawDetail,
  loading,
}))(WithdrawDetail);
