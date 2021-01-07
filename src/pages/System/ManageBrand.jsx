import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Switch } from 'antd';
import PopImgShow from '@/components/PopImgShow';
import AuthConsumer from '@/layouts/AuthConsumer';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
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
    {
      title: '启用状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, record) => (
        <AuthConsumer auth="status" noAuth={val === '1' ? '启用' : '停用'}>
          <Switch
            checked={val === '1'}
            onClick={() =>
              fetchMerBrandEdit({
                configBrandIdString: record.configBrandIdString,
                status: 1 ^ Number(val),
              })
            }
          />
        </AuthConsumer>
      ),
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'configBrandIdString',
      render: (val, row) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => handleBrandSet(row),
            },
            {
              type: 'del',
              click: () => fetchMerBrandEdit({ configBrandIdString: val, deleteFlag: 0 }),
            },
          ]}
        />
      ),
    },
  ];

  // 品牌类型列表
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 编辑/删除/启用停用品牌
  const fetchMerBrandEdit = (payload) => {
    dispatch({
      type: 'businessBrand/fetchMerBrandEdit',
      payload,
    });
  };

  // 品牌新增
  const handleBrandSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: businessBrandSet({ dispatch, childRef, tradeList, initialValues }),
    });
  };

  useEffect(() => {
    fetchTradeList();
  }, []);

  return (
    <DataTableBlock
      btnExtra={
        <AuthConsumer auth="save">
          <Button className="dkl_green_btn" onClick={handleBrandSet}>
            新增
          </Button>
        </AuthConsumer>
      }
      keepName="品牌管理"
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
