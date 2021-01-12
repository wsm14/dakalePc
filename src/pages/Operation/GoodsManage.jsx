import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button, message } from 'antd';
import { GOODS_TYPE, MRE_SURE_TYPE } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import debounce from 'lodash/debounce';
import Ellipsis from '@/components/Ellipsis';
import closeRefuse from './components/Goods/Form/CloseRefuse';
import stockSet from './components/Goods/Form/StockSet';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import GoodsHandleDetail from './components/Goods/Detail/HandleDetail';
import GoodsDrawer from './components/Goods/GoodsDrawer';
import styles from './style.less';

const GoodsManageComponent = (props) => {
  const { goodsManage, loadings, loading, dispatch } = props;

  const childRef = useRef();
  const { mreSelect, classifySelect } = goodsManage;
  const [visible, setVisible] = useState(false);
  const [merchantId, setMerchantId] = useState('');

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
      select: mreSelect,
      placeholder: '请输入店铺名称搜索',
      handle: (form) => ({
        onSearch: (val) => fetchClassifyGetMre(val),
        onChange: (val) => {
          fetchClassifySelectClear();
          fetchGetClassify(val);
          form.setFieldsValue({ customCategoryId: undefined });
        },
      }),
    },
    {
      label: '商品分类',
      name: 'customCategoryId',
      type: 'select',
      allItem: false,
      disabled: !merchantId,
      loading: loadings.effects['goodsManage/fetchGoodsGetClassify'],
      onFocus: () => !merchantId && message.warning('请先选择店铺！'),
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
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
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
      render: (val) => Number(val).toFixed(2),
    },
    {
      title: '所属店铺',
      align: 'center',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '库存',
      align: 'right',
      dataIndex: 'stock',
      render: (val) => <span className={val <= 50 ? styles.goods_rowColor : ''}>{val}</span>,
    },
    {
      title: '上架状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => GOODS_TYPE[val],
    },
    {
      title: '商户确认状态',
      align: 'center',
      dataIndex: 'checkStatus',
      render: (val) => (!val ? '-' : MRE_SURE_TYPE[val]),
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'goodsIdString',
      render: (val, record) => {
        const { status, merchantIdStr, checkStatus } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                click: () => fetchGoodsGetDetail({ goodsIdString: val }),
              },
              // 上架中
              {
                type: 'own',
                title: '库存',
                auth: 'stockSet',
                visible: status == 1,
                click: () => fetchStockSet(record),
              },
              // 未发布 - | 已下架 已确认
              {
                type: 'del',
                visible:
                  (status == 3 && !['0', '1', '2'].includes(checkStatus)) ||
                  (status == 0 && checkStatus == 2),
                click: () => fetchGoodsDel({ goodsIdString: val, merchantIdStr }),
              },
              // 上架中 已确认 | 上架中 已驳回
              {
                type: 'down',
                visible: status == 1 && (checkStatus == 2 || checkStatus == 0),
                click: () => fetchAuditRefuse(record),
              },
              // 未发布 - | 未发布 已驳回 | 已下架 已确认
              {
                type: 'up',
                visible:
                  (status == 3 && ['1', '2'].indexOf(checkStatus) == -1) ||
                  (status == 0 && checkStatus == 2),
                click: () => fetchGoodsUp({ goodsIdString: val }),
              },
              {
                type: 'own',
                title: '操作记录',
                auth: 'handleDeatil',
                click: () => fetchGoodsHandleDetail(val),
              },
            ]}
          />
        );
      },
    },
  ];

  // 清楚搜索项目
  const fetchClassifySelectClear = () => {
    dispatch({
      type: 'goodsManage/save',
      payload: {
        classifySelect: [],
      },
    });
  };

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
    setMerchantId(merchantId);
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

  // 商品上架
  const fetchGoodsUp = (payload) => {
    dispatch({
      type: 'goodsManage/fetchGoodsUp',
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
        btnExtra={
          <AuthConsumer auth="save">
            <Button className="dkl_green_btn" onClick={() => setVisible({ type: 'addGoods' })}>
              新增
            </Button>
          </AuthConsumer>
        }
        resetSearch={() => {
          fetchClassifySelectClear();
          setMerchantId('');
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.goodsIdString}`}
        dispatchType="goodsManage/fetchGetList"
        {...goodsManage}
      ></DataTableBlock>
      <GoodsDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></GoodsDrawer>
      <GoodsHandleDetail visible={visible} onClose={() => setVisible(false)}></GoodsHandleDetail>
    </>
  );
};

export default connect(({ goodsManage, loading }) => ({
  goodsManage,
  loadings: loading,
  loading: loading.effects['goodsManage/fetchGetList'],
}))(GoodsManageComponent);
