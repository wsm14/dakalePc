import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { CHECKIN_TYPE } from '@/common/constant';
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
      dataIndex: 'markDesc',
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'markType',
      render: (val) => CHECKIN_TYPE.filter((item) => item.value === val)[0].name,
    },
    {
      title: '打卡时间段',
      align: 'center',
      dataIndex: 'markBeginTime',
      render: (val, record) =>
        record.markSubType === 'customize'
          ? '--'
          : { health: '--', habit: `${val} ~ ${record.markEndTime}` }[record.markType],
    },
    {
      title: '寄语',
      align: 'center',
      dataIndex: 'remark',
      render: (val, record) => (record.markSubType === 'customize' ? '--' : val),
    },
    {
      title: '操作',
      dataIndex: 'markConfigIdString',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '图片素材',
              click: () => setVisible({ type: 'image', record }),
            },
            {
              type: 'own',
              title: '文案素材',
              click: () => setVisible({ type: 'words', record }),
            },
            {
              type: 'edit',
              visible: record.markSubType !== 'customize',
              click: () => handlePeasShareSet(record),
            },
          ]}
        />
      ),
    },
  ];

  // 新增 修改
  const handlePeasShareSet = (rowData) => {
    dispatch({
      type: 'drawerForm/show',
      payload: checkInSet({
        dispatch,
        childRef,
        rowData,
      }),
    });
  };

  useEffect(() => {
    dispatch({
      type: 'sysCheckIn/clearDetail',
    });
  }, [visible]);

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.markConfigIdString}`}
        dispatchType="sysCheckIn/fetchGetList"
        {...list}
      ></DataTableBlock>
      <CheckInDetailList visible={visible} setVisible={setVisible} />
    </>
  );
};

export default connect(({ sysCheckIn, loading }) => ({
  list: sysCheckIn.list,
  loading: loading.models.sysCheckIn,
}))(SysCheckIn);
