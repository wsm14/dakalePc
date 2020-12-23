import React, { useRef, useState, useEffect } from 'react';
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
      fixed: 'left',
      dataIndex: 'subIdentifyValue',
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'identify',
      render: (val) =>
        ({ care: '关爱打卡', custom: '自定义打卡', health: '健康打卡', habit: `习惯打卡` }[val]),
    },
    {
      title: '打卡时间段',
      align: 'center',
      dataIndex: 'beginMark',
      render: (val, record) =>
        ({ care: '--', custom: '--', health: '--', habit: `${val} ~ ${record.endMark}` }[
          record.identify
        ]),
    },
    {
      title: '寄语',
      align: 'center',
      dataIndex: 'letter',
      render: (val, record) =>
        ({ care: '--', custom: '--', health: '--', habit: val }[record.identify]),
    },
    {
      title: '操作',
      dataIndex: 'markConfigIdString',
      align: 'right',
      fixed: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              visible: record.identify === 'habit',
              click: () => handlePeasShareSet(record),
            },
            {
              type: 'own',
              title: '分享图片',
              click: () => setVisible({ type: 'image', styleType: 'share', record }),
            },
            {
              type: 'own',
              title: '打卡图片',
              click: () => setVisible({ type: 'image', styleType: 'mark', record }),
            },
            {
              type: 'own',
              title: '分享文案',
              click: () => setVisible({ type: 'text', styleType: 'share', record }),
            },
            {
              type: 'own',
              title: '打卡文案',
              click: () => setVisible({ type: 'text', styleType: 'mark', record }),
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
        rowKey={(record) => `${record.subIdentify}`}
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
