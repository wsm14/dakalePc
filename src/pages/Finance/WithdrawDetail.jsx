import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Spin, Tag } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { WITHDRAW_STATUS } from '@/common/constant';
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
  // 显示当前数据的时间标记
  const [searchTime, setSearchTime] = useState([
    moment().subtract(1, 'month').format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ]);

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
      title: '流水单号',
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
      title: '状态',
      align: 'right',
      dataIndex: 'status',
      render: (val) => WITHDRAW_STATUS[val],
    },
    {
      title: '备注',
      fixed: 'right',
      align: 'right',
      width: 300,
      dataIndex: 'remark',
      render: (val, record) => {
        return (
          <>
            {val}
            <HandleSetTable
              formItems={[
                {
                  type: 'own',
                  auth: 'edit',
                  title: <FormOutlined />,
                  click: () => setVisible({ shwo: true, detail: record }),
                },
              ]}
            />
          </>
        );
      },
    },
  ];

  // 统计数据
  const fetchWithdrawTotal = (payload = {}) => {
    const {
      withdrawalDateEnd = moment().subtract(1, 'month').format('YYYY-MM-DD'),
      withdrawalDateStart = moment().format('YYYY-MM-DD'),
    } = payload;
    setSearchTime([withdrawalDateStart, withdrawalDateEnd]);
    dispatch({
      type: 'withdrawDetail/fetchWithdrawTotal',
      payload,
    });
  };

  return (
    <>
      <DataTableBlock
        keepName="提现明细"
        title={() => (
          <div style={{ textAlign: 'right', marginTop: -16 }}>
            <Tag color="orange">
              {searchTime[0]} ~ {searchTime[1]}
            </Tag>
            合计提现金额：
            {toatlLoading ? <Spin></Spin> : `￥${totalData.allWithdrawalFeeSum || 0}`} &nbsp;&nbsp;
            成功提现金额：
            {toatlLoading ? <Spin></Spin> : `￥${totalData.withdrawalFeeSum}`} &nbsp;&nbsp;
            成功提现手续费：
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
