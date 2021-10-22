import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { getCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import TabDrawerSet from './TabDrawerSet';

const TabTable = (props) => {
  const { dispatch, loading, configureList, tabKey, version, fetchTable } = props;
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
        const { defaultTags: dtag, tags, cityCode, ...other } = row;
        return [
          {
            type: 'edit',
            title: '编辑',
            click: () => {
              setVisible({
                show: true,
                type: 'edit',
                detail: {
                  ...other,
                  cityCode: cityCode ? [cityCode.slice(0, 2), cityCode] : [],
                  defaultTags: dtag ? dtag.split(',') : [],
                  tags: tags ? tags.split(',') : [],
                },
              });
            },
            auth: true,
          },
        ];
      },
    },
  ];

  const cardBtnList = [
    {
      auth: 'save',
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
        btnExtra={cardBtnList}
        rowKey={(record) => `${record.configIndexTabId}`}
        params={{ userOs: tabKey, version }}
        dispatchType="globalConfig/fetchAroundModuleList"
        {...configureList}
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
  configureList: globalConfig.configureList,
  loading: loading.effects['globalConfig/fetchAroundModuleList'],
}))(TabTable);
