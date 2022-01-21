import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom, couponsDom, platformCouponsDom } from './CouponFreeDom';
import { PLATFORM_TICKET_SCENE } from '@/common/constant';
import SearchCondition from '@/components/SearchCondition';
import './index.less';

const { TabPane } = Tabs;
/**
 * 选择平台券/权益商品/权益券（多选）
 */
const GoodsSelectModal = (props) => {
  const {
    PlatformCouponList = {},
    platformEquityList = {},
    EquityCouponList = {},
    form,
    dispatch,
    visible,
    onClose,
    loading,
    typeGoods = 'platformCoupon',
  } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState('platformCoupon'); // tab类型

  // useEffect(() => {
  //   if (visible) {
  //     dispatch({ type: 'baseData/clearPlatformEquity' });
  //   }
  // }, [visible]);

  useEffect(() => {
    fetchSpecialGoodsList();
  }, [tabKey]);

  // 搜索参数
  const searchItems = [
    {
      label: '券名称',
      name: {
        platformCoupon: 'couponName',
        rightGoods: 'goodsName',
        rightCoupon: 'couponName',
      }[tabKey],
    },
    {
      label: '券编号',
      name: 'platformCouponId',
    },
    {
      label: '券类型',
      type: 'select',
      name: 'useScenesType',
      select: PLATFORM_TICKET_SCENE,
    },
  ];

  const listProps = {
    platformCoupon: {
      list: PlatformCouponList.list,
      total: PlatformCouponList.total,
      key: 'platformCouponId',
      loading: loading.effects['baseData/fetchPlatformCouponSelect'],
    },
    rightGoods: {
      list: platformEquityList.list,
      total: platformEquityList.total,
      key: 'specialGoodsId',
      loading: loading.effects['baseData/fetchGetPlatformEquitySelect'],
    },
    rightCoupon: {
      list: EquityCouponList.list,
      total: EquityCouponList.total,
      key: 'ownerCouponIdString',
      loading: loading.effects['baseData/fetchGetEquityCouponSelect'],
    },
  }[tabKey];

  // 获取特惠活动
  const fetchSpecialGoodsList = (data) => {
    const payload = {
      platformCoupon: {
        type: 'baseData/fetchPlatformCouponSelect',
        data: { couponStatus: 1 },
      },
      rightGoods: {
        type: 'baseData/fetchGetPlatformEquitySelect',
        data: { buyFlag: 0 },
      },
      rightCoupon: {
        type: 'baseData/fetchGetEquityCouponSelect',
        data: { buyFlag: 0 },
      },
    }[tabKey];
    dispatch({
      type: payload.type,
      payload: {
        ...payload.data,
        ...data,
        page: 1,
        limit: 999,
      },
    });
  };

  // 选择商品逻辑
  const handleSelect = (item) => {
    const key = listProps.key;
    if (selectItem.findIndex((ci) => ci[key] === item[key]) > -1) {
      setSelectItem(selectItem.filter((ci) => ci[key] !== item[key]));
    } else setSelectItem([...selectItem, item]);
  };

  const listDom = (
    <Spin spinning={!!listProps.loading}>
      {listProps?.list?.length ? (
        <div className="share_select_list">
          {listProps?.list.map(
            (item) =>
              ({
                platformCoupon: platformCouponsDom(
                  { tagType: 'platformCoupon', ...item },
                  selectItem.map((item) => item.platformCouponId),
                  handleSelect,
                ),
                rightGoods: goodsDom(
                  { tagType: 'rightGoods', ...item },
                  selectItem.map((item) => item.specialGoodsId),
                  handleSelect,
                ),
                rightCoupon: couponsDom(
                  { tagType: 'rightCoupon', ...item },
                  selectItem.map((item) => item.ownerCouponIdString),
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

  return (
    <Modal
      title={`选择券`}
      width={1125}
      visible={visible}
      afterClose={() => (setTabKey('platformCoupon'), setSelectItem([]))}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        form.setFieldsValue({
          [typeGoods]: (form.getFieldValue(typeGoods) || []).concat(selectItem),
        });
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchSpecialGoodsList}
      ></SearchCondition>
      <Tabs type="card" onChange={setTabKey} style={{ overflow: 'initial' }}>
        <TabPane tab="平台券" key="platformCoupon">
          {listDom}
        </TabPane>
        {/* <TabPane tab="权益商品" key="rightGoods">
          {listDom}
        </TabPane>
        <TabPane tab="权益券" key="rightCoupon">
          {listDom}
        </TabPane> */}
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  PlatformCouponList: baseData.PlatformCoupon,
  platformEquityList: baseData.platformEquity,
  EquityCouponList: baseData.EquityCoupon,
  loading,
}))(GoodsSelectModal);
