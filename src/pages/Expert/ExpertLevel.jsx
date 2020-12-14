import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
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
      title: `等级任务`,
      align: 'right',
      dataIndex: 'target',
      render: (val, row) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'set',
                click: () => setVisible({ show: true, type: 'eye', key: 'target', row }),
              },
              // {
              //   type: 'eye',
              //   click: () => setVisible({ show: true, type: 'eye', key: 'target', row }),
              // },
            ]}
          />
        );
      },
    },
    {
      title: '等级权益',
      align: 'right',
      dataIndex: 'rights',
      render: (val, row) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'set',
                click: () => setVisible({ show: true, type: 'eye', key: 'rights', row }),
              },
              // {
              //   type: 'eye',
              //   click: () => setVisible({ show: true, type: 'eye', key: 'rights', row }),
              // },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <DataTableBlock
        keepName="等级设置"
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.levelConfigId}`}
        dispatchType="expertLevel/fetchGetList"
        list={list}
      ></DataTableBlock>
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
