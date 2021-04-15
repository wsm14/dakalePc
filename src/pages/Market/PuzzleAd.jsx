import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button, Tooltip } from 'antd';
import { PUZZLE_AD_TYPE, PUZZLE_AD_STATUS, BANNER_AREA_TYPE } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import PuzzleAdSet from './components/PuzzleAd/PuzzleAdSet';
import PuzzleAdRoot from './components/PuzzleAd/PuzzleAdRoot';

const PuzzleAd = (props) => {
  const { puzzleAd, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState({ show: false, info: '' }); // 拼图广告设置
  const [visibleRoot, setVisibleRoot] = useState(false); // 拼图广告设置

  // 搜索参数
  const searchItems = [
    {
      label: '品牌名',
      name: 'brandName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      render: (val) => PUZZLE_AD_TYPE[val],
    },
    {
      title: '品牌名',
      align: 'center',
      dataIndex: 'brandName',
    },
    {
      title: '说明',
      align: 'center',
      dataIndex: 'description',
    },
    {
      title: '投放区域',
      align: 'center',
      dataIndex: 'deliveryAreaType',
      render: (val, row) =>
        ({
          all: BANNER_AREA_TYPE[val],
          detail: <Tooltip title={row.deliveryAreaNameStr}>按区县({row.deliveryAreaNum})</Tooltip>,
        }[val]),
    },
    {
      title: '展示时间',
      align: 'center',
      dataIndex: 'startShowTime',
      render: (val, row) => `${val} ~ ${row.endShowTime}`,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => PUZZLE_AD_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'puzzleAdsId',
      align: 'right',
      fixed: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'down',
              visible: record.status === '1',
              click: () => fetchPuzzleAdSet({ puzzleAdsId: val, status: 0 }),
            },
            {
              type: 'info',
              visible: record.status === '1',
              click: () => fetchDetail('info', val, record),
            },
            {
              type: 'up',
              visible: record.status === '0',
              click: () => fetchPuzzleAdSet({ puzzleAdsId: val, status: 1 }),
            },
            {
              type: 'edit',
              visible: record.status === '0',
              click: () => fetchDetail('edit', val, record),
            },
            {
              type: 'del',
              visible: record.status === '0',
              click: () => fetchPuzzleAdSet({ puzzleAdsId: val, deleteFlag: 0 }),
            },
          ]}
        />
      ),
    },
  ];

  // 新增修改
  const fetchPuzzleAdSet = (payload, callback) => {
    dispatch({
      type: 'puzzleAd/fetchPuzzleAdSet',
      payload,
      callback: () => {
        callback && callback();
        childRef.current.fetchGetData();
      },
    });
  };

  // 详情
  const fetchDetail = (type, puzzleAdsId, row) => {
    const { deliveryAreaNameStr } = row;
    dispatch({
      type: 'puzzleAd/fetchPuzzleAdDetail',
      payload: {
        puzzleAdsId,
      },
      callback: (info) =>
        setVisibleSet({ type, show: true, info: { ...info, deliveryAreaNameStr } }),
    });
  };

  // 获取广告配置详情
  const fetchAdRootDetail = () => {
    dispatch({
      type: 'puzzleAd/fetchPuzzleAdRoot',
      callback: () => setVisibleRoot(true),
    });
  };

  return (
    <>
      <TableDataBlock
        keepData
        cRef={childRef}
        btnExtra={
          <>
            <AuthConsumer auth="adRoot">
              <Button className="dkl_green_btn" onClick={fetchAdRootDetail}>
                广告配置
              </Button>
            </AuthConsumer>
            <AuthConsumer auth="save">
              <Button
                className="dkl_green_btn"
                onClick={() => setVisibleSet({ type: 'add', show: true, info: '' })}
              >
                新增
              </Button>
            </AuthConsumer>
          </>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.puzzleAdsId}`}
        dispatchType="puzzleAd/fetchGetList"
        {...puzzleAd}
      ></TableDataBlock>
      {/* 拼图广告设置 */}
      <PuzzleAdSet
        cRef={childRef}
        visible={visibleSet}
        onSumbit={fetchPuzzleAdSet}
        onClose={() => setVisibleSet({ show: false, info: '' })}
      ></PuzzleAdSet>
      {/* 广告配置 */}
      <PuzzleAdRoot visible={visibleRoot} onClose={() => setVisibleRoot(false)}></PuzzleAdRoot>
    </>
  );
};

export default connect(({ puzzleAd, loading }) => ({
  puzzleAd,
  loading: loading.models.puzzleAd,
}))(PuzzleAd);
