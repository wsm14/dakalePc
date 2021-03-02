import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { MASTER_TYPE } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
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
      select: MASTER_TYPE,
    },
    {
      label: '用户/店铺名',
      name: 'name',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valueskey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // 打开详情表格
  const showProps = (type, record) => setVisible({ type: type, record });

  // table 表头
  const getColumns = [
    {
      title: '用户/店铺名',
      fixed: 'left',
      dataIndex: 'name',
      render: (val) => val || '--',
    },
    {
      title: '身份',
      align: 'center',
      fixed: 'left',
      dataIndex: 'parentUserType',
      render: (val) => (val === 'user' ? '用户' : '店铺'),
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
      render: (val) => val || '--',
    },
    {
      title: '家人数',
      align: 'right',
      dataIndex: 'totalFamilyUser',
      render: (val, record) =>
        val > 0 ? <a onClick={() => showProps('family', record)}>{val}</a> : 0,
    },
    {
      title: '家店数',
      align: 'right',
      dataIndex: 'totalFamilyMerchant',
      render: (val, record) =>
        val > 0 ? <a onClick={() => showProps('shop', record)}>{val}</a> : 0,
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
              type: 'income',
              click: () => showProps('income', record),
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
      <TableDataBlock
        keepData
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.id}`}
        params={{ userType: 'user' }}
        dispatchType="circleMaster/fetchGetList"
        {...masterList}
      >
        <MasterTotalInfo />
      </TableDataBlock>
      <MasterDetailList visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ circleMaster, loading }) => ({
  masterList: circleMaster.masterList,
  loading: loading.effects['circleMaster/fetchGetList'],
}))(CircleMasterList);
