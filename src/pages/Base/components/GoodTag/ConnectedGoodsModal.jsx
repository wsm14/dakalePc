import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Badge } from 'antd';
import { ELECTRICGOODS_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import NumberValueSet from '@/components/FormListCondition/NumberValueSet';

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
  const { listKey, visible, onClose, dispatch, configGoodsList, loading, loadingSort } = props;
  const { show = false, id, tagType, name, goodsType = 'specialGoods' } = visible;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('');
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  useEffect(() => {
    if (show) {
      setTabKey(goodsType);
    }
  }, [show]);

  useEffect(() => {
    if (tabKey) {
      childRef.current && childRef.current.fetchGetData({ goodsType: tabKey, page: 1 });
    }
  }, [tabKey]);

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '商品ID',
      name: 'goodsId',
    },
    {
      label: '所属供应商',
      name: 'supplierId',
      type: 'supplier',
      show: tabKey === 'commerceGoods',
    },
    {
      label: '所属店铺',
      name: 'relateId',
      type: 'merchant',
      show: tabKey === 'specialGoods',
    },
    {
      label: '商品状态',
      name: 'status',
      type: 'select',
      select: ELECTRICGOODS_STATUS,
    },
  ];

  const getColumns = [
    {
      title: '商品主图',
      align: 'center',
      dataIndex: 'goodsImg',
      render: (val) => <PopImgShow url={val} width={60} />,
    },
    {
      title: '商品名称/ID',
      width: 180,
      dataIndex: 'goodsName',
      render: (val, row) => (
        <div>
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
          <div>{row.goodsId}</div>
        </div>
      ),
    },
    {
      title: tabKey === 'commerceGoods' ? '所属类目/供应商' : '所属行业/店铺',
      align: 'center',
      dataIndex: 'relateName',
      render: (val, row) => (
        <div>
          <div>{row.categoryName || '--'}</div>
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
      dataIndex: 'tagPriority',
      show: listKey === 'show',
      render: (val, row) => (
        <NumberValueSet
          value={val}
          valueKey="tagPriority"
          loading={loadingSort}
          onSubmit={(val) =>
            fetchSortSet({
              configGoodsTagId: id,
              configGoodsTagRelatedGoodsList: [
                {
                  goodsId: row.goodsId,
                  ownerId: row.ownerId,
                  goodsType: tabKey,
                  ...val,
                },
              ],
            })
          }
        ></NumberValueSet>
      ),
    },
    {
      title: '商品状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => (
        <Badge status={val === '1' ? 'success' : 'error'} text={ELECTRICGOODS_STATUS[val]} />
      ),
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
        if (mode === 'add') {
          childRef.current.fetchGetData();
        } else childRef.current.fetchGetData({ checkOnly: configGoodsList.list.length === 1 });
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
        width={1200}
        destroyOnClose
        footer={null}
        visible={show}
        zIndex={100}
        bodyStyle={{ padding: 0 }}
        onCancel={onClose}
        afterClose={() => setTabKey('')}
      >
        <TableDataBlock
          firstFetch={false}
          tableSize="small"
          cardProps={
            listKey == 'platform' && {
              bordered: false,
              tabList: tabList,
              activeTabKey: tabKey,
              onTabChange: setTabKey,
              tabBarExtraContent: <ExtraButton list={btnList}></ExtraButton>,
            }
          }
          btnExtra={listKey == 'show' && btnList}
          scroll={{ y: 400 }}
          cRef={childRef}
          loading={loading}
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
