import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import { ACCOUNT_STATUS, BUSINESS_STATUS } from '@/common/constant';
import MasterTotalInfo from './components/Master/MasterTotalInfo';
import MasterDetail from './components/Master/MasterDetail';

const CircleMasterList = (props) => {
  const { circleMaster, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '身份',
      name: 'userMobile1s',
      type: 'select',
      select: { list: ACCOUNT_STATUS },
    },
    {
      label: '商户名',
      name: 'userMosbile1s',
    },
    {
      label: '手机号',
      name: 'userMobile1',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '名称',
      dataIndex: 'userId',
      fixed: 'left',
    },
    {
      title: '身份',
      align: 'center',
      fixed: 'left',
      dataIndex: 'phoneNumber',
      render: (val) => BUSINESS_STATUS[val],
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'orderCount',
    },
    {
      title: '家人数',
      align: 'right',
      dataIndex: 'aa',
      render: (val, record) =>
        val > 0 ? <a onClick={() => setVisible({ type: 'family', record })}>{val}</a> : 0,
    },
    {
      title: '家店数',
      align: 'right',
      dataIndex: 'bb',
      render: (val, record) =>
        val > 0 ? <a onClick={() => setVisible({ type: 'shop', record })}>{val}</a> : 0,
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'addTimeStamp',
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '收益明细',
              click: () => setVisible({ type: 'income', record }),
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'circleMaster/clearDetail',
    });
  }, [visible]);

  return (
    <>
      <MasterTotalInfo />
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}`}
        dispatchType="circleMaster/fetchGetList"
        {...circleMaster.master}
      ></DataTableBlock>
      <MasterDetail visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ circleMaster, loading }) => ({
  circleMaster,
  loading: loading.effects['circleMaster/fetchGetList'],
}))(CircleMasterList);
