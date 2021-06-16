import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { MRE_TAG_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import TagSet from './components/Tag/TagSet';

const TagManage = (props) => {
  const { tagManage, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 修改新增框

  // 搜索参数
  const searchItems = [
    {
      label: '标签名称',
      name: 'tagName',
    },
    {
      label: '标签状态',
      type: 'select',
      name: 'status',
      select: MRE_TAG_STATUS,
    },
  ];

  // 修改标签
  const fetchTagEdit = (payload) => {
    dispatch({
      type: 'tagManage/fetchTagEdit',
      payload: payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '标签名称',
      dataIndex: 'tagName',
      render: (val) => val || '--',
    },
    {
      title: '标签状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => MRE_TAG_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'configMerchantId',
      render: (val, record) => {
        const { status } = record;
        return [
          {
            type: status === '1' ? 'down' : 'up',
            auth: 'edit',
            click: () => fetchTagEdit({ ...record, status: 1 ^ Number(status) }),
          },
          {
            type: 'edit',
            click: () => setVisible({ type: 'edit', detail: record }),
          },
        ];
      },
    },
  ];

  const extraBtn = [
    {
      text: '新增标签',
      auth: 'save',
      onClick: () => setVisible({ type: 'add' }),
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.configMerchantId}`}
        dispatchType="tagManage/fetchGetList"
        {...tagManage}
      ></TableDataBlock>
      <TagSet cRef={childRef} visible={visible} onClose={() => setVisible(false)}></TagSet>
    </>
  );
};

export default connect(({ tagManage, loading }) => ({
  tagManage,
  loading: loading.models.tagManage,
}))(TagManage);
