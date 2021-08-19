import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import '../index.less';

const { TabPane } = Tabs;
/**
 * 选择券（多选）
 */
const GoodsSelectModal = (props) => {
  const { coupon = [], form, dispatch, visible, onClose, loading } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState('coupon'); // tab类型
  const [ownerType, setOwnerType] = useState();

  useEffect(() => {
    if (visible) {
      if (tabKey === 'coupon') {
        setSelectItem(form.getFieldValue('list') || []);
      }
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '选择店铺',
      name: 'ownerId',
      type: 'merchant',
      col: false,
      onChange: (val, op) => setOwnerType(op.option.option.merchantType),
    },
  ];

  const listProps = {
    coupon: {
      list: coupon,
      key: 'ownerCouponIdString',
    },
  }[tabKey];

  // 获取特惠活动
  const fetchCouponSelect = (data) => {
    if (!data.ownerId) return;
    dispatch({
      type: 'activeTemplate/fetchCouponSelect',
      payload: {
        ...data,
        ownerType,
        page: 1,
        limit: 999,
      },
    });
  };

  // 选择商品逻辑
  const handleSelect = (item) => {
    if (selectItem.length >= 50) return;
    const key = 'ownerCouponIdString';
    if (selectItem.findIndex((ci) => ci[key] === item[key]) > -1) {
      setSelectItem(selectItem.filter((ci) => ci[key] !== item[key]));
    } else setSelectItem([...selectItem, item]);
  };

  const listDom = (
    <Spin spinning={!!loading.effects['activeTemplate/fetchCouponSelect']}>
      {listProps?.list?.length ? (
        <div className="share_select_list">
          {listProps?.list.map(
            (item) =>
              ({
                coupon: goodsDom(item, selectItem, handleSelect, 'valuable'),
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
      title={`选择券（已选 ${selectItem.length}）`}
      width={1125}
      visible={visible}
      afterClose={() => setTabKey('coupon')}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        form.setFieldsValue({ list: selectItem });
        onClose();
      }}
      onCancel={onClose}
    >
      <SearchCondition searchItems={searchItems} handleSearch={fetchCouponSelect}></SearchCondition>
      <Tabs type="card" onChange={setTabKey} style={{ overflow: 'initial' }}>
        <TabPane tab="有价券" key="coupon">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ activeTemplate, loading }) => ({
  coupon: activeTemplate.coupon,
  loading,
}))(GoodsSelectModal);
