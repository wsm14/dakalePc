import React, { useRef } from 'react';
import { connect } from 'dva';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const ServiceBusinessVideo = (props) => {
  const { businessVideo, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '商户手机号',
      name: 'mobile',
    },
    {
      label: '商户名称',
      name: 'merchantName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '封面图',
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '发布人',
      dataIndex: 'username',
    },
    {
      title: '操作',
      dataIndex: 'merchantIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'del',
              click: () => fetchMerVideoDel(record),
            },
          ]}
        />
      ),
    },
  ];

  // 删除视屏
  const fetchMerVideoDel = (record) => {
    dispatch({
      type: 'businessVideo/fetchMerVideoDel',
      payload: { merchantId: record.merchantIdString, momentId: record.userMomentIdString },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return (
    <DataTableBlock
      keepName="商户视屏"
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userMomentIdString}`}
      dispatchType="businessVideo/fetchGetList"
      {...businessVideo}
    ></DataTableBlock>
  );
};

export default connect(({ businessVideo, loading }) => ({
  businessVideo,
  loading: loading.models.businessVideo,
}))(ServiceBusinessVideo);
