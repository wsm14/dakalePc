import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import LevelTable from './LevelTable';
import LevelJSONSet from './LevelJSONSet';
import LevelFormSet from '../Form/LevelFormSet';

const LevelDetail = (props) => {
  const { visible, dispatch, onCancel, cRef } = props;

  const { type = 'set', key = 'target', row = '' } = visible;
  // 表格值
  const [listData, setListData] = useState([]);
  // 打开选择库
  const [selectData, setSelectData] = useState({ show: false });
  // 修改数值
  const [editData, setEditData] = useState({ show: false, detail: {} });

  // 保存
  const fetchExpertLevelSet = (newList, setType = 'add') => {
    dispatch({
      type: 'expertLevel/fetchExpertLevelSet',
      payload: { ...row, [key]: newList },
      callback: () => {
        cRef.current.fetchGetData();
        setListData(newList);
        if (setType == 'edit') {
          setEditData({ show: false, detail: {} });
        }
      },
    });
  };

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
  }[key];

  // 监听打开 修改表格值展示
  useEffect(() => {
    if (visible) setListData(row[propItem.dataKey]);
  }, [visible]);

  return (
    <>
      <Modal
        title={propItem.title}
        width={800}
        destroyOnClose
        footer={null}
        visible={visible}
        onCancel={() => onCancel('')}
      >
        <LevelTable
          keyRow={key}
          list={listData}
          setEditData={setEditData}
          setSelectData={setSelectData}
          fetchExpertLevelSet={fetchExpertLevelSet}
        ></LevelTable>
      </Modal>
      <LevelJSONSet
        {...selectData}
        showlistData={listData}
        keyRow={key}
        onCancel={() => setSelectData({ show: false, list: [] })}
        fetchExpertLevelSet={fetchExpertLevelSet}
      ></LevelJSONSet>
      <LevelFormSet
        visible={editData}
        showlistData={listData}
        keyRow={key}
        onCancel={() => setEditData({ show: false, detail: {} })}
        fetchExpertLevelSet={fetchExpertLevelSet}
      ></LevelFormSet>
    </>
  );
};

export default connect()(LevelDetail);
