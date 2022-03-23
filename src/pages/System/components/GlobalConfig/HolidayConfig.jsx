import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import { FESTIVAL_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import HolidayConfigSet from './Form/HolidayConfigSet';
import { handleZipDown } from '../MaterialConfig/downZip';

const HolidayConfig = (props) => {
  const { dispatch, loading, festivalConfigList } = props;
  const [visible, setVisible] = useState(false);

  const childRef = useRef();
  const getColumns = [
    {
      title: '节日名称',
      dataIndex: 'name',
    },

    {
      title: '状态',
      dataIndex: 'status',
      render: (val) => FESTIVAL_STATUS[val],
    },
    {
      title: '展示时间',
      dataIndex: 'beginDay',
      render: (val, row) => `${val}--${row.endDay}`,
    },
    {
      title: '更新人',
      dataIndex: 'updater',
    },
    {
      title: '操作',
      type: 'handle',
      dataIndex: 'configFestivalId',
      render: (val, row) => [
        {
          type: 'down',
          title: '下架',
          visible: row.status !== '2',
          click: () => handleDown(val),
        },
        {
          type: 'edit',
          click: () => handleUpdateSet('edit', val),
          visible: row.status === '2',
        },
        {
          type: 'info',
          click: () => handleUpdateSet('info', val),
          visible: row.status !== '2',
        },
      ],
    },
  ];

  //编辑、详情
  const handleUpdateSet = (type, configFestivalId) => {
    if (['edit', 'info'].includes(type)) {
      dispatch({
        type: 'globalConfig/fetchFestivalConfigDetail',
        payload: { configFestivalId },
        callback: (detail) => {
          setVisible({
            show: true,
            type,
            initialValues: detail,
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

  const handleDown = (configFestivalId) => {
    dispatch({
      type: 'globalConfig/fetchFestivalConfigDown',
      payload: { configFestivalId },
      callback: childRef.current.fetchGetData,
    });
  };

  const cardBtnList = [
    {
      auth: 'save',
      onClick: () => handleUpdateSet('save'),
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          title: '节日配置',
          extra: <ExtraButton list={cardBtnList}></ExtraButton>,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configFestivalId}`}
        dispatchType="globalConfig/fetchListFestivalConfig"
        {...festivalConfigList}
      ></TableDataBlock>
      {/* 新增 */}
      <HolidayConfigSet
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
      ></HolidayConfigSet>
    </>
  );
};

export default connect(({ loading, globalConfig }) => ({
  festivalConfigList: globalConfig.festivalConfigList,
  loading: loading.models.globalConfig,
}))(HolidayConfig);
