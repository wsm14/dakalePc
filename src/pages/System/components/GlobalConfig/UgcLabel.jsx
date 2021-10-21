import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import UgcLabelSet from './Form/UgcLabelSet';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import styles from '../../../System/index.less';

const UgcLabel = (props) => {
  const { dispatch, loading, UgcLabelList } = props;
  const [visible, setVisible] = useState(false);

  const childRef = useRef();
  const getColumns = [
    {
      dataIndex: 'img',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginLeft: 5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Ellipsis length={20} tooltip className={styles.EllFont}>
                {row?.name}
              </Ellipsis>
              <Tag color="orange">
                {row?.participateNum}人参与，{row?.onlookersNum}人围观
              </Tag>
            </div>
            <div style={{ marginTop: 5 }} className={styles.specFont}>
              {row?.introduce}
            </div>
          </div>
        </div>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'configMomentTagId',
      render: (val, row) => [
        {
          type: 'edit',
          click: () => handleUpdateSet('edit', val),
          auth: true,
        },
        {
          type: 'down',
          title: '显示',
          visible: row.deleteFlag === '0',
          click: () => handleDown(val, 1),
        },
        {
          type: 'down',
          title: '隐藏',
          visible: row.deleteFlag === '1',
          click: () => handleDown(val, 0),
        },
      ],
    },
  ];

  //显示、隐藏
  const handleDown = (val, deleteFlag) => {
    dispatch({
      type: 'globalConfig/fetchUpdateMomentTag',
      payload: { configMomentTagId: val, deleteFlag },
      callback: childRef.current.fetchGetData,
    });
  };

  //编辑、新增
  const handleUpdateSet = (type, configMomentTagId) => {
    if (type === 'edit') {
      dispatch({
        type: 'globalConfig/fetchGetMomentTagById',
        payload: { configMomentTagId },
        callback: (detail) => {
          setVisible({
            show: true,
            type,
            detail,
          });
        },
      });
    } else {
      setVisible({
        show: true,
        type,
      });
    }
  };

  const cardBtnList = [
    {
      auth: 'save',
      onClick: () => handleUpdateSet('add'),
    },
  ];
  return (
    <>
      <TableDataBlock
        cardProps={{
          title: '视频标签配置',
          extra: <ExtraButton list={cardBtnList}></ExtraButton>,
        }}
        showHeader={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configMomentTagId}`}
        params={{ type: 'UGC' }}
        dispatchType="globalConfig/fetchListMomentTag"
        {...UgcLabelList}
      ></TableDataBlock>
      <UgcLabelSet
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
      ></UgcLabelSet>
    </>
  );
};

export default connect(({ loading, globalConfig }) => ({
  UgcLabelList: globalConfig.UgcLabelList,
  loading: loading.models.globalConfig,
}))(UgcLabel);
