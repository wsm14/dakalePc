import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import './index.less';

/**
 * 选择权益商品（多选）
 */
const GoodsSelectModal = (props) => {
  const { platformEquityList = {}, form, dispatch, visible, onSumbit, onClose, loading } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项

  useEffect(() => {
    if (visible) {
      fetchSpecialGoodsList();
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
  ];

  const listProps = {
    list: platformEquityList.list,
    total: platformEquityList.total,
    key: 'specialGoodsId',
    loading: loading.effects['baseData/fetchGetPlatformEquitySelect'],
  };

  // 获取权益商品
  const fetchSpecialGoodsList = (data) => {
    dispatch({
      type: 'baseData/fetchGetPlatformEquitySelect',
      payload: {
        ...data,
        buyFlag: 0,
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
          {listProps?.list.map((item) =>
            goodsDom(
              item,
              selectItem.map((item) => item.specialGoodsId),
              handleSelect,
            ),
          )}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Spin>
  );

  return (
    <Modal
      title={`选择奖品（多选）`}
      width={1125}
      visible={visible}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        onSumbit(selectItem);
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchSpecialGoodsList}
      ></SearchCondition>
      {listDom}
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  PlatformCouponList: baseData.PlatformCoupon,
  platformEquityList: baseData.platformEquity,
  EquityCouponList: baseData.EquityCoupon,
  loading,
}))(GoodsSelectModal);
