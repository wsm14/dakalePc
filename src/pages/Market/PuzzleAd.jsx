import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { PUZZLE_AD_TYPE, PUZZLE_AD_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import SysAppSetForm from './components/App/SysAppSet';

const PuzzleAd = (props) => {
  const { puzzleAd, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState({ show: false, info: '' });

  // 搜索参数
  const searchItems = [
    {
      label: '品牌名',
      name: 'brandName',
    },
    // {
    //   label: '区域',
    //   name: 'city',
    //   type: 'cascader',
    //   valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    // },
  ];

  // table 表头
  const getColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      render: (val) =>
        Object.assign(...PUZZLE_AD_TYPE.map((item) => ({ [item.value]: item.name })))[val],
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
              type: 'up',
              visible: record.status === '0',
              click: () => fetchPuzzleAdSet({ puzzleAdsId: val, status: 1 }),
            },
            {
              type: 'edit',
              visible: record.status === '0',
              click: () => setVisibleSet({ show: true, info: record }),
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
  const fetchPuzzleAdSet = (payload) => {
    dispatch({
      type: 'puzzleAd/fetchPuzzleAdSet',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        btnExtra={
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              onClick={() => setVisibleSet({ show: true, info: '' })}
            >
              新增
            </Button>
          </AuthConsumer>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.puzzleAdsId}`}
        dispatchType="puzzleAd/fetchGetList"
        {...puzzleAd}
      ></DataTableBlock>
      <SysAppSetForm
        cRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false, info: '' })}
      ></SysAppSetForm>
    </>
  );
};

export default connect(({ puzzleAd, loading }) => ({
  puzzleAd,
  loading: loading.models.puzzleAd,
}))(PuzzleAd);
