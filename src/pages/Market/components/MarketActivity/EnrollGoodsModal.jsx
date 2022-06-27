import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Modal, Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import SupplyInfoDrawer from './SupplyInfoDrawer';
import EnrollSpecialGoods from './EnrollGoodsTable/EnrollSpecialGoods';
import EnrollCommerceGoods from './EnrollGoodsTable/EnrollCommerceGoods';

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

// 报名商品 - 展示弹窗
const EnrollGoodsModal = (props) => {
  const { visible, dispatch, onClose, loading } = props;
  const { show = false, detail = {} } = visible;
  const { marketingActivityId, activityName } = detail;

  const tableRef = useRef();
  const [tabKey, setTabKey] = useState('specialGoods');
  const [visibleInfo, setVisibleInfo] = useState(false); // 补充信息
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择弹窗

  // 选择校验
  const handleSelectRowCheck = ({ selectItem, setSelectItem }) => {
    return {
      hideSelectAll: true, // 隐藏全选
      onChange: () => {}, // 覆盖原本选择方法
      onSelect: (record, selected) => {
        const { goodsId } = record;
        const { keys = [], list = [] } = selectItem;
        // 选中
        if (selected) {
          fetchMarketActivityCheckGoods(record, () =>
            setSelectItem([...keys, goodsId], [...list, record]),
          );
        } else {
          // 取消选中
          setSelectItem(
            keys.filter((i) => i !== goodsId),
            list.filter((i) => i.goodsId !== goodsId),
          );
        }
      },
    };
  };

  // 校验接口
  const fetchMarketActivityCheckGoods = (row, callback) => {
    const { goodsId, ownerId } = row;
    dispatch({
      type: 'marketActivity/fetchMarketActivityCheckGoods',
      payload: {
        goodsId,
        ownerId,
        goodsType: tabKey,
        marketingActivityId,
      },
      callback,
    });
  };

  // 修改库存
  const fetchUpdateRemain = (values) => {
    dispatch({
      type: 'marketActivity/fetchMarketActivityGoodsEditRemain',
      payload: values,
    });
  };

  const btnList = [
    {
      text: '新增',
      onClick: () => setVisibleSelect(true),
    },
  ];

  const tableProps = {
    id: marketingActivityId,
    tableRef,
    fetchUpdateRemain,
  };

  return (
    <>
      <Modal
        title={`报名商品 - ${activityName}`}
        width={1150}
        destroyOnClose
        footer={null}
        visible={show}
        zIndex={100}
        onCancel={onClose}
      >
        <Card
          tabList={tabList}
          activeTabKey={tabKey}
          onTabChange={setTabKey}
          tabBarExtraContent={<ExtraButton list={btnList}></ExtraButton>}
        >
          {tabKey === 'specialGoods' ? (
            <EnrollSpecialGoods {...tableProps}></EnrollSpecialGoods> // 特惠
          ) : (
            <EnrollCommerceGoods {...tableProps}></EnrollCommerceGoods> // 电商
          )}
        </Card>
      </Modal>
      {/* 商品选择页面 */}
      <GoodsSelectModal
        visible={visibleSelect}
        showTag={[tabKey]}
        loading={loading}
        rowSelection={handleSelectRowCheck}
        closeSumbit={false}
        searchParams={{ isShowSkuList: 1 }} // 是否搜索展示规格
        onSumbit={({ list }) => {
          setVisibleInfo({
            show: true,
            detail: {
              [tabKey]: list.map(({ discount, skuManagerResps = [], ...other }) => ({
                ...other,
                skuList: skuManagerResps,
              })),
            },
          });
        }}
        onClose={() => setVisibleSelect(false)}
      ></GoodsSelectModal>
      {/* 补充信息 */}
      <SupplyInfoDrawer
        tableRef={tableRef}
        goodsType={tabKey}
        activeDetail={detail}
        visible={visibleInfo}
        marketingActivityId={marketingActivityId}
        onClose={() => setVisibleInfo(false)}
        onCloseSelect={() => setVisibleSelect(false)}
      ></SupplyInfoDrawer>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketActivity/fetchMarketActivityCheckGoods'],
}))(EnrollGoodsModal);
