import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import CheckInSet from './components/CheckIn/CheckInSet';
import CheckInDetailList from './components/CheckIn/CheckInDetailList';

const SysCheckIn = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');
  const [visibleSet, setVisibleSet] = useState('');

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
              type: 'shareImg',
              click: () => setVisible({ type: 'image', styleType: 'share', record }),
            },
            {
              type: 'markImg',
              click: () => setVisible({ type: 'image', styleType: 'mark', record }),
            },
            {
              type: 'shareText',
              click: () => setVisible({ type: 'text', styleType: 'share', record }),
            },
            {
              type: 'markText',
              click: () => setVisible({ type: 'text', styleType: 'mark', record }),
            },
          ]}
        />
      ),
    },
  ];

  // 新增 修改
  const handlePeasShareSet = (rowData) => {
    setVisibleSet({
      show: true,
      initialValues: rowData,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'sysCheckIn/clearDetail',
    });
  }, [visible]);

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.subIdentify}`}
        dispatchType="sysCheckIn/fetchGetList"
        {...list}
      ></TableDataBlock>
      <CheckInDetailList visible={visible} setVisible={setVisible} />
      <CheckInSet
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
      ></CheckInSet>
    </>
  );
};

export default connect(({ sysCheckIn, loading }) => ({
  list: sysCheckIn.list,
  loading: loading.models.sysCheckIn,
}))(SysCheckIn);
