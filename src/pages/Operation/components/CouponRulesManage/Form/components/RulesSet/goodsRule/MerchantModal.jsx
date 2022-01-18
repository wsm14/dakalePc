import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Card, Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import { CONPON_RULES_GOODS_TYPE, SPECIAL_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const VaneDrawer = (props) => {
  const {
    visible,
    form,
    dispatch,
    onClose,
    loading,
    merGroList,
    categoryCascaderList,
    shopData,
    setShopData,
    specialGoodsList = {},
    couponList = {},
    platformEquityList = {},
  } = props;

  const childRef = useRef();

  const [tabKey, setTabKey] = useState('specialGoods');
  const [selectItem, setSelectItem] = useState([]); // 选中项

  useEffect(() => {
    if (visible) {
      setTabKey(shopData['subRuleType']);
      setSelectItem(shopData['list']);
    }
  }, [visible]);

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 经营类目
  const fetchTradeList = () => {
    dispatch({
      type: 'couponRulesManage/fetchConponListCategory',
    });
  };

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
      select: SPECIAL_STATUS,
    },
  ];

  //   表头
  const getColumns = [
    {
      title: '店铺类型',
      dataIndex: 'groupType',
    },
    {
      title: '店铺名称',
      dataIndex: 'name',
    },
    {
      title: '店铺ID',
      dataIndex: 'id',
    },
    {
      title: '经营类目',
      dataIndex: 'topCategoryName',
    },
    {
      title: '地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '详细地址',
      dataIndex: 'address',
    },
  ];

  const listProps = {
    specialGoods: {
      dispatchType: 'baseData/fetchGetSpecialGoodsSelect',
      totalList: specialGoodsList,
      params: { activityType: 'specialGoods', deleteFlag: 1 },
    },
    reduceCoupon: {
      dispatchType: 'baseData/fetchGetBuyCouponSelect',
      totalList: couponList,
      params: { buyFlag: 1 },
    },
    commerceGoods: {
      dispatchType: 'baseData/fetchGetPlatformCommerceGoodsSelect',
      totalList: platformEquityList,
      params: { activityType: 'commerceGoods' },
    },
  }[tabKey];

  const modalProps = {
    title: '选择店铺（未激活、暂停营业、禁用不显示）',
    destroyOnClose: true,
    width: 1000,
    visible,
    okText: `确定（已选${selectItem.length || 0}项）`,
    bodyStyle: { overflowY: 'auto', maxHeight: 800 },
    onOk: () => {
      form.setFieldsValue({
        remark: `已选${selectItem.length}个${CONPON_RULES_GOODS_TYPE[tabKey]}`,
        ruleConditions: selectItem,
        subRuleType: tabKey,
      });
      setShopData({ subRuleType: tabKey, list: selectItem });
      onClose();
    },
    onCancel: onClose,
  };

  return (
    <Modal {...modalProps}>
      <Card
        tabList={
          tabKey && selectItem.length
            ? [{ key: tabKey, tab: CONPON_RULES_GOODS_TYPE[tabKey] }]
            : Object.keys(CONPON_RULES_GOODS_TYPE).map((item) => ({
                key: item,
                tab: CONPON_RULES_GOODS_TYPE[item],
              }))
        }
        activeTabKey={tabKey}
        onTabChange={(key) => {
          setTabKey(key);
          // childRef.current.fetchGetData({ type: key });
        }}
        bordered={false}
      >
        {['specialGoods', 'reduceCoupon', 'commerceGoods'].includes(tabKey) ? (
          <TableDataBlock
            noCard={false}
            rowSelection={{
              selectedRowKeys: selectItem.map((i) => i.id),
              onChange: (val, list) => {
                // 先去重处理 排除重复已选数据
                // 再对 已选的数据和最新数据进行去重处理 获得去重后结果
                const obj = {};
                const newSelectList = [...selectItem, ...list].reduce((item, next) => {
                  next && obj[next['id']]
                    ? ''
                    : next && (obj[next['id']] = true && item.push(next));
                  return item;
                }, []);
                // .filter((item) => item && val.includes(item['id']));
                setSelectItem(newSelectList);
              },
            }}
            cRef={childRef}
            loading={loading}
            searchItems={searchItems}
            columns={getColumns}
            rowKey={(record) => `${record.id}`}
            params={listProps.params}
            dispatchType={listProps.dispatchType}
            {...listProps.totalList}
          ></TableDataBlock>
        ) : null}
      </Card>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  specialGoodsList: baseData.specialGoods,
  couponList: baseData.buyCoupon,
  platformEquityList: baseData.platformEquity,
  loading:
    loading.effects['baseData/fetchGetSpecialGoodsSelect'] ||
    loading.effects['baseData/fetchGetBuyCouponSelect'] ||
    loading.effects['baseData/fetchGetPlatformCommerceGoodsSelect'],
}))(VaneDrawer);
