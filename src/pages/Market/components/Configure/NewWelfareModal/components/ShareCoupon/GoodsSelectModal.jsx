import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { Modal, Empty, Spin, Tabs } from 'antd';
import { goodsDom } from './CouponFreeDom';
import SearchCondition from '@/components/SearchCondition';
import './index.less';

const { TabPane } = Tabs;
/**
 * 选择电商品（多选）
 */
const GoodsSelectModal = (props) => {
  const {
    platformEquityList = {},
    form,
    dispatch,
    visible,
    onClose,
    loading,
    typeGoods = 'commerceGoods',
    selectList,
  } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项

  useEffect(() => {
    if (visible) {
      setSelectItem(form.getFieldValue(typeGoods) || []);
      dispatch({ type: 'baseData/clearPlatformEquity' });
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '选择店铺',
      name: 'id',
      type: 'select',
      select: selectList,
      allItem: false,
      onSearch: (val) => fetchClassifyGetMre(val),
      loading: loading.effects['baseData/fetchGetGroupMreList'],
      placeholder: '请选择店铺',
      required: true,
    },
    {
      label: '券名称',
      name: 'goodsName',
    },
  ];

  // 搜索店铺
  const fetchClassifyGetMre = debounce((name) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        type: 'merchant',
        name,
      },
    });
  }, 500);

  const listProps = {
    list: platformEquityList.list,
    total: platformEquityList.total,
    key: 'activityGoodsId',
    loading: loading.effects['baseData/fetchGetPlatformCommerceGoodsSelect'],
  };

  // 获取特惠活动
  const fetchSpecialGoodsList = (data) => {
    if (!data?.id) return;
    dispatch({
      type: 'baseData/fetchGetPlatformCommerceGoodsSelect',
      payload: {
        buyFlag: 1,
        relateId: data.id,
        relateType: 'merchant',
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
          {listProps?.list.map((item) =>
            goodsDom(
              item,
              selectItem.map((item) => item.activityGoodsId),
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
      title={`选择电商品（已选 ${selectItem.length}）`}
      width={1125}
      visible={visible}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      zIndex={1002}
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
      <Tabs type="card" style={{ overflow: 'initial' }}>
        <TabPane tab={'电商商品'} key="goods">
          {listDom}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.groupMreList,
  platformEquityList: baseData.platformEquity,
  loading,
}))(GoodsSelectModal);
