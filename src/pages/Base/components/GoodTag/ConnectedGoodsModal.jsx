import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Badge } from 'antd';
import { GOODS_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import SortValueSet from '@/components/FormListCondition/SortValueSet';

const tabList = [
  {
    key: 'specialGoods',
    tab: '特惠商品',
  },
  {
    key: 'commerceGoods',
    tab: '电商品',
  },
];

const ConnectedGoodsModal = (props) => {
  const { visible, onClose, dispatch, configGoodsList, loading, loadingSort } = props;
  const { show = false, id, name } = visible;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('specialGoods');
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ goodsType: tabKey, page: 1 });
  }, [tabKey]);

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: 'brandName',
    },
    {
      label: '商品ID',
      name: 'brandNsame',
    },
  ];

  const getColumns = [
    {
      title: '商品主图',
      align: 'center',
      dataIndex: 'goodsImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '商品名称/ID',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <div>
          <Ellipsis length={13} tooltip>
            {val}
          </Ellipsis>
          <div style={{ marginTop: 5 }}>{row.goodsId}</div>
        </div>
      ),
    },
    {
      title: '所属类目/供应商',
      align: 'center',
      dataIndex: 'ownerName',
      render: (val, row) => (
        <div>
          <div style={{ marginTop: 5 }}>{row.categoryName || '--'}</div>
          <Ellipsis length={8} tooltip>
            {val || '--'}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '零售价',
      align: 'center',
      dataIndex: 'price',
    },
    {
      title: '权重',
      align: 'center',
      dataIndex: 'sortValue',
      render: (val, row) => (
        <SortValueSet
          value={val}
          valueKey="sortValue"
          loading={loadingSort}
          onSubmit={(val) => fetchSortSet({ goodsId: row.goodsId, ...val })}
        ></SortValueSet>
      ),
    },
    {
      title: '商品状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => <Badge status={val === '1' ? 'success' : 'error'} text={GOODS_TYPE[val]} />,
    },
    {
      type: 'handle',
      dataIndex: 'goodsId',
      render: (val, row) => {
        const { goodsId, ownerId } = row;
        return [
          {
            type: 'del',
            title: '移除',
            auth: true,
            click: () => fetchConfigGoodsSet('del', [{ goodsId, ownerId, goodsType: tabKey }]),
          },
        ];
      },
    },
  ];

  // 新增 移除
  const fetchConfigGoodsSet = (mode, list, callback) => {
    dispatch({
      type: 'goodsTag/fetchConfigGoodsSet',
      payload: {
        mode,
        configGoodsTagId: id,
        configGoodsTagRelatedGoodsList: list,
      },
      callback: () => {
        childRef.current.fetchGetData({ checkOnly: configGoodsList.list.length === 1 });
        callback && callback();
      },
    });
  };

  // 修改权重
  const fetchSortSet = (values) => {
    dispatch({
      type: 'goodsTag/fetchTagSortSet',
      payload: values,
      callback: () => {
        childRef.current.fetchGetData();
      },
    });
  };

  const btnList = [
    {
      text: '新增',
      onClick: () => setVisibleDrawer({ show: true, mode: 'add' }),
    },
  ];

  return (
    <>
      <Modal
        title={`关联商品 - ${name}`}
        width={1150}
        destroyOnClose
        footer={null}
        visible={show}
        zIndex={100}
        onCancel={onClose}
      >
        <TableDataBlock
          tableSize="small"
          cardProps={{
            tabList: tabList,
            activeTabKey: tabKey,
            onTabChange: setTabKey,
            tabBarExtraContent: <ExtraButton list={btnList}></ExtraButton>,
          }}
          scroll={{ y: 400 }}
          cRef={childRef}
          loading={loading}
          searchCol={{ xxl: 12 }}
          searchItems={searchItems}
          columns={getColumns}
          params={{ goodsTagId: id, goodsType: tabKey }}
          rowKey={(row) => `${row.goodsId}`}
          dispatchType="goodsTag/fetchConfigGoodsList"
          {...configGoodsList}
        ></TableDataBlock>
      </Modal>
      <GoodsSelectModal
        visible={visibleDrawer}
        showTag={['specialGoods', 'commerceGoods']}
        onSumbit={({ list }) => {
          fetchConfigGoodsSet(
            'add',
            list.map((i) => ({
              goodsId: i.goodsId,
              goodsType: i.activityType,
              ownerId: i.ownerId,
            })),
            () => setVisibleDrawer(false),
          );
        }}
        onClose={() => setVisibleDrawer(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default connect(({ goodsTag, loading }) => ({
  configGoodsList: goodsTag.configGoodsList,
  loading:
    loading.effects['goodsTag/fetchConfigGoodsList'] ||
    loading.effects['goodsTag/fetchConfigGoodsSet'],
  loadingSort: loading.effects['goodsTag/fetchTagSortSet'],
}))(ConnectedGoodsModal);
