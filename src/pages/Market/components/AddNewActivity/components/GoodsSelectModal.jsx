import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import './index.less';

const { TabPane } = Tabs;
/**
 * 选择特惠商品（多选）
 */
const GoodsSelectModal = (props) => {
  const {
    specialGoodsList = {},
    platformEquityList = {},
    form,
    dispatch,
    visible,
    onClose,
    loading,
    typeGoods = 'specialGoods',
  } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState('goods'); // tab类型

  useEffect(() => {
    if (visible) {
      if (tabKey === 'goods') {
        setSelectItem(form.getFieldValue(typeGoods) || []);
      }
      dispatch({ type: 'baseData/clearPlatformEquity' });
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '集团/店铺名',
      name: 'id',
      type: 'merchant',
      required: true,
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
  ];

  const listProps = {
    specialGoods: {
      list: specialGoodsList.list,
      total: specialGoodsList.total,
      key: 'specialGoodsId',
      loading: loading.effects['baseData/fetchGetSpecialGoodsSelect'],
    },
    rightGoods: {
      list: platformEquityList.list,
      total: platformEquityList.total,
      key: 'specialGoodsId',
      loading: loading.effects['baseData/fetchGetPlatformEquitySelect'],
    },
  }[typeGoods];

  // 获取特惠活动
  const fetchSpecialGoodsList = (data) => {
    if (!data?.id) return;
    const payload = {
      specialGoods: {
        type: 'baseData/fetchGetSpecialGoodsSelect',
        data: { goodsStatus: 1, merchantId: data.id },
      },
      rightGoods: {
        type: 'baseData/fetchGetPlatformEquitySelect',
        data: { buyFlag: 1, relateId: data.id },
      },
    }[typeGoods];
    dispatch({
      type: payload.type,
      payload: {
        ...payload.data,
        page: 1,
        limit: 999,
      },
    });
  };

  // 选择商品逻辑
  const handleSelect = (item) => {
    if (selectItem.length >= 50) return;
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
                goods: goodsDom(
                  { typeGoods, ...item },
                  selectItem.map((item) => item.specialGoodsId),
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
      title={`选择特惠商品（已选 ${selectItem.length}）`}
      width={1125}
      visible={visible}
      afterClose={() => setTabKey('goods')}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        form.setFieldsValue({ [typeGoods]: selectItem });
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition
        searchItems={searchItems}
        handleSearch={fetchSpecialGoodsList}
      ></SearchCondition>
      <Tabs type="card" onChange={setTabKey} style={{ overflow: 'initial' }}>
        <TabPane tab="特惠商品" key="goods">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  specialGoodsList: baseData.specialGoods,
  platformEquityList: baseData.platformEquity,
  loading,
}))(GoodsSelectModal);
