import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';
import businessBrandSet from './components/Brand/BusinessBrandSet';

const BusinessBrandComponent = (props) => {
  const { businessBrand, tradeList, loading, dispatch } = props;

  const childRef = useRef();
  // 搜索参数
  const searchItems = [
    {
      label: '品牌名称',
      name: 'brandName',
    },
    {
      label: '品牌类型',
      name: 'categoryId',
      loading: loading.models.sysTradeList,
      type: 'select',
      select: { list: tradeList.map((item) => ({ name: item.categoryName, value: item.id })) },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '品牌logo',
      align: 'center',
      dataIndex: 'brandLogo',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '品牌名',
      align: 'center',
      dataIndex: 'brandName',
    },
    {
      title: '品牌类型',
      align: 'center',
      dataIndex: 'categoryName',
    },
  ];

  // 品牌类型列表
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 品牌新增
  const handleBrandSet = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: businessBrandSet({ dispatch, childRef, tradeList }),
    });
  };

  useEffect(() => {
    fetchTradeList();
  }, []);

  return (
    <DataTableBlock
      btnExtra={
        <Button className="dkl_green_btn" key="1" onClick={handleBrandSet}>
          新增
        </Button>
      }
      cRef={childRef}
      loading={loading.models.businessBrand}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.configBrandIdString}`}
      dispatchType="businessBrand/fetchGetList"
      {...businessBrand}
    ></DataTableBlock>
  );
};

export default connect(({ businessBrand, sysTradeList, loading }) => ({
  businessBrand,
  tradeList: sysTradeList.list.list,
  loading,
}))(BusinessBrandComponent);
