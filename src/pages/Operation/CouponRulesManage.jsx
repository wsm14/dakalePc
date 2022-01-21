import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import { CONPON_RULES_TYPE } from '@/common/constant';
import CouponRulesManageDrawer from './components/CouponRulesManage/CouponRulesManageDrawer';

const PlatformManage = (props) => {
  const { couponRuleslist, loading, dispatch } = props;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '规则名称',
      name: 'ruleName',
    },
    {
      label: '规则类型',
      type: 'select',
      name: 'ruleType',
      select: CONPON_RULES_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '规则类型',
      fixed: 'left',
      dataIndex: 'ruleType',
      render: (val) => CONPON_RULES_TYPE[val],
    },
    {
      title: '规则名称',
      fixed: 'left',
      dataIndex: 'ruleName',
    },
    {
      title: '最后修改人',
      dataIndex: 'updater',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      type: 'switch',
      render: (val, row) => {
        return {
          auth: 'status',
          show: !!val,
          checked: val === '1',
          onClick: () => fetchStatus({ ruleId: row.ruleId, status: 1 ^ Number(val) }),
        };
      },
    },
    {
      type: 'handle',
      width: 150,
      dataIndex: 'ruleId',
      render: (ruleId, row) => {
        return [
          {
            type: 'info',
            click: () => setVisible({ type: 'info', show: true, row }),
          },
          // {
          //   type: 'edit',
          //   click: () => fetchCouponDetail(platformCouponId, 'edit'),
          // },
        ];
      },
    },
  ];

  // 开关
  const fetchStatus = (payload) => {
    dispatch({
      type: 'couponRulesManage/fetchUpdateRuleStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 权限按钮
  const btnList = [
    {
      text: '新增',
      auth: 'save',
      onClick: () => setVisible({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={btnList}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.ruleId}`}
        dispatchType="couponRulesManage/fetchGetList"
        {...couponRuleslist}
      ></TableDataBlock>
      {/* 新增 编辑 详情 */}
      <CouponRulesManageDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></CouponRulesManageDrawer>
    </>
  );
};

export default connect(({ couponRulesManage, loading }) => ({
  couponRuleslist: couponRulesManage.list,
  loading:
    loading.effects['couponRulesManage/fetchGetList'] ||
    loading.effects['couponRulesManage/fetchRuleDetail'] ||
    loading.effects['couponRulesManage/fetchRuleDetailPage'] ||
    loading.effects['couponRulesManage/fetchUpdateRuleStatus'],
}))(PlatformManage);
