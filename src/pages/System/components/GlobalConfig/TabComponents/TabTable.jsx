import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import TabDrawerSet from './TabDrawerSet';

const TabTable = (props) => {
  const { dispatch, loading, IndexTabModalList, tabKey, version, fetchTable } = props;
  const [visible, setVisible] = useState(false);

  const childRef = useRef();

  useEffect(() => {
    fetchTable && fetchTable(childRef);
  }, []);

  const getColumns = [
    {
      title: '城市',
      align: 'center',
      dataIndex: 'area',
      render: (val, row) => (val === 'all' ? '通用' : getCityName(row?.cityCode)),
    },
    {
      title: '展示标签',
      align: 'center',
      dataIndex: 'defaultTagNames',
      render: (val, row) => {
        const { defaultTagNames: dtag, tagNames: tag = '' } = row;
        const nameVlaue = `${dtag}${tag ? `,${tag}` : ''}`;
        return nameVlaue.split(',').map((item) => (
          <Tag color="orange" key={item}>
            {item}
          </Tag>
        ));
      },
    },
    {
      type: 'handle',
      dataIndex: 'configIndexTabId',
      render: (val, row) => {
        return [
          {
            type: 'tabEdit',
            title: '编辑',
            click: () => handleUpdateSet('edit', val),
            auth: true,
          },
          {
            type: 'del',
            title: '删除',
            click: () => handleDelCity(val),
            visible: row.area !== 'all',
            auth: true,
          },
        ];
      },
    },
  ];

  // 删除城市
  const handleDelCity = (configIndexTabId) => {
    dispatch({
      type: 'globalConfig/fetchIndexTabEdit',
      payload: {
        configIndexTabId,
        flag: 'delete',
      },
      callback: childRef?.current?.fetchGetData,
    });
  };

  const handleUpdateSet = (type, configIndexTabId) => {
    dispatch({
      type: 'globalConfig/fetchGetIndexTabById',
      payload: { configIndexTabId },
      callback: (detail) => {
        console.log(detail);
        setVisible({
          show: true,
          type,
          detail: detail,
        });
      },
    });
  };

  const cardBtnList = [
    {
      auth: 'tabAddCity',
      text: '新增城市',
      onClick: () => {
        setVisible({
          show: true,
          type: 'add',
        });
      },
    },
  ];
  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        pagination={false}
        btnExtra={cardBtnList}
        rowKey={(record) => `${record.configIndexTabId}`}
        params={{ userOs: tabKey, version, deleteFlag: 1 }}
        dispatchType="globalConfig/fetchIndexTabModalList"
        {...IndexTabModalList}
      ></TableDataBlock>
      <TabDrawerSet
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
        tabKey={tabKey}
        version={version}
      ></TabDrawerSet>
    </>
  );
};

export default connect(({ loading, globalConfig }) => ({
  IndexTabModalList: globalConfig.IndexTabModalList,
  loading: loading.effects['globalConfig/fetchIndexTabModalList'],
}))(TabTable);
