import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import PeasShareSet from './components/PeasShare/PeasShareSet';

const SysPeasShare = (props) => {
  const { sysPeasShare, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // table 表头
  const getColumns = [
    {
      title: '观看时长',
      dataIndex: 'watchTime',
      render: (val) => `${val}秒`,
    },
    {
      title: '最低卡豆数',
      align: 'center',
      dataIndex: 'limitBean',
    },
    {
      type: 'handle',
      dataIndex: 'configMomentIdString',
      render: (val, record) => [
        {
          type: 'edit',
          click: () => handlePeasShareSet('edit', record),
        },
        {
          type: 'del',
          click: () => fetchPeasShareDel(val),
        },
      ],
    },
  ];

  // 删除
  const fetchPeasShareDel = (val) => {
    dispatch({
      type: 'sysPeasShare/fetchPeasShareEdit',
      payload: { configMomentId: val, deleteFlag: 0 },
      callback: childRef.current.fetchGetData,
    });
  };

  // 新增 修改
  const handlePeasShareSet = (type, initialValues) => {
    setVisible({
      type,
      initialValues,
      show: true,
    });
  };

  // 表格额外按钮
  const extraBtn = [{ auth: 'save', onClick: () => handlePeasShareSet('add') }];

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        btnExtra={extraBtn}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configMomentIdString}`}
        dispatchType="sysPeasShare/fetchGetList"
        {...sysPeasShare}
      ></TableDataBlock>
      <PeasShareSet
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></PeasShareSet>
    </>
  );
};

export default connect(({ sysPeasShare, loading }) => ({
  sysPeasShare,
  loading: loading.models.sysPeasShare,
}))(SysPeasShare);
