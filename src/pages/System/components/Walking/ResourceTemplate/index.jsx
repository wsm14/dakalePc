import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import PreviewDrawer from './PreviewDrawer';

const ResourceTemplate = (props) => {
  const { dispatch, loading, resourceTemplateList } = props;
  const [visible, setVisible] = useState(false);

  const childRef = useRef();

  const getColumns = [
    {
      title: '模板名称',
      align: 'center',
      dataIndex: 'templateName',
    },
    {
      title: '最低支持版本-iOS',
      align: 'center',
      dataIndex: 'versionIos',
    },
    {
      title: '最低支持版本-Android',
      align: 'center',
      dataIndex: 'versionAndroid',
    },
    {
      type: 'handle',
      // align: 'center',
      dataIndex: 'resourceTemplateId',
      render: (val, row) => [
        {
          type: 'preview',
          click: () => {
            handlePreview(val);
          },
          auth: true,
        },
      ],
    },
  ];

  const handlePreview = (resourceTemplateId) => {
    dispatch({
      type: 'walkingManage/fetchGetResourceTemplateById',
      payload: {
        resourceTemplateId,
      },
      callback: (detail) => {
        setVisible({ show: true, detail });
      },
    });
  };

  return (
    <>
      <TableDataBlock
        order
        cardProps={{ title: '资源位模板预览' }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        pagination={false}
        rowKey={(record) => `${record.resourceTemplateId}`}
        params={{ deleteFlag: 1 }}
        dispatchType="walkingManage/fetchListResourceTemplate"
        {...resourceTemplateList}
      />
      {/* 预览 */}
      <PreviewDrawer visible={visible} onClose={() => setVisible(false)}></PreviewDrawer>
    </>
  );
};

export default connect(({ loading, walkingManage }) => ({
  resourceTemplateList: walkingManage.resourceTemplateList,
  loading: loading.models.walkingManage,
}))(ResourceTemplate);
