import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Modal, notification } from 'antd';
import { CONPON_RULES_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import CouponRulesManageDrawer from '../../CouponRulesManage/CouponRulesManageDrawer';

const RuleModal = (props) => {
  const { visible, form, dispatch, onClose, loading, ruleByPagelist, ruleList, setRuleList } =
    props;
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
      dataIndex: 'ruleType',
      render: (val) => CONPON_RULES_TYPE[val],
    },
    {
      title: '规则名称',
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

  const modalProps = {
    title: '选择规则',
    destroyOnClose: true,
    width: 1000,
    visible: show,
    okText: `确定（已选${selectItem.length || 0}项）`,
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
    onOk: () => {
      selectItem.some((i) => i.ruleType === 'availableAreaRule') &&
      selectItem.some((i) => i.ruleType === 'unavailableAreaRule')
        ? notification.info({
            message: '温馨提示',
            description: '可用区域和不可用区域规则互斥，只能选择一项，请修改。',
          })
        : selectItem.some((i) => i.ruleType === 'categoryRule') +
            selectItem.some((i) => i.ruleType === 'merchantRule') +
            selectItem.some((i) => i.ruleType === 'goodsRule') >
          1
        ? notification.info({
            message: '温馨提示',
            description: '行业、店铺、商品的规则互斥，只能选择一项，请修改。',
          })
        : (setRuleList(selectItem),
          form.setFieldsValue({
            ruleList: selectItem,
          }),
          onClose());
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
        rowSelection={{
          selectedRowKeys: selectItem.map((i) => i.ruleId),
          onSelect: (row, selected, list) => {
            const obj = {};
            /**
             * 获取当前所有数据 且保留 list 内不为undefind的数据
             * 当selected为true选中状态时 filter 返回true 保留数据
             * 当selected为false取消选中 排除当前点击项目
             */
            const allSelectList = [...selectItem, ...list].filter((i) =>
              selected ? i : i && i['ruleId'] !== row['ruleId'],
            );
            const allIdArr = allSelectList.map((i) => i['ruleId']); // 获取所有id
            // 去重数据
            const newSelectList = allSelectList
              .reduce((item, next) => {
                next && obj[next['ruleId']]
                  ? ''
                  : next && (obj[next['ruleId']] = true && item.push(next));
                return item;
              }, [])
              .filter((item) => item && allIdArr.includes(item['ruleId']));
            setSelectItem(newSelectList);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            const obj = {};
            const allSelectList = [...selectItem, ...changeRows].filter((i) =>
              selected ? i : i && !changeRows.map((it) => it['ruleId']).includes(i['ruleId']),
            );
            const allIdArr = allSelectList.map((i) => i['ruleId']); // 获取所有id
            // 去重数据
            const newSelectList = allSelectList
              .reduce((item, next) => {
                next && obj[next['ruleId']]
                  ? ''
                  : next && (obj[next['ruleId']] = true && item.push(next));
                return item;
              }, [])
              .filter((item) => item && allIdArr.includes(item['ruleId']));
            setSelectItem(newSelectList);
          },
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
  loading: loading.effects['platformCoupon/fetchListRuleByPage'],
}))(RuleModal);
