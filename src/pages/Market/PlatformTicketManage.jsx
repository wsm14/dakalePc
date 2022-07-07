import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Tag } from 'antd';
import {
  COUPON_STATUS,
  PLATFORM_TICKET_TYPE,
  PLATFORM_TICKET_SCENE,
  COUPON_GIVE_TYPE,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import PlatformDrawer from './components/PlatformManage/PlatformDrawer';
import RemainModal from './components/PlatformManage/Detail/RemainModal';
import GiveUserCoupon from './components/PlatformManage/Give/GiveUserCoupon';

const PlatformManage = (props) => {
  const { platformCouponList, loading, dispatch } = props;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  const [visibleRemain, setVisibleRemain] = useState(false); //增加库存

  const [visibleGive, setVisibleGive] = useState(false); //赠送
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
      name: 'useScenesType',
      select: PLATFORM_TICKET_SCENE,
    },
    {
      label: '发放方式',
      type: 'select',
      name: 'giveType',
      select: COUPON_GIVE_TYPE,
    },
    {
      label: '状态',
      type: 'select',
      name: 'couponStatus',
      select: COUPON_STATUS,
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
  ];

  // table 表头
  const getColumns = [
    {
      title: '券类型/名称/编号',
      fixed: 'left',
      dataIndex: 'couponName',
      render: (val, row) => (
        <div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Tag style={{ borderRadius: 11 }} color="#87d068">{`${
              PLATFORM_TICKET_TYPE[row.useScenesType][row.classType]
            }`}</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div style={{ color: '#ccc' }}>{row.platformCouponId}</div>
        </div>
      ),
    },
    {
      title: '券价值/使用门槛/券描述',
      dataIndex: 'couponValue',
      render: (val, row) => (
        <div>
          <div>{`￥${val}（满${row.thresholdPrice}元可用）`}</div>
          <div style={{ color: '#999', fontSize: '12px' }}>
            <Ellipsis length={15} tooltip>
              {row.couponDesc}
            </Ellipsis>
          </div>
        </div>
      ),
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
      title: '发放方式',
      dataIndex: 'giveType',
      render: (val) => COUPON_GIVE_TYPE[val],
    },
    {
      title: '剩余数量',
      dataIndex: 'remain',
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
        const { couponStatus: status, endDate, giveType } = record;
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
            title: '赠送',
            auth: true,
            visible: ['1'].includes(status) && ['system'].includes(giveType),
            click: () => fetchCouponGive(record),
          },
          {
            title: '下架',
            auth: 'down',
            pop: true,
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

  //赠送
  const fetchCouponGive = (record) => {
    setVisibleGive({ show: true, detail: record });
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
      <PlatformDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></PlatformDrawer>
      {/* 增加数量 */}
      <RemainModal
        childRef={childRef}
        visible={visibleRemain}
        onClose={() => setVisibleRemain(false)}
      ></RemainModal>

      {/* 赠送弹窗 */}
      <GiveUserCoupon
        visible={visibleGive}
        onClose={() => {
          setVisibleGive({ show: false });
        }}
        childRef={childRef}
      ></GiveUserCoupon>
    </>
  );
};

export default connect(({ platformCoupon, loading }) => ({
  platformCouponList: platformCoupon.list,
  loading:
    loading.effects['platformCoupon/fetchGetList'] ||
    loading.effects['platformCoupon/fetchGetPlatformCouponDetail'],
}))(PlatformManage);
