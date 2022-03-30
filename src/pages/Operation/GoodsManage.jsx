import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { message } from 'antd';
import { GOODS_TYPE, MRE_SURE_TYPE, MRE_STOCK_STATUS, GOODS_CLASS_TYPE } from '@/common/constant';
import debounce from 'lodash/debounce';
import CloseRefuse from './components/GoodsManage/Form/CloseRefuse';
import StockSet from './components/GoodsManage/Form/StockSet';
import TableDataBlock from '@/components/TableDataBlock';
import GoodsHandleDetail from './components/GoodsManage/Detail/HandleDetail';
import GoodsDrawer from './components/GoodsManage/GoodsDrawer';
import styles from './style.less';

const GoodsManageComponent = (props) => {
  const { goodsManage, loadings, loading, dispatch } = props;
  const { list } = goodsManage;

  const childRef = useRef();
  const { mreSelect, classifySelect } = goodsManage;
  const [visible, setVisible] = useState(false); // 商品详情
  const [visibleDown, setVisibleDown] = useState(false); // 下架原因
  const [visibleStock, setVisibleStock] = useState(false); // 库存设置
  const [merchantId, setMerchantId] = useState(''); // 搜索的商家id

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
      select: GOODS_TYPE,
    },
    {
      label: '商品类型',
      name: 'goodsType',
      type: 'select',
      select: GOODS_CLASS_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      ellipsis: true,
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
      render: (val) => GOODS_CLASS_TYPE[val],
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
      ellipsis: true,
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
      title: '店铺确认状态',
      align: 'center',
      dataIndex: 'checkStatus',
      render: (val) => (!val ? '--' : MRE_SURE_TYPE[val]),
    },
    {
      title: '是否售罄',
      align: 'center',
      dataIndex: 'stockStatus',
      render: (val) => MRE_STOCK_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'goodsIdString',
      render: (val, record, index) => {
        const { status, merchantIdStr, checkStatus } = record;
        return [
          {
            type: 'info',
            click: () => fetchGoodsGetDetail(index),
          },
          // 上架中
          {
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
            type: 'handleDeatil',
            click: () => fetchGoodsHandleDetail(val),
          },
        ];
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
    setVisibleDown({
      show: true,
      initialValues,
    });
  };

  // 库存
  const fetchStockSet = (initialValues) => {
    setVisibleStock({
      show: true,
      initialValues,
    });
  };

  // 获取商品详情
  const fetchGoodsGetDetail = (index) => {
    const { goodsIdString } = list[index];
    dispatch({
      type: 'goodsManage/fetchGoodsGetDetail',
      payload: { goodsIdString },
      callback: (detail) => setVisible({ type: 'showDetail', index, detail }),
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

  const extraBtn = [
    {
      auth: 'save',
      onClick: () => setVisible({ type: 'addGoods' }),
    },
  ];
  return (
    <>
      <TableDataBlock
        order
        
        btnExtra={extraBtn}
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
      ></TableDataBlock>
      <GoodsDrawer
        childRef={childRef}
        visible={visible}
        total={list.length}
        getDetail={fetchGoodsGetDetail}
        onClose={() => setVisible(false)}
      ></GoodsDrawer>
      <GoodsHandleDetail
        visible={visible}
        childRef={childRef}
        onClose={() => setVisible(false)}
      ></GoodsHandleDetail>
      {/* 下架 */}
      <CloseRefuse
        visible={visibleDown}
        childRef={childRef}
        onClose={() => setVisibleDown(false)}
      ></CloseRefuse>
      {/* 库存 */}
      <StockSet
        visible={visibleStock}
        childRef={childRef}
        onClose={() => setVisibleStock(false)}
      ></StockSet>
    </>
  );
};

export default connect(({ goodsManage, loading }) => ({
  goodsManage,
  loadings: loading,
  loading: loading.effects['goodsManage/fetchGetList'],
}))(GoodsManageComponent);
