import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Select, Cascader } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import PopImgShow from '@/components/PopImgShow';
import CITYJSON from '@/common/city';
import TableDataBlock from '@/components/TableDataBlock';
import VaneDrawer from './VaneDrawer';

const VaneManage = (props) => {
  const { list, loading, dispatch } = props;
  const [cityCode, setCityCode] = useState(['33', '3301']);

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'walkingManage/fetchWalkManageNavigation',
    });
  }, []);

  useEffect(() => {
    childRef.current.fetchGetData({ cityCode: cityCode[1] });
  }, [cityCode]);

  // 获取详情
  const fetchGetDetail = (val, record, type) => {
    const { areaCode = '' } = record;
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneDetail',
      payload: {
        configWindVaneId: val,
        areaType: 'city',
        areaCode,
      },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  // 删除
  const fetchDetailDel = (configWindVaneId, record) => {
    const { areaCode = '' } = record;
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneEditDel',
      payload: {
        configWindVaneId,
        areaType: 'city',
        areaCode,
        deleteFlag: 0,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // 排序
  const fetchDetailSort = (list) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneSort',
      payload: {
        configWindVaneDTOList: list.map((item, i) => ({
          configWindVaneId: item.configWindVaneId,
          sort: i,
        })),
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '图标',
      dataIndex: 'image',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '显示名称',
      dataIndex: 'name',
      className: 'drag-visible',
    },
    {
      title: '排序',
      align: 'right',
      dataIndex: 'sort',
      render: () => <DragHandle />,
    },
    {
      type: 'handle',
      dataIndex: 'configWindVaneId',
      render: (val, record) => {
        return [
          {
            type: 'info',
            auth: true,
            click: () => fetchGetDetail(val, record, 'detail'),
          },
          {
            type: 'edit',
            auth: true,
            click: () => fetchGetDetail(val, record, 'edit'),
          },
          {
            type: 'del',
            auth: true,
            click: () => fetchDetailDel(val, record),
          },
        ];
      },
    },
  ];

  const cityList = CITYJSON.map((item) => {
    const children = item.children.map((every) => ({
      value: every.value,
      label: every.label,
      pid: every.pid,
    }));
    return {
      ...item,
      children: children,
    };
  });

  const handleCityChange = (val) => {
    setCityCode(val);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', width: 100, textAlign: 'center' }}>选择城市:</span>
        <Cascader value={cityCode} options={cityList} onChange={handleCityChange} />
      </div>

      <TableDataBlock
        firstFetch={false}
        tableSort={{ key: 'configWindVaneId', onSortEnd: fetchDetailSort }}
        cardProps={{
          title: '风向标配置',
          bordered: false,
          extra: (
            <Button type="primary" onClick={() => setVisible({ type: 'add', show: true })}>
              新增
            </Button>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        params={{ cityCode: cityCode[1] }}
        rowKey={(record) => `${record.configWindVaneId}`}
        dispatchType="walkingManage/fetchWalkManageVaneList"
        pagination={false}
        {...list}
      ></TableDataBlock>
      <VaneDrawer
        cRef={childRef}
        visible={visible}
        cityCode={cityCode[1]}
        onClose={() => setVisible(false)}
      ></VaneDrawer>
    </>
  );
};

export default connect(({ walkingManage, loading }) => ({
  list: walkingManage.vaneList,
  loading:
    loading.effects['walkingManage/fetchWalkManageVaneList'] ||
    loading.effects['walkingManage/fetchWalkManageVaneEditDel'] ||
    loading.effects['walkingManage/fetchWalkManageVaneDetail'] ||
    loading.effects['walkingManage/fetchWalkManageVaneSort'],
}))(VaneManage);
