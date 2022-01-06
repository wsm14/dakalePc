import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { checkCityName } from '@/utils/utils';
import { MARK_CARD_MAIN_TYPE, MARK_CARD_OPEN_STATE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PointManageDrawer from './components/PointManage/PointManageDrawer';

const PointManage = (props) => {
  const { pointManageList, loading, dispatch } = props;

  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏 detail 详情 }
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '主体',
      name: 'name',
      placeholder: '请输入主体名称',
    },
    {
      label: '所属地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '主体编号',
      fixed: 'left',
      dataIndex: 'hittingMainId',
    },
    {
      title: '主体名称',
      dataIndex: 'name',
    },
    {
      title: '主体类型',
      dataIndex: 'hittingMainType',
      render: (val) => MARK_CARD_MAIN_TYPE[val],
    },
    {
      title: '所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '打卡范围',
      dataIndex: 'distanceFlag',
      render: (val, row) => (val === '0' ? '不限' : `周围${row.range}米`),
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      render: (val) => MARK_CARD_OPEN_STATE[val],
    },
    {
      title: '最后修改',
      dataIndex: 'updater',
      render: (val, row) => val || row.creator,
    },
    {
      title: '设置',
      fixed: 'right',
      type: 'handle',
      dataIndex: 'hittingMainId',
      render: () => {
        return [
          {
            type: 'point',
            click: () => fetchCouponDetail(hittingMainId, 'info'),
          },
          {
            type: 'award',
            click: () => fetchCouponDetail(hittingMainId, 'info'),
          },
          {
            type: 'advert',
            click: () => fetchCouponDetail(hittingMainId, 'info'),
          },
        ];
      },
    },
    {
      type: 'handle',
      width: 150,
      dataIndex: 'hittingMainId',
      render: (platformCouponId, record) => {
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
            type: 'signDetail',
            click: () => fetAddRemain(platformCouponId, record.remain),
          },
        ];
      },
    },
  ];

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
        rowKey={(record) => `${record.hittingMainId}`}
        dispatchType="pointManage/fetchGetList"
        {...pointManageList}
      ></TableDataBlock>
      {/* 新增 编辑 详情 */}
      <PointManageDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></PointManageDrawer>
    </>
  );
};

export default connect(({ pointManage, loading }) => ({
  pointManageList: pointManage.list,
  loading:
    loading.effects['platformCoupon/fetchGetList'] ||
    loading.effects['platformCoupon/fetchGetPlatformCouponDetail'],
}))(PointManage);
