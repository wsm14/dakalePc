import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import { checkCityName } from '@/utils/utils';
import PointQrCode from '../Detail/Point/PointQrCode';
import PointDrawer from '../Detail/Point/PointDrawer';
import PointManageModal from '../PointManageModal';

// 点位列表
const PointList = (props) => {
  const { pointList, loading, dispatch } = props;
  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏  }
  const [visible, setVisible] = useState(false);
  const [visibleQrCode, setVisibleQrCode] = useState(false); // 二维码
  const [visibleModalDrawer, setVisibleModalDrawer] = useState(false);

  // z主体搜索参数
  const searchItems = [
    {
      label: '点位',
      name: 'name',
    },
    {
      label: '归属人手机号',
      name: 'mobile',
    },
    {
      label: '点位类型',
      name: 'type',
      type: 'select',
    },
    {
      label: '点位地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '用户手机号',
      name: 'phone',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '点位ID',
      fixed: 'left',
      dataIndex: 'hittingId',
    },
    {
      title: '点位名称',
      dataIndex: 'name',
      render: (val) => (
        <Ellipsis length={8} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '归属人姓名',
      dataIndex: 'name',
    },
    {
      title: '归属人手机号',
      dataIndex: 'name',
    },
    {
      title: '点位地址',
      dataIndex: 'address',
    },
    {
      title: '类型',
      dataIndex: 'distanceFlag',
    },
    {
      title: '用户昵称',
      dataIndex: 'username',
    },
    {
      title: '用户手机号',
      dataIndex: 'name',
    },
    {
      title: '关联主体',
      dataIndex: 'name',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ['停用', '启用'][val],
    },
    {
      type: 'handle',
      dataIndex: 'hittingId',
      render: (hittingId, record) => {
        return [
          {
            type: 'edit',
            click: () => fetchPointDetail(hittingId, 'edit'),
          },
          {
            title: '下载打卡码',
            auth: true,
            type: 'qrCode',
            click: () => setVisibleQrCode({ show: true, detail: { ...record } }),
          },
          {
            type: 'signDetail', //打卡明细
            click: () => setVisibleModalDrawer({ show: true, detail: record, type: 'signDetail' }),
          },
        ];
      },
    },
  ];

  // 获取点位详情
  const fetchPointDetail = (hittingId, type) => {
    dispatch({
      type: 'pointManage/fetchGetHittingById',
      payload: {
        hittingId,
      },
      callback: (detail) => {
        setVisible({ type, show: true, detail, hittingId });
      },
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
        order
        cRef={childRef}
        noCard={false}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.hittingId}`}
        dispatchType="pointManage/fetchListHitting"
        {...pointList}
      ></TableDataBlock>
      {/* 新增 编辑 详情 */}
      <PointDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></PointDrawer>
      <PointQrCode visible={visibleQrCode} onClose={() => setVisibleQrCode(false)}></PointQrCode>
      {/* 打卡明细  点位 */}
      <PointManageModal
        visible={visibleModalDrawer}
        onClose={() => setVisibleModalDrawer(false)}
      ></PointManageModal>
    </>
  );
};
export default connect(({ pointManage, loading }) => ({
  pointList: pointManage.pointList,
  loading: loading.effects['pointManage/fetchListHitting'],
}))(PointList);
