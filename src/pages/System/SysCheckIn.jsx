import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import checkInSet from './components/CheckIn/CheckInSet';
import CheckInDetailList from './components/CheckIn/CheckInDetailList';

const SysCheckIn = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();

  const [visible, setVisible] = useState('');

  // table 表头
  const getColumns = [
    {
      title: '打卡',
      dataIndex: 'userId',
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'phoneasdNumber',
    },
    {
      title: '打卡时间段',
      align: 'center',
      dataIndex: 'phonasdeNumber',
    },
    {
      title: '寄语',
      align: 'center',
      dataIndex: 'phoneasdaNumber',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '图片素材',
              click: () => setVisible({ type: 'img', record }),
            },
            {
              type: 'own',
              title: '文案素材',
              click: () => setVisible({ type: 'text', record }),
            },
            {
              type: 'edit',
              click: () => handlePeasShareSet(record),
            },
          ]}
        />
      ),
    },
  ];

  // 新增 修改
  const handlePeasShareSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: checkInSet({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.userId}`}
        dispatchType="sysCheckIn/fetchGetList"
        {...list}
        list={[{ name: 1 }]}
      ></DataTableBlock>
      <CheckInDetailList visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ sysCheckIn, loading }) => ({
  list: sysCheckIn.list,
  loading: loading.models.sysCheckIn,
}))(SysCheckIn);
