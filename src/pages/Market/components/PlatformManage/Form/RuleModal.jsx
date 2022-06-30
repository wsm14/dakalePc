import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { CONPON_RULES_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import CouponRulesManageDrawer from '../../CouponRulesManage/CouponRulesManageDrawer';

const RuleModal = (props) => {
  const { visible, form, dispatch, onClose, loading, ruleByPagelist, ruleList } = props;
  const { show = false, useScenesType = '' } = visible;

  const [selectItem, setSelectItem] = useState([]); // 选中项
  const [visibleSee, setVisibleSee] = useState(false);

  useEffect(() => {
    setSelectItem(ruleList);
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '规则类型',
      name: 'ruleType',
      type: 'select',
      select: CONPON_RULES_TYPE,
    },
    {
      label: '规则名称',
      name: 'ruleName',
    },
  ];

  //   表头
  const getColumns = [
    {
      title: '规则类型',
      width: 120,
      dataIndex: 'ruleType',
      render: (val) => CONPON_RULES_TYPE[val],
    },
    {
      title: '规则名称',
      ellipsis: true,
      dataIndex: 'ruleName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (val) => {
        const str = val.slice(2);
        return str && `${str}可用`;
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
    },
    {
      type: 'handle',
      width: 60,
      dataIndex: 'ruleId',
      render: (ruleId, row) => [
        {
          type: 'eye',
          auth: true,
          click: () => setVisibleSee({ type: 'info', show: true, row }),
        },
      ],
    },
  ];

  // 获取详情
  const fetchCouponDetail = (row, selected, list) => {
    dispatch({
      type: 'couponRulesManage/fetchRuleDetail',
      payload: { ruleId: row.ruleId },
      callback: ({ ruleConditions = [] }) => {
        // 获取端口是否是哒小团端口 做标记处理
        const wxDxt = ruleConditions.some((i) => i.condition === 'communityWechat');
        const newList = list.map((i) => (i['ruleId'] == row['ruleId'] ? { ...i, wxDxt } : i));
        hanleOnSelect(row, selected, newList);
      },
    });
  };

  const checkDisabled = (ruleType, ruleId) => {
    const ruleArr = selectItem.map((i) => i.ruleType);
    const seleId = selectItem.some((item) => item.ruleType === ruleType && item.ruleId !== ruleId);
    let areaRule,
      onleRule = false;
    // 可用区域和不可用区域规则互斥，只能选择一项，请修改。
    if (ruleArr.includes('availableAreaRule')) {
      areaRule = ruleType === 'unavailableAreaRule';
    }
    if (ruleArr.includes('unavailableAreaRule')) {
      areaRule = ruleType === 'availableAreaRule';
    }
    // 行业、店铺、商品的规则互斥，只能选择一项，请修改。
    if (ruleArr.includes('categoryRule')) {
      onleRule = ['merchantRule', 'goodsRule'].includes(ruleType);
    }
    if (ruleArr.includes('merchantRule')) {
      onleRule = ['categoryRule', 'goodsRule'].includes(ruleType);
    }
    if (ruleArr.includes('goodsRule')) {
      onleRule = ['categoryRule', 'merchantRule'].includes(ruleType);
    }
    return areaRule || onleRule || seleId;
  };

  /**
   * 获取当前所有数据 且保留 list 内不为undefind的数据
   * 当selected为true选中状态时 filter 返回true 保留数据
   * 当selected为false取消选中 排除当前点击项目
   */
  const hanleOnSelect = (row, selected, list) => {
    const obj = {};
    const allSelectList = [...selectItem, ...list].filter((i) =>
      selected ? i : i && i['ruleId'] !== row['ruleId'],
    );
    const allIdArr = allSelectList.map((i) => i['ruleId']); // 获取所有id
    // 去重数据
    const newSelectList = allSelectList
      .reduce((item, next) => {
        next && obj[next['ruleId']] ? '' : next && (obj[next['ruleId']] = true && item.push(next));
        return item;
      }, [])
      .filter((item) => item && allIdArr.includes(item['ruleId']));
    setSelectItem(newSelectList);
  };

  const modalProps = {
    title: '选择规则',
    destroyOnClose: true,
    width: 1000,
    visible: show,
    okText: `确定（已选${selectItem.length || 0}项）`,
    onOk: () => {
      const checkDxt = selectItem.some((i) => i.wxDxt);
      let obj = {};
      // 端口哒小团限制选择
      if (checkDxt) {
        obj = {
          classType: 'universal', // 券标签：商品通用券
          useScenesType: 'goodsBuy', // 券类型：商品券
          giveType: 'manual', // 发放方式 手动领取
          increaseRule: '0', // 是否可膨胀 不可
        };
      }
      form.setFieldsValue({ ruleList: selectItem, ...obj });
      onClose();
    },
    onCancel: () => {
      setSelectItem([]);
      onClose();
    },
  };

  return (
    <Modal {...modalProps}>
      <TableDataBlock
        noCard={false}
        scrollY={400}
        rowSelection={{
          selectedRowKeys: selectItem.map((i) => i.ruleId),
          hideSelectAll: true,
          onSelect: (row, selected, list) => {
            if (selected && row.ruleType === 'userOsRule') {
              fetchCouponDetail(row, selected, list);
              return;
            }
            hanleOnSelect(row, selected, list);
          },
          getCheckboxProps: ({ ruleType, ruleId }) => ({
            disabled: checkDisabled(ruleType, ruleId),
          }),
        }}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.ruleId}`}
        params={{ useScenesType: useScenesType, status: 1 }}
        dispatchType="platformCoupon/fetchListRuleByPage"
        {...ruleByPagelist}
      ></TableDataBlock>
      <CouponRulesManageDrawer
        visible={visibleSee}
        onClose={() => setVisibleSee(false)}
      ></CouponRulesManageDrawer>
    </Modal>
  );
};

export default connect(({ platformCoupon, loading }) => ({
  ruleByPagelist: platformCoupon.ruleByPagelist,
  loading:
    loading.effects['couponRulesManage/fetchRuleDetail'] ||
    loading.effects['platformCoupon/fetchListRuleByPage'],
}))(RuleModal);
