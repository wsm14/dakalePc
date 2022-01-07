import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { COUPON_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import SpreeDrawer from './components/SpreeManage/SpreeDrawer';
import RemainModal from './components/SpreeManage/Detail/RemainModal';
import GetRecordModal from './components/SpreeManage/Detail/GetRecordModal';
import TagModal from './components/SpreeManage/TypeSet/TagModal';

const SpreeManage = (props) => {
  const { spreeManageList, loading, dispatch, giftTypeList } = props;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  const [visibleRemain, setVisibleRemain] = useState(false); //增加库存
  const [visibleCancelRecord, setVisibleCancelRecord] = useState(false); // 领取明细
  const [visibleTag, setVisibleTag] = useState(false); // 礼包类型设置隐藏

  useEffect(() => {
    dispatch({
      type: 'spreeManage/fetchListGiftType',
    });
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '礼包名称',
      name: 'giftName',
    },
    {
      label: '礼包类型',
      type: 'select',
      name: 'giftTypeId',
      select: giftTypeList,
      fieldNames: {
        label: 'typeName',
        value: 'giftTypeId',
      },
    },
    {
      label: '状态',
      type: 'select',
      name: 'giftStatus',
      select: COUPON_STATUS,
    },
    {
      label: '发放时间段',
      type: 'rangePicker',
      name: 'grantTimeBegin',
      end: 'grantTimeEnd',
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
      title: '礼包类型',
      fixed: 'left',
      dataIndex: 'giftTypeId',
      render: (val) => giftTypeList.filter((i) => i.giftTypeId == val)[0]?.typeName,
    },
    {
      title: '礼包名称',
      fixed: 'left',
      dataIndex: 'giftName',
    },
    {
      title: '礼包价格/价值',
      dataIndex: 'giftValue',
      render: (val, row) =>
        row.buyPrice == '' ? (
          <div>{`免费（价值${val}元）`}</div>
        ) : (
          <div>{`￥${row.buyPrice}（价值${val}元）`}</div>
        ),
    },
    {
      title: '剩余数量',
      dataIndex: 'remain',
    },
    {
      title: '发放时间段',
      dataIndex: 'useTimeRule',
      render: (val, row) => {
        const { activeDate, endDate } = row;
        return activeDate + '~' + endDate;
      },
    },
    {
      title: '状态',
      dataIndex: 'giftStatus',
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
      dataIndex: 'platformGiftId',
      render: (platformGiftId, record) => {
        // 1 上架 2 下架
        const { giftStatus: status, endDate } = record;
        return [
          {
            type: 'info',
            click: () => fetchCouponDetail(platformGiftId, 'info'),
          },
          {
            type: 'edit',
            click: () => fetchCouponDetail(platformGiftId, 'edit'),
          },
          {
            title: '下架',
            auth: 'down',
            pop: true,
            popText: (
              <div style={{ width: 200 }}>
                {'确定要下架吗？请确认该礼包未投放到资源位，否则用户将无法领取或购买。'}
              </div>
            ),
            visible: ['1'].includes(status),
            click: () => fetchDownCoupon(platformGiftId, 'down'),
          },
          {
            title: '上架',
            auth: 'up',
            pop: true,
            visible: ['2'].includes(status) && (endDate ? moment().isBefore(endDate) : true),
            click: () => fetchDownCoupon(platformGiftId, 'up'),
          },
          {
            title: '增加数量',
            type: 'addnum',
            click: () => fetAddRemain(platformGiftId, record.remain),
          },
          {
            title: '领取明细',
            type: 'getRecord',
            click: () => setVisibleCancelRecord({ show: true, detail: record }),
          },
        ];
      },
    },
  ];

  // 增加库存
  const fetAddRemain = (platformGiftId, remain) => {
    setVisibleRemain({
      show: true,
      platformGiftId,
      remain,
    });
  };

  // 下架、上架
  const fetchDownCoupon = (platformGiftId, type) => {
    const url = {
      down: 'spreeManage/fetchShelfPlatformGiftPackOff',
      up: 'spreeManage/fetchShelfPlatformGiftPackOn',
    };
    dispatch({
      type: url[type],
      payload: {
        platformGiftId,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 获取详情
  const fetchCouponDetail = (platformGiftId, type) => {
    dispatch({
      type: 'spreeManage/fetchGetPlatformGiftPackDetail',
      payload: { platformGiftId },
      callback: (detail) => setVisible({ type, show: true, detail, platformGiftId }),
    });
  };

  // 权限按钮
  const btnList = [
    {
      text: '礼包类型设置',
      auth: 'set',
      onClick: () => setVisibleTag({ show: true }),
    },
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
        rowKey={(record) => `${record.platformGiftId}`}
        dispatchType="spreeManage/fetchGetList"
        {...spreeManageList}
      ></TableDataBlock>
      {/* 新增 编辑 详情 */}
      <SpreeDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></SpreeDrawer>
      {/* 增加数量 */}
      <RemainModal
        childRef={childRef}
        visible={visibleRemain}
        onClose={() => setVisibleRemain(false)}
      ></RemainModal>
      {/* 领取明细 */}
      <GetRecordModal
        visible={visibleCancelRecord}
        onClose={() => setVisibleCancelRecord(false)}
      ></GetRecordModal>
      {/* 礼包类型设置 */}
      <TagModal visible={visibleTag} onClose={() => setVisibleTag(false)}></TagModal>
    </>
  );
};

export default connect(({ spreeManage, loading }) => ({
  spreeManageList: spreeManage.list,
  giftTypeList: spreeManage.giftTypeList,
  loading:
    loading.effects['spreeManage/fetchGetList'] ||
    loading.effects['spreeManage/fetchGetPlatformGiftPackDetail'],
}))(SpreeManage);
