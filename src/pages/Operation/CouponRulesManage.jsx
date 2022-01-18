import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import { CONPON_RULES_TYPE } from '@/common/constant';
import CouponRulesManageDrawer from './components/CouponRulesManage/CouponRulesManageDrawer';

const PlatformManage = (props) => {
  const { platformCouponList, loading, dispatch } = props;
  const { list } = platformCouponList;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '规则名称',
      name: 'couponName',
    },
    {
      label: '规则类型',
      type: 'select',
      name: 'useScenesType',
      select: CONPON_RULES_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '规则类型',
      fixed: 'left',
      dataIndex: 'platformCouponId',
    },
    {
      title: '规则名称',
      fixed: 'left',
      dataIndex: 'couponName',
    },
    {
      title: '最后修改人',
      dataIndex: 'updateTime',
    },
    {
      title: '最后修改时间',
      dataIndex: 'remain',
    },
    {
      title: '启用状态',
      dataIndex: 'couponStatus',
      type: 'switch',
    },
    {
      type: 'handle',
      width: 150,
      dataIndex: 'platformCouponId',
      render: (platformCouponId, record) => {
        // 1 上架 2 下架
        const { couponStatus: status, endDate } = record;
        return [
          {
            type: 'info',
            click: () => fetchCouponDetail(platformCouponId, 'info'),
          },
          {
            type: 'edit',
            click: () => fetchCouponDetail(platformCouponId, 'edit'),
          },
        ];
      },
    },
  ];

  // 获取详情
  const fetchCouponDetail = (platformCouponId, type) => {
    dispatch({
      type: 'platformCoupon/fetchGetPlatformCouponDetail',
      payload: { platformCouponId },
      callback: (detail) => setVisible({ type, show: true, detail, platformCouponId }),
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
        rowKey={(record) => `${record.platformCouponId}`}
        dispatchType="platformCoupon/fetchGetList"
        {...platformCouponList}
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

export default connect(({ platformCoupon, loading }) => ({
  platformCouponList: platformCoupon.list,
  loading:
    loading.effects['platformCoupon/fetchGetList'] ||
    loading.effects['platformCoupon/fetchGetPlatformCouponDetail'],
}))(PlatformManage);
