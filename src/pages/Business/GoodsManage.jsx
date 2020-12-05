import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { GOODS_TYPE } from '@/common/constant';
import closeRefuse from './components/Goods/Form/CloseRefuse';
import stockSet from './components/Goods/Form/StockSet';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import GoodsHandleDetail from './components/Goods/Detail/HandleDetail';
import GoodsDrawer from './components/Goods/GoodsDrawer';

const GoodsManageComponent = (props) => {
  const { goodsManage, loadings, loading, dispatch } = props;

  const childRef = useRef();
  const { mreSelect, classifySelect } = goodsManage;
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '所属店铺',
      name: 'merchantId',
      type: 'select',
      loading: loadings.effects['goodsManage/fetchClassifyGetMre'],
      allItem: false,
      onSearch: (val) => fetchClassifyGetMre(val),
      onChange: (val) => fetchGetClassify(val),
      select: { list: mreSelect },
      placeholder: '请输入店铺名称搜索',
    },
    {
      label: '商品分类',
      name: 'customCategoryId',
      type: 'select',
      allItem: false,
      loading: loadings.effects['goodsManage/fetchGoodsGetClassify'],
      select: { list: classifySelect },
      placeholder: '请先选择店铺',
    },
    {
      label: '上架状态',
      name: 'status',
      type: 'select',
      select: { list: GOODS_TYPE },
    },
    {
      label: '商品类型',
      name: 'goodsType',
      type: 'select',
      select: {
        list: [
          { value: 'package', name: '套餐' },
          { value: 'single', name: '单品' },
        ],
      },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      dataIndex: 'merchantIdStr',
      render: (val, item, i) => i + 1,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '单位',
      align: 'center',
      dataIndex: 'goodsUnit',
      render: (val) => val || '--',
    },
    {
      title: '商品分类',
      align: 'center',
      dataIndex: 'customCategoryName',
      render: (val) => val || '--',
    },
    {
      title: '商品类型',
      align: 'center',
      dataIndex: 'goodsType',
      render: (val) => (val == 'package' ? '套餐' : '单品'),
    },
    {
      title: '售价',
      align: 'right',
      dataIndex: 'price',
    },
    {
      title: '所属店铺',
      align: 'center',
      dataIndex: 'merchantName',
    },
    {
      title: '库存',
      align: 'right',
      dataIndex: 'stock',
    },
    {
      title: '上架状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => GOODS_TYPE[val],
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'goodsIdString',
      render: (val, record) => {
        const { status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                click: () => fetchGoodsGetDetail({ goodsIdString: val }),
              },
              {
                type: 'own',
                title: '库存',
                visible: status != 0,
                click: () => fetchStockSet(record),
              },
              {
                type: 'del',
                visible: status == 0,
                click: () => fetchGoodsDel({ goodsIdString: val }),
              },
              {
                type: 'down',
                visible: status != 0,
                click: () => fetchAuditRefuse(record),
              },
              {
                type: 'own',
                title: '操作记录',
                click: () => fetchGoodsHandleDetail(val),
              },
            ]}
          />
        );
      },
    },
  ];

  // 搜索商家
  const fetchClassifyGetMre = debounce((keyword) => {
    if (!keyword) return;
    dispatch({
      type: 'goodsManage/fetchClassifyGetMre',
      payload: {
        limit: 999,
        page: 1,
        keyword,
      },
    });
  }, 500);

  // 搜索商家 后搜索类别
  const fetchGetClassify = (merchantId) => {
    if (!merchantId) return;
    dispatch({
      type: 'goodsManage/fetchGoodsGetClassify',
      payload: {
        limit: 999,
        page: 1,
        merchantId,
      },
    });
  };

  // 商品删除
  const fetchGoodsDel = (payload) => {
    dispatch({
      type: 'goodsManage/fetchGoodsDel',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 下架
  const fetchAuditRefuse = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: closeRefuse({ dispatch, childRef, initialValues }),
    });
  };

  // 库存
  const fetchStockSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: stockSet({ dispatch, childRef, initialValues }),
    });
  };

  // 获取商品详情
  const fetchGoodsGetDetail = (payload) => {
    dispatch({
      type: 'goodsManage/fetchGoodsGetDetail',
      payload,
      callback: (detail) => setVisible({ type: 'showDetail', detail }),
    });
  };

  // 获取操作日志详情
  const fetchGoodsHandleDetail = (val) => {
    dispatch({
      type: 'goodsManage/fetchGoodsHandleDetail',
      payload: {
        identifyIdStr: val,
      },
      callback: (detail) => setVisible({ type: 'handleDetail', detail }),
    });
  };

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.goodsIdString}`}
        dispatchType="goodsManage/fetchGetList"
        {...goodsManage}
      ></DataTableBlock>
      <GoodsDrawer visible={visible} onClose={() => setVisible(false)}></GoodsDrawer>
      <GoodsHandleDetail visible={visible} onClose={() => setVisible(false)}></GoodsHandleDetail>
    </>
  );
};

export default connect(({ goodsManage, loading }) => ({
  goodsManage,
  loadings: loading,
  loading: loading.effects['goodsManage/fetchGetList'],
}))(GoodsManageComponent);
