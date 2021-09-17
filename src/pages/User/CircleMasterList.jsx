import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { MASTER_TYPE } from '@/common/constant';
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
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '用户/店铺名',
      name: 'name',
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
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
      dataIndex: 'userType',
      render: (val) => MASTER_TYPE[val],
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
      type: 'handle',
      dataIndex: 'id',
      render: (val, record) => [
        {
          type: 'income',
          click: () => showProps('income', record),
        },
      ],
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
      <TableDataBlock
        keepData
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.id}`}
        params={{ userType: 'user' }}
        dispatchType="circleMaster/fetchGetList"
        {...masterList}
      ></TableDataBlock>
      <MasterDetailList visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ circleMaster, loading }) => ({
  masterList: circleMaster.masterList,
  loading: loading.effects['circleMaster/fetchGetList'],
}))(CircleMasterList);
