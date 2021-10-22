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
      type: 'handle',
      align: 'center',
      dataIndex: 'configIndexTabId',
      render: (val, row) => {
        const { defaultTags: dtag, tags, cityCode, ...other } = row;
        return [
          {
            type: 'edit',
            title: '编辑',
            click: () => {
              // setVisible({
              //   show: true,
              //   type: 'edit',
              //   detail: {
              //     ...other,
              //     cityCode: cityCode ? [cityCode.slice(0, 2), cityCode] : [],
              //   },
              // });
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
      className: 'dkl_blue_btn',
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
        rowKey={(record) => `${record.configWanderAroundModuleId}`}
        params={{ userOs: tabKey, version }}
        dispatchType="walkingManage/fetchAroundModuleCityList"
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

export default connect(({ loading, walkingManage }) => ({
  configureList: walkingManage.configureList,
  loading: loading.effects['walkingManage/fetchAroundModuleCityList'],
}))(TabTable);
