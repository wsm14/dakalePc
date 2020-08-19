import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { BUSINESS_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import businessBrandSet from './components/Brand/BusinessBrandSet';

const BusinessBrandComponent = (props) => {
  const { businessBrand, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '品牌名称',
      name: 'merchantId',
    },
    {
      label: '品牌类型',
      name: 'businessStatus',
      type: 'select',
      select: { list: BUSINESS_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '品牌logo',
      align: 'center',
      dataIndex: 'merchantId',
    },
    {
      title: '品牌名',
      align: 'center',
      dataIndex: 'merchantName',
      render: (val) => val || '暂未授权',
    },
    {
      title: '品牌类型',
      align: 'center',
      dataIndex: 'mobile',
    },
  ];

  // 品牌新增
  const handleBrandSet = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: businessBrandSet({ dispatch, childRef }),
    });
  };

  return (
    <DataTableBlock
      btnExtra={
        <Button className="dkl_green_btn" key="1" onClick={handleBrandSet}>
          新增
        </Button>
      }
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.merchantName}`}
      dispatchType="businessBrand/fetchGetList"
      {...businessBrand}
    ></DataTableBlock>
  );
};

export default connect(({ businessBrand, loading }) => ({
  businessBrand,
  loading: loading.models.businessBrand,
}))(BusinessBrandComponent);
