import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import { PAGE_STATUS, BANNER_AREA_TYPE } from '@/common/constant';
import GatherSet from './Form/GatherSet';
const GatherPage = (props) => {
  const { gatherList, loading, dispatch } = props;
  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false);

  useEffect(() => {}, []);

  const handleEnd = (configCollectionPageId) => {
    console.log(configCollectionPageId);
    dispatch({
      type: 'walkingManage/fetchGatherPageConfigEnd',
      payload: {
        configCollectionPageId,
      },
      callback: () => {
        childRef.current.fetchGetData();
      },
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '应用范围',
      align: 'center',
      dataIndex: 'areaType',
      render: (val, row) => BANNER_AREA_TYPE[val],
    },
    {
      title: '唤起条件',
      align: 'center',
      dataIndex: 'evokeParam',
      render: (val, row) => {
        const evokeParams = val ? JSON.parse(val) : [];
        return (
          <>
            {evokeParams.map((item, index) => (
              <div key={index}>
                {index + 1},日领卡豆: {item.bean}
              </div>
            ))}
          </>
        );
      },
    },
    {
      title: '价格',
      align: 'center',
      dataIndex: 'recommendParamObject',
      render: (val, row) => `${val.minPrice}--${val.maxPrice}元`,
    },
    {
      title: '开始时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => PAGE_STATUS[val],
    },
    {
      title: '操作人',
      align: 'center',
      dataIndex: 'updateTime',
      render: (val, row) => `${val}\n ${row.updater}`,
    },
    {
      type: 'handle',
      dataIndex: 'configCollectionPageId',
      render: (val, record) => {
        return [
          {
            type: 'edit',
            auth: true,
            click: () =>
              setVisibleSet({
                type: 'edit',
                show: true,
                detail: record,
              }),
          },
          {
            auth: true,
            title: '结束',
            click: () => handleEnd(val),
            visible:record.status==='0'
          },
        ];
      },
    },
  ];

  const handleAdd = () => {
    setVisibleSet({
      type: 'add',
      show: true,
    });
  };

  return (
    <>
      <TableDataBlock
        cardProps={{
          title: '集合页配置',
          bordered: false,
          extra: (
            <Button type="primary" onClick={handleAdd}>
              新增
            </Button>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configCollectionPageId}`}
        dispatchType="walkingManage/fetchGatherPageConfigList"
        pagination={false}
        list={gatherList.list}
      ></TableDataBlock>
      <GatherSet
        visible={visibleSet}
        cRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></GatherSet>
    </>
  );
};

export default connect(({ walkingManage, loading }) => ({
  gatherList: walkingManage.gatherList,
  loading:
    loading.effects['walkingManage/fetchGatherPageConfigList'] ||
    loading.effects['walkingManage/fetchWalkManageGratiaClassAdd'],
}))(GatherPage);
