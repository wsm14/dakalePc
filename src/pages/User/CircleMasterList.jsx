import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { MASTER_TYPE } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import MasterTotalInfo from './components/Master/MasterTotalInfo';
import MasterDetailList from './components/Master/MasterDetailList';

const CircleMasterList = (props) => {
  const { masterList, loading, dispatch } = props;

  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '身份',
      name: 'userType',
      type: 'select',
      allItem: false,
      select: { list: MASTER_TYPE },
    },
    {
      label: '商户名',
      name: 'name',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '名称',
      fixed: 'left',
      dataIndex: 'name',
    },
    {
      title: '身份',
      align: 'center',
      fixed: 'left',
      dataIndex: 'userType',
      render: (val) => (val === 'user' ? '用户' : '商户'),
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '家人数',
      align: 'right',
      dataIndex: 'totalFamilyUser',
      render: (val, record) =>
        val > 0 ? <a onClick={() => setVisible({ type: 'family', record })}>{val}</a> : 0,
    },
    {
      title: '家店数',
      align: 'right',
      dataIndex: 'totalFamilyMerchant',
      render: (val, record) =>
        val > 0 ? <a onClick={() => setVisible({ type: 'shop', record })}>{val}</a> : 0,
    },
    {
      title: '累计收益（卡豆）',
      align: 'right',
      dataIndex: 'totalAdd',
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
      <DataTableBlock
        keepName="家主列表"
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.id}`}
        params={{ userType: 'user' }}
        pParams={{ searchData: { userType: 'user' } }}
        dispatchType="circleMaster/fetchGetList"
        {...masterList}
      >
        <MasterTotalInfo />
      </DataTableBlock>
      <MasterDetailList visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ circleMaster, loading }) => ({
  masterList: circleMaster.masterList,
  loading: loading.effects['circleMaster/fetchGetList'],
}))(CircleMasterList);
