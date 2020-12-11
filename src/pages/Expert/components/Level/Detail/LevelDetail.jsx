import React from 'react';
import { Modal } from 'antd';
import LevelTable from './LevelTable';

const LevelDetail = (props) => {
  const { visible, onCancel } = props;

  const { type = 'target', row = '' } = visible;

  // table
  const propItem = {
    target: {
      title: `等级任务 - ${row.levelName}`,
      dataKey: 'target',
    },
    rights: {
      title: `等级权益 - ${row.levelName}`,
      dataKey: 'rights',
    },
  }[type];

  return (
    <Modal
      title={propItem.title}
      width={800}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => onCancel('')}
    >
      <LevelTable type={type} list={row[propItem.dataKey]}></LevelTable>
    </Modal>
  );
};

export default LevelDetail;
