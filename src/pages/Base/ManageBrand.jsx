import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import PopImgShow from '@/components/PopImgShow';
import AuthConsumer from '@/layouts/AuthConsumer';
import TableDataBlock from '@/components/TableDataBlock';
import BrandUpdate from './components/Brand/BrandUpdate';

const BusinessBrandComponent = (props) => {
  const { businessBrand, tradeList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '品牌名称',
      name: 'brandName',
    },
    {
      label: '品牌类型',
      name: 'categoryId',
      type: 'select',
      loading: loading.models.sysTradeList,
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'id' },
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
      type: 'switch',
      dataIndex: 'status',
      render: (val, row) => {
        const { configBrandIdString } = row;
        return {
          auth: 'status',
          noAuth: val === '1' ? '启用' : '停用',
          checked: val === '1',
          onClick: () => fetchMerBrandEdit({ configBrandIdString, status: 1 ^ Number(val) }),
        };
      },
    },
    {
      type: 'handle',
      dataIndex: 'configBrandIdString',
      render: (val, row) => [
        {
          type: 'edit',
          click: () => handleBrandSet('edit', row),
        },
        {
          type: 'del',
          click: () => fetchMerBrandEdit({ configBrandIdString: val, deleteFlag: 0 }),
        },
      ],
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
      callback: childRef.current.fetchGetData,
    });
  };

  // 品牌新增
  const handleBrandSet = (type, initialValues) => {
    setVisible({
      type,
      initialValues,
      show: true,
      tradeList,
    });
  };

  // 表格额外按钮
  const extraBtn = [{ auth: 'save', onClick: () => handleBrandSet('add') }];

  return (
    <>
      <TableDataBlock
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading.models.businessBrand}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.configBrandIdString}`}
        dispatchType="businessBrand/fetchGetList"
        {...businessBrand}
      ></TableDataBlock>
      <BrandUpdate
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></BrandUpdate>
    </>
  );
};

export default connect(({ businessBrand, sysTradeList, loading }) => ({
  businessBrand,
  tradeList: sysTradeList.list.list,
  loading,
}))(BusinessBrandComponent);
