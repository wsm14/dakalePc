import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Select } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import VaneDrawer from './VaneDrawer';

const VaneManage = (props) => {
  const { list, loading, dispatch } = props;
  const [cityCode, setCityCode] = useState('3301');

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'walkingManage/fetchWalkManageNavigation',
    });
  }, []);

  useEffect(() => {
    childRef.current.fetchGetData({ cityCode });
  }, [cityCode]);

  // 获取详情
  const fetchGetDetail = (val, type) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneDetail',
      payload: {
        configWindVaneId: val,
      },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  // 删除
  const fetchDetailDel = (configWindVaneId) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneEditDel',
      payload: {
        configWindVaneId,
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

  const searchItems = [
    // {
    //   label: '选择城市',
    //   name: 'city',
    //   type: 'cascader',
    //   changeOnSelect: true,
    //   valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    // },
    {
      label: '选择城市',
      name: 'city',
      type: 'select',
      select: { 3301: '杭州', 4331: '湘西' },
    },
  ];

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
            click: () => fetchGetDetail(val, 'detail'),
          },
          {
            type: 'edit',
            auth: true,
            click: () => fetchGetDetail(val, 'edit'),
          },
          {
            type: 'del',
            auth: true,
            click: () => fetchDetailDel(val),
          },
        ];
      },
    },
  ];

  const handleCityChange = (val) => {
    console.log(val, '222');
    setCityCode(val);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', width: 100, textAlign: 'center' }}>选择城市:</span>
        <Select value={cityCode} style={{ width: 120 }} onChange={handleCityChange}>
          <Option value="3301">杭州</Option>
          <Option value="4331">湘西</Option>
        </Select>
      </div>

      <TableDataBlock
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
        // searchItems={searchItems}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configWindVaneId}`}
        dispatchType="walkingManage/fetchWalkManageVaneList"
        pagination={false}
        {...list}
      ></TableDataBlock>
      <VaneDrawer cRef={childRef} visible={visible} cityCode={cityCode} onClose={() => setVisible(false)}></VaneDrawer>
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
