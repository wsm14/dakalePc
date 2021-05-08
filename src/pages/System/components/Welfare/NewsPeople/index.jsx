import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import NewsConfigDeatil from './NewsConfigDetail';
import { WELFARE_STATUS } from '@/common/constant';
import moment from 'moment';

const NewsPeople = (props) => {
  const { welfareConfigList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 获取详情
  const fetchGetDetail = (val, type) => {
    const activityTime = [moment(val.activityStartDay), moment(val.activityEndDay)];
    setVisible({ show: true, type, detail: { ...val, activityTime } });
  };

  // 删除
  const fetchDetailDel = (configNewcomerOrdersId) => {
    dispatch({
      type: 'welfareConfigList/fetchWelfareDeletes',
      payload: {
        configNewcomerOrdersId,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '福利名称',
      dataIndex: 'name',
    },
    {
      title: '福利限制',
      dataIndex: 'verificationDay',
      render: (val, record) =>
        val ? `${val}天内核销 ${record.orderNum ? record.orderNum : 0}单` : '--',
    },
    {
      title: '成立条件',
      dataIndex: 'isBeanPay',
      render: (val, record) =>
        val == 1 && record.orderFee > 0
          ? `卡豆支付,满${record.orderFee}元`
          : val == 1 && (record.orderFee==0 ||record.orderFee=='')
          ? '卡豆支付'
          : `满${record.orderFee}元`,
    },
    {
      title: '活动时间',
      dataIndex: 'activityStartDay',
      render: (val, record) =>
        val ? `${val}-${record.activityEndDay}`:'--'
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'name',
    // },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val) => WELFARE_STATUS[val],
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'configNewcomerOrdersId',
      render: (val, record) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                auth: true,
                click: () => fetchGetDetail(record, 'edit'),
              },
              {
                type: 'del',
                auth: true,
                click: () => fetchDetailDel(val),
                visible: record.status == 0 || record.status == 2,
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          title: '新人下单配置',
          bordered: false,
          extra: (
            <Button type="primary" onClick={() => setVisible({ type: 'add', show: true })}>
              新增
            </Button>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configNewcomerOrdersId}`}
        dispatchType="welfareConfigList/fetchWelfareConfigLists"
        pagination={false}
        {...welfareConfigList}
      ></TableDataBlock>
      <NewsConfigDeatil
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></NewsConfigDeatil>
    </>
  );
};

export default connect(({ welfareConfigList, loading }) => ({
  welfareConfigList,
  loading: loading.effects['welfareConfigList/fetchWelfareConfigLists'],
}))(NewsPeople);
