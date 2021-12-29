import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Tooltip } from 'antd';
import {
  COUPON_STATUS,
  COUPON_TYPE,
  BUSINESS_TYPE,
  SUBMIT_TYPE,
  PLATFORM_TICKET_SCENE,
  PLATFORM_TICKET_TYPE,
  PLATFORM_COUPON_PEOPLE,
} from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import { getCityName } from '@/utils/utils';
import PlatformDrawer from './components/PlatformManage/PlatformDrawer';
import RemainModal from './components/PlatformManage/Detail/RemainModal';

const PlatformManage = (props) => {
  const { platformCouponList, loading, dispatch, loadings } = props;
  const { list } = platformCouponList;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  //下架原因框
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 下架原因
  const [visibleRemain, setVisibleRemain] = useState(false); //增加库存

  // 搜索参数
  const searchItems = [
    {
      label: '状态',
      type: 'select',
      name: 'ownerCouponStatus',
      select: COUPON_STATUS,
    },
    {
      label: '适用人群',
      name: 'ownerType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '最后修改时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '最后修改人',
      name: 'couponName',
    },
    {
      label: '用户所属地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '券编号',
      fixed: 'left',
      dataIndex: 'platformCouponId',
    },
    {
      title: '券类型/名称',
      fixed: 'left',
      dataIndex: 'couponName',
      render: (val, row) => (
        <div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Tag>{`${PLATFORM_TICKET_SCENE[row.useScenesType]}${
              PLATFORM_TICKET_TYPE[row.classType]
            }`}</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
        </div>
      ),
    },
    {
      title: '券价值/使用门槛',
      dataIndex: 'couponValue',
      render: (val, row) => <div>{`￥${val}（满${row.thresholdPrice}元可用）`}</div>,
    },
    {
      title: '券有效期',
      dataIndex: 'useTimeRule',
      render: (val, row) => {
        const { activeDate, endDate, delayDays, activeDays } = row;
        if (activeDate && endDate) {
          return activeDate + '~' + endDate;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      title: '剩余数量',
      dataIndex: 'remain',
    },
    {
      title: '适用人群',
      dataIndex: 'consortUser',
      render: (val) => PLATFORM_COUPON_PEOPLE[val],
    },
    {
      title: '使用地区限制',
      dataIndex: 'ruleConditionObjects',
      render: (val, row) => {
        const arr = val[0].ruleConditionList;
        if (arr[0].condition == 'all') {
          return '全国可用';
        } else if (val[0].ruleType === 'availableAreaRule') {
          return (
            <Tooltip
              placement="topLeft"
              title={arr.map((item) => {
                return <span key={item.ruleIdString}>{`${getCityName(item.condition)}、`}</span>;
              })}
            >
              部分地区可用
            </Tooltip>
          );
        } else {
          return (
            <Tooltip
              placement="topLeft"
              title={arr.map((item) => {
                return <span key={item.ruleIdString}>{`${getCityName(item.condition)}、`}</span>;
              })}
            >
              部分地区不可用
            </Tooltip>
          );
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'couponStatus',
      render: (val) => (val === '1' ? '上架中' : '已下架'),
    },
    {
      title: '最后修改',
      dataIndex: 'updateTime',
      render: (val, row) => `${val}\n${row.updater}`,
    },
    {
      type: 'handle',
      width: 150,
      dataIndex: 'platformCouponId',
      render: (platformCouponId, record) => {
        // 1 上架 2 下架
        const { couponStatus: status } = record;
        return [
          {
            type: 'info',
            click: () => fetchCouponDetail(platformCouponId, 'info'),
          },
          {
            type: 'edit',
            click: () => fetchCouponDetail(platformCouponId, 'edit'),
          },
          {
            title: '下架',
            auth: 'down',
            visible: ['1'].includes(status),
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: { ownerCouponId, ownerId },
                formProps: { type: 'down', key: 'offShelfReason' },
              }),
          },
          {
            title: '增加数量',
            type: 'addnum',
            visible: ['1'].includes(status),
            click: () => fetAddRemain(ownerCouponId, ownerId, record.remain),
          },
        ];
      },
    },
  ];

  // 增加库存
  const fetAddRemain = (ownerCouponId, ownerId, remain) => {
    setVisibleRemain({
      show: true,
      ownerCouponId,
      ownerId,
      remain,
    });
  };

  // 下架
  const fetchDownCoupon = (values) => {
    const { ownerCouponId, ownerId } = visibleRefuse.detail;
    dispatch({
      type: 'couponManage/fetchCouponOff',
      payload: {
        ...values,
        ownerCouponId,
        ownerId,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

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
        order
        keepData
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
      <PlatformDrawer
        childRef={childRef}
        visible={visible}
        total={list.length}
        getDetail={fetchCouponDetail}
        onClose={() => setVisible(false)}
      ></PlatformDrawer>
      {/* 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchDownCoupon}
        loading={loadings.models.couponManage}
        extra={'下架后不影响已购买的用户使用'}
      ></RefuseModal>
      {/* 增加数量 */}
      <RemainModal
        childRef={childRef}
        visible={visibleRemain}
        onClose={() => setVisibleRemain(false)}
      ></RemainModal>
    </>
  );
};

export default connect(({ platformCoupon, loading }) => ({
  platformCouponList: platformCoupon.list,
  loadings: loading,
  loading:
    loading.effects['platformCoupon/fetchGetList'] ||
    loading.effects['couponManage/fetchCouponSet'] ||
    loading.effects['couponManage/fetchCouponDetail'],
}))(PlatformManage);
