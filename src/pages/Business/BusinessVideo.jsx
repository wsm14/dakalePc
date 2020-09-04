import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const BusinessVideoComponent = (props) => {
  const { businessVideo, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({ show: false, url: '' });

  // 搜索参数
  const searchItems = [
    {
      label: '商户账号',
      name: 'account',
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
      dataIndex: 'account',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '操作',
      dataIndex: 'userMerchantIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'del',
              click: () => fetchMerVideoDel(val),
            },
          ]}
        />
      ),
    },
  ];

  // 获取商家详情
  const fetchMerVideoDel = (merchantId) => {
    dispatch({
      type: 'businessVideo/fetchMerVideoDel',
      payload: { merchantId },
      callback: childRef.current.fetchGetData(),
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userMerchantIdString}`}
      dispatchType="businessVideo/fetchGetList"
      {...businessVideo}
    ></DataTableBlock>
  );
};

export default connect(({ businessVideo, loading }) => ({
  businessVideo,
  loading: loading.models.businessVideo,
}))(BusinessVideoComponent);
