import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom, couponsDom, platformCouponsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import { CONPON_RULES_GOODS_TYPE } from '@/common/constant';
import './index.less';

const { TabPane } = Tabs;
/**
 * 选择平台券/权益商品/权益券（多选）
 */
const GoodsSelectModal = (props) => {
  const {
    specialGoodsList = {},
    couponList = {},
    platformEquityList = {},
    form,
    dispatch,
    visible,
    onClose,
    loading,
  } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState('specialGoods'); // tab类型

  useEffect(() => {
    if (['specialGoods', 'reduceCoupon', 'commerceGoods'].includes(tabKey)) {
      fetchSpecialGoodsList();
    }
  }, [tabKey]);

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: {
        specialGoods: 'goodsName',
        reduceCoupon: 'couponName',
        commerceGoods: 'goodsName',
      }[tabKey],
    },
    {
      label: '店铺/集团名称',
      name: 'ownerId',
      type: 'merchant',
    },
    {
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: ['', '上架中'],
    },
  ];

  const listProps = {
    specialGoods: {
      list: specialGoodsList.list,
      total: specialGoodsList.total,
      key: 'specialGoodsId',
      loading: loading.effects['baseData/fetchGetSpecialGoodsSelect'],
    },
    reduceCoupon: {
      list: couponList.list,
      total: couponList.total,
      key: 'ownerCouponIdString',
      loading: loading.effects['baseData/fetchGetBuyCouponSelect'],
    },
    commerceGoods: {
      list: platformEquityList.list,
      total: platformEquityList.total,
      key: 'activityGoodsId',
      loading: loading.effects['baseData/fetchGetPlatformCommerceGoodsSelect'],
    },
  }[tabKey];

  // 获取特惠活动
  const fetchSpecialGoodsList = (data) => {
    const payload = {
      specialGoods: {
        type: 'baseData/fetchGetSpecialGoodsSelect',
        data: { deleteFlag: 1, selfTourFlag: 0 },
      },
      reduceCoupon: {
        type: 'baseData/fetchGetBuyCouponSelect',
        data: { buyFlag: 0 },
      },
      commerceGoods: {
        type: 'baseData/fetchGetPlatformCommerceGoodsSelect',
        data: { buyFlag: 0 },
      },
    }[tabKey];
    dispatch({
      type: payload.type,
      payload: {
        ...payload.data,
        ...data,
        page: 1,
        limit: 20,
      },
    });
  };

  // 选择商品逻辑
  const handleSelect = (item) => {
    const key = listProps?.key;
    if (selectItem.findIndex((ci) => ci[key] === item[key]) > -1) {
      setSelectItem(selectItem.filter((ci) => ci[key] !== item[key]));
    } else setSelectItem([...selectItem, item]);
  };

  const listDom = (
    <Spin spinning={!!listProps?.loading}>
      {listProps?.list?.length ? (
        <div className="share_select_list">
          {listProps?.list.map(
            (item) =>
              ({
                specialGoods: goodsDom(
                  item,
                  selectItem.map((item) => item.specialGoodsId),
                  handleSelect,
                ),
                reduceCoupon: couponsDom(
                  item,
                  selectItem.map((item) => item.ownerCouponIdString),
                  handleSelect,
                  'valuable',
                ),
                commerceGoods: goodsDom(
                  item,
                  selectItem.map((item) => item.activityGoodsId),
                  handleSelect,
                ),
              }[tabKey]),
          )}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Spin>
  );

  const typeDom = (
    <div className="typeDom_box">
      <div className="typeDom_box_center"></div>
      <div>{`选择所有${CONPON_RULES_GOODS_TYPE[tabKey]}充值商品参与`}</div>
    </div>
  );

  return (
    <Modal
      title={`选择指定商品`}
      width={1125}
      visible={visible}
      afterClose={() => setSelectItem([])}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        form.setFieldsValue({
          ruleConditions: (form.getFieldValue('ruleConditions') || []).concat(selectItem),
        });
        onClose();
      }}
      onCancel={onClose}
    >
      <Tabs type="card" activeKey={tabKey} onChange={setTabKey} style={{ overflow: 'initial' }}>
        {Object.keys(CONPON_RULES_GOODS_TYPE).map((item) => (
          <TabPane tab={CONPON_RULES_GOODS_TYPE[item]} key={item}>
            <SearchCondition
              searchItems={searchItems}
              handleSearch={fetchSpecialGoodsList}
            ></SearchCondition>
            {['phoneBill', 'member'].includes(tabKey) ? typeDom : listDom}
          </TabPane>
        ))}
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  specialGoodsList: baseData.specialGoods,
  couponList: baseData.buyCoupon,
  platformEquityList: baseData.platformEquity,
  loading,
}))(GoodsSelectModal);
