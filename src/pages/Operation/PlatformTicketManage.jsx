import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
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
  const { platformCouponList, loading, dispatch } = props;
  const { list } = platformCouponList;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  const [visibleRemain, setVisibleRemain] = useState(false); //增加库存

  // 搜索参数
  const searchItems = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '券编号',
      name: 'platformCouponId',
    },
    {
      label: '券类型',
      type: 'select',
      name: 'useScenesTypeOrclassType',
      select: { ...PLATFORM_TICKET_SCENE, ...PLATFORM_TICKET_TYPE },
    },
    {
      label: '状态',
      type: 'select',
      name: 'couponStatus',
      select: COUPON_STATUS,
    },
    {
      label: '适用人群',
      name: 'consortUser',
      type: 'select',
      select: PLATFORM_COUPON_PEOPLE,
    },
    {
      label: '最后修改时间',
      type: 'rangePicker',
      name: 'updateTimeBegin',
      end: 'updateTimeEnd',
    },
    {
      label: '最后修改人',
      name: 'updater',
    },
    {
      label: '可使用区域',
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
            <Tag style={{ borderRadius: 11 }} color="#87d068">{`${
              PLATFORM_TICKET_SCENE[row.useScenesType]
            }${PLATFORM_TICKET_TYPE[row.classType]}`}</Tag>
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
          {
            title: '下架',
            auth: 'down',
            visible: ['1'].includes(status),
            click: () => fetchDownCoupon(platformCouponId, 'down'),
          },
          {
            title: '上架',
            auth: 'up',
            pop: true,
            visible: ['2'].includes(status) && (endDate ? moment().isBefore(endDate) : true),
            click: () => fetchDownCoupon(platformCouponId, 'up'),
          },
          {
            title: '增加数量',
            type: 'addnum',
            visible: ['1'].includes(status),
            click: () => fetAddRemain(platformCouponId, record.remain),
          },
        ];
      },
    },
  ];

  // 增加库存
  const fetAddRemain = (platformCouponId, remain) => {
    setVisibleRemain({
      show: true,
      platformCouponId,
      remain,
    });
  };

  // 下架、上架
  const fetchDownCoupon = (platformCouponId, type) => {
    const url = {
      down: 'platformCoupon/fetchPlatformCouponOff',
      up: 'platformCoupon/fetchPlatformCouponOn',
    };
    dispatch({
      type: url[type],
      payload: {
        platformCouponId,
      },
      callback: () => childRef.current.fetchGetData(),
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
