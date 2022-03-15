import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import Ellipsis from '@/components/Ellipsis';
import { HITTING_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import { checkCityName } from '@/utils/utils';
import PointQrCode from '../Detail/Point/PointQrCode';
import PointDrawer from '../Detail/Point/PointDrawer';
import PointManageModal from '../PointManageModal';

// 点位列表
const PointList = (props) => {
  const { pointList, loading, dispatch, bodyList = [], tabKey, detail = {} } = props;

  const { list = [] } = pointList;
  const childRef = useRef();
  // 操作弹窗{ type: info 详情 show 显示隐藏  }
  const [visible, setVisible] = useState(false);
  const [visibleQrCode, setVisibleQrCode] = useState(false); // 二维码
  const [visibleModalDrawer, setVisibleModalDrawer] = useState(false);
  // 搜索主体
  const fetchGetMre = debounce((name) => {
    if (!name.replace(/'/g, '')) return;
    dispatch({
      type: 'baseData/fetchListHittingMain',
      payload: {
        name: name.replace(/'/g, ''),
      },
    });
  }, 500);

  // z主体搜索参数
  const searchItems = [
    {
      label: '点位名称',
      name: 'name',
    },
    {
      label: '关联主体',
      name: 'mainId',
      type: 'select',
      select: bodyList,
      onSearch: fetchGetMre,
    },
    {
      label: '点位地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
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
      title: '点位地址',
      dataIndex: 'address',
    },
    {
      title: '关联主体',
      dataIndex: 'mainName',
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
      render: (hittingId, record, index) => {
        return [
          {
            type: 'info',
            click: () => fetchPointDetail(index, 'info'),
          },
          {
            type: 'edit',
            click: () => fetchPointDetail(index, 'edit'),
          },
          {
            title: '下载打卡码',
            auth: true,
            type: 'qrCode',
            click: () => setVisibleQrCode({ show: true, detail: { ...record } }),
          },
          {
            type: 'signDetail', //打卡明细
            click: () =>
              setVisibleModalDrawer({ show: true, detail: record, type: 'signDetail', tabKey }),
          },
        ];
      },
    },
  ];

  // 获取点位详情
  const fetchPointDetail = (index, type) => {
    const { hittingId } = list[index];
    dispatch({
      type: 'pointManage/fetchGetHittingById',
      payload: {
        hittingId,
      },
      callback: (detail) => {
        if (type === 'info') {
          setVisible({ type, show: true, index, detail, hittingId });
        } else {
          setVisible({ type, show: true, detail, hittingId });
        }
      },
    });
  };

  // 权限按钮
  const btnList = [
    {
      text: '新增',
      auth: 'save',
      show: detail?.status !== '0',
      onClick: () => setVisible({ type: 'add', show: true, detail }),
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
        params={{ mainId: detail?.hittingMainId }}
        {...pointList}
      ></TableDataBlock>
      {/* 新增 编辑 详情 */}
      <PointDrawer
        childRef={childRef}
        visible={visible}
        total={list.length}
        getDetail={fetchPointDetail}
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
export default connect(({ pointManage, baseData, loading }) => ({
  pointList: pointManage.pointList,
  bodyList: baseData.bodyList,
  loading: loading.effects['pointManage/fetchListHitting'],
}))(PointList);
