import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import { CONPON_RULES_BUSINESS_TYPE } from '@/common/constant';
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
  } = props;

  const childRef = useRef();

  const [tabKey, setTabKey] = useState('merchant');
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
      label: '名称',
      name: 'name',
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '行业',
      type: 'cascader',
      name: 'topCategoryId',
      changeOnSelect: true,
      select: categoryCascaderList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      valuesKey: ['topCategoryId', 'categoryId'],
      placeholder: '请选择行业',
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

  const modalProps = {
    title: '选择店铺（未激活、暂停营业、禁用不显示）',
    destroyOnClose: true,
    width: 1000,
    visible,
    okText: `确定（已选${selectItem.length || 0}项）`,
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
    onOk: () => {
      form.setFieldsValue({
        remark: `已选${selectItem.length}个${CONPON_RULES_BUSINESS_TYPE[tabKey]}`,
        ruleConditions: selectItem.map((item) => ({
          condition: item.id,
        })),
        subRuleType: tabKey,
      });
      setShopData({ subRuleType: tabKey, list: selectItem });
      onClose();
    },
    onCancel: onClose,
  };

  return (
    <Modal {...modalProps}>
      <TableDataBlock
        cardProps={{
          bordered: false,
          tabList:
            tabKey && selectItem.length
              ? [{ key: tabKey, tab: CONPON_RULES_BUSINESS_TYPE[tabKey] }]
              : Object.keys(CONPON_RULES_BUSINESS_TYPE).map((item) => ({
                  key: item,
                  tab: CONPON_RULES_BUSINESS_TYPE[item],
                })),
          activeTabKey: tabKey,
          onTabChange: (key) => {
            setTabKey(key);
            childRef.current.fetchGetData({ type: key });
          },
        }}
        rowSelection={{
          selectedRowKeys: selectItem.map((i) => i.id),
          onSelect: (row, selected, list) => {
            const obj = {};
            /**
             * 获取当前所有数据 且保留 list 内不为undefind的数据
             * 当selected为true选中状态时 filter 返回true 保留数据
             * 当selected为false取消选中 排除当前点击项目
             */
            const allSelectList = [...selectItem, ...list].filter((i) =>
              selected ? i : i && i['id'] !== row['id'],
            );
            const allIdArr = allSelectList.map((i) => i['id']); // 获取所有id
            // 去重数据
            const newSelectList = allSelectList
              .reduce((item, next) => {
                next && obj[next['id']] ? '' : next && (obj[next['id']] = true && item.push(next));
                return item;
              }, [])
              .filter((item) => item && allIdArr.includes(item['id']));
            setSelectItem(newSelectList);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            const obj = {};
            const allSelectList = [...selectItem, ...changeRows].filter((i) =>
              selected ? i : i && !changeRows.map((it) => it['id']).includes(i['id']),
            );
            const allIdArr = allSelectList.map((i) => i['id']); // 获取所有id
            // 去重数据
            const newSelectList = allSelectList
              .reduce((item, next) => {
                next && obj[next['id']] ? '' : next && (obj[next['id']] = true && item.push(next));
                return item;
              }, [])
              .filter((item) => item && allIdArr.includes(item['id']));
            setSelectItem(newSelectList);
          },
        }}
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.id}`}
        params={{ type: tabKey }}
        dispatchType="couponRulesManage/fetchGetGroupMreList"
        {...merGroList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ couponRulesManage, loading }) => ({
  categoryCascaderList: couponRulesManage.categoryCascaderList,
  merGroList: couponRulesManage.merGroList,
  loading: loading.effects['couponRulesManage/fetchGetGroupMreList'],
}))(VaneDrawer);
