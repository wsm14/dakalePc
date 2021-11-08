import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Spin, Tag } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { checkCityName } from '@/utils/utils';
import { WITHDRAW_STATUS } from '@/common/constant';
import TableDataBlock, { HandleSetTable } from '@/components/TableDataBlock';
import WithdrawRemark from './WithdrawRemark';

const ExpertUserList = (props) => {
  const { withdrawDetail, loading, dispatch } = props;

  const { expretTotalData } = withdrawDetail;

  const toatlLoading = loading.effects['withdrawDetail/fetchWithdrawExpertTotal'];

  const childRef = useRef();

  const [visible, setVisible] = useState(false); // 修改弹窗
  const [searchTime, setSearchTime] = useState([
    moment().subtract(1, 'month').format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ]); // 显示当前数据的时间标记

  useEffect(() => {
    fetchWithdrawExpertTotal();
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
      label: '提现状态',
      name: 'status',
      type: 'select',
      select: WITHDRAW_STATUS,
    },
    {
      label: '哒人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '提现单号',
      name: 'withdrawalSn',
    },
    {
      label: '哒人注册地',
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
      title: '提现单号',
      fixed: 'left',
      dataIndex: 'withdrawalSn',
    },
    {
      title: '哒人昵称',
      width: 200,
      dataIndex: 'userName',
      ellipsis: { lines: 2 },
    },
    {
      title: '哒人手机号',
      dataIndex: 'mobile',
    },
    {
      title: '哒人级别',
      dataIndex: 'levelName',
    },
    {
      title: '注册地',
      dataIndex: 'districtCode',
      render: (val, row) => checkCityName(val || row.cityCode || row.provinceCode),
    },
    {
      title: '提现账户',
      align: 'center',
      dataIndex: 'withdrawalAccount',
      render: (val, row) => `${row.withdrawalChannelName}\n${val}`,
    },
    {
      title: '提现现金金额',
      align: 'right',
      dataIndex: 'withdrawalBeanAmount',
      render: (value) => value / 100,
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
      fixed: 'right',
      dataIndex: 'status',
      render: (val) => WITHDRAW_STATUS[val],
    },
    {
      title: '备注',
      fixed: 'right',
      align: 'right',
      width: 200,
      dataIndex: 'remark',
      render: (val, record) => {
        return (
          <>
            {val}
            <HandleSetTable
              formItems={[
                {
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
  const fetchWithdrawExpertTotal = (payload = {}) => {
    const {
      withdrawalDateEnd = moment().format('YYYY-MM-DD'),
      withdrawalDateStart = moment().subtract(1, 'month').format('YYYY-MM-DD'),
    } = payload;
    setSearchTime([withdrawalDateStart, withdrawalDateEnd]);
    dispatch({
      type: 'withdrawDetail/fetchWithdrawExpertTotal',
      payload,
    });
  };

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
            {toatlLoading ? <Spin></Spin> : `￥${expretTotalData.allWithdrawalFeeSum.toFixed(2)}`}
            &nbsp;&nbsp; 成功提现金额：
            {toatlLoading ? <Spin></Spin> : `￥${expretTotalData.withdrawalFeeSum.toFixed(2)}`}
            &nbsp;&nbsp; 成功提现手续费：
            {toatlLoading ? (
              <Spin></Spin>
            ) : (
              `￥${expretTotalData.withdrawalHandlingFeeSum.toFixed(2)}`
            )}
          </div>
        }
        cRef={childRef}
        noCard={false}
        searchCallback={fetchWithdrawExpertTotal}
        loading={loading.effects['withdrawDetail/fetchWithdrawExpertList']}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.merchantBeanWithdrawalId}`}
        dispatchType="withdrawDetail/fetchWithdrawExpertList"
        {...withdrawDetail.expertlist}
      ></TableDataBlock>
      <WithdrawRemark
        type={'expert'}
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
}))(ExpertUserList);
