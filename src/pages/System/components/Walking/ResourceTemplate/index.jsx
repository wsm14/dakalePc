import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

const ResourceTemplate = (props) => {
  const { dispatch, loading, editionList } = props;
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('iOS');

  const childRef = useRef();

  const getColumns = [
    {
      title: '模板名称',
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: '最低支持版本-iOS',
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: '最低支持版本-Android',
      align: 'center',
      dataIndex: 'version',
    },
    {
      type: 'handle',
      // align: 'center',
      dataIndex: 'configWanderAroundModuleId',
      render: (val, row) => [
        {
          type: 'edit',
          title: '编辑详情',
          click: () => {
            setVisible({
              show: true,
              type: 'edit',
              detail: row,
            });
          },
          auth: true,
        },
      ],
    },
  ];

  return (
    <TableDataBlock
      order
      cardProps={{ title: '资源位模板预览' }}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      pagination={false}
      rowKey={(record) => `${record.configWanderAroundModuleId}`}
      params={{ userOs: tabKey, area: 'all' }}
      dispatchType="walkingManage/fetchAroundModuleList"
      {...editionList}
    />
  );
};

export default connect(({ loading, walkingManage }) => ({
  editionList: walkingManage.editionList,
  loading: loading.models.walkingManage,
}))(ResourceTemplate);
