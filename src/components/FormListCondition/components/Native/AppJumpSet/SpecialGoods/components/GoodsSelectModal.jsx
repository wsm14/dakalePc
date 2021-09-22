import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Input, Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom } from './CouponFreeDom';
import '../index.less';

const { TabPane } = Tabs;
const { Search } = Input;
/**
 * 选择特惠商品（单选）
 * @param {String} merchantId 商家id
 */
const GoodsSelectModal = (props) => {
  const { specialGoodsList = {}, merchantId, dispatch, visible, onClose, onOk, loading } = props;

  const [selectItem, setSelectItem] = useState({}); // 当前选择项
  const [tabKey, setTabKey] = useState('goods'); // tab类型
  const [searchValue, setSearchValue] = useState(''); // 搜索值

  useEffect(() => {
    if (visible) {
      if (tabKey === 'goods') fetchSpecialGoodsList();
    }
  }, [visible, tabKey]);

  const listProps = {
    goods: {
      list: specialGoodsList.list,
      total: specialGoodsList.total,
      key: 'specialGoodsId',
      loading: loading.effects['baseData/fetchGetSpecialGoodsSelect'],
    },
  }[tabKey];

  // 获取特惠活动
  const fetchSpecialGoodsList = () => {
    dispatch({
      type: 'baseData/fetchGetSpecialGoodsSelect',
      payload: {
        merchantId,
        goodsName: searchValue,
        goodsStatus: 1,
        page: 1,
        limit: 999,
      },
    });
  };

  const listDom = (
    <Spin spinning={listProps.loading}>
      {listProps?.list?.length ? (
        <div className="share_select_list">
          {listProps?.list.map(
            (item) =>
              ({
                goods: goodsDom(item, selectItem.specialGoodsId, setSelectItem),
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
      title={`选择特惠商品（单选）`}
      width={780}
      visible={visible}
      afterClose={() => setTabKey('goods')}
      maskStyle={{ background: 'none' }}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem[listProps.key],
      }}
      onOk={() => {
        onOk({ ...selectItem, promotionType: tabKey });
        onClose();
      }}
      onCancel={onClose}
    >
      <Tabs
        type="card"
        onChange={setTabKey}
        style={{ overflow: 'initial' }}
        tabBarExtraContent={
          <Search placeholder="请输入名称" enterButton allowClear onSearch={setSearchValue} />
        }
      >
        <TabPane tab="特惠商品" key="goods">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  specialGoodsList: baseData.specialGoods,
  loading,
}))(GoodsSelectModal);
