import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import LevelDetail from './components/Level/Detail/LevelDetail';

const ExpertLevel = (props) => {
  const { list, loading } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // table 表头
  const getColumns = [
    {
      title: '等级形象',
      dataIndex: 'activity',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '等级铭牌',
      dataIndex: 'currentLevel',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '等级值',
      dataIndex: 'level',
    },
    {
      title: '等级名称',
      dataIndex: 'levelName',
    },
    {
      title: '等级任务',
      type: 'handle',
      dataIndex: 'target',
      render: (val, row) => [
        {
          type: 'set',
          auth: 'targetSet',
          click: () => setVisible({ show: true, type: 'eye', key: 'target', row }),
        },
      ],
    },
    {
      type: 'handle',
      dataIndex: 'rights',
      render: (val, row) => [
        {
          type: 'set',
          auth: 'rightsSet',
          click: () => setVisible({ show: true, type: 'eye', key: 'rights', row }),
        },
      ],
    },
  ];

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.levelConfigId}`}
        dispatchType="expertLevel/fetchGetList"
        list={list}
      ></TableDataBlock>
      <LevelDetail
        cRef={childRef}
        visible={visible}
        onCancel={() => setVisible(false)}
      ></LevelDetail>
    </>
  );
};

export default connect(({ expertLevel, loading }) => ({
  list: expertLevel.list,
  loading: loading.effects['expertLevel/fetchGetList'],
}))(ExpertLevel);
