import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Select, Cascader } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import CITYJSON from '@/common/city';
import TableDataBlock from '@/components/TableDataBlock';
import HotCityDrawer from './HotCityDrawer';

const VaneManage = (props) => {
  const { list, loading, dispatch, hotCityList, dictionaryId } = props;
  // const [cityCode, setCityCode] = useState(['33', '3301']);

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   dispatch({
  //     type: 'walkingManage/fetchWalkManageNavigation',
  //   });
  // }, []);

  // useEffect(() => {
  //   childRef.current.fetchGetData({ cityCode: cityCode[1] });
  // }, [cityCode]);

  // 获取详情
  // const fetchGetDetail = (val, record, type) => {
  //   const { areaCode = '' } = record;
  //   dispatch({
  //     type: 'walkingManage/fetchWalkManageVaneDetail',
  //     payload: {
  //       configWindVaneId: val,
  //       areaType: 'city',
  //       areaCode,
  //     },
  //     callback: (detail) => setVisible({ show: true, type, detail }),
  //   });
  // };

  // 删除
  const fetchDetailDel = (codeId, record) => {
    const list = hotCityList.filter((item) => {
      return item.cityCode !== codeId;
    });
    // console.log('list', list);
    dispatch({
      type: 'walkingManage/fetchHotCityPageConfigDel',
      payload: {
        dictionaryId,
        extraParam: list,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // 排序
  const fetchDetailSort = (list) => {
    console.log(list, 'newList');
    dispatch({
      type: 'walkingManage/fetchHotCityPageConfigSort',
      payload: {
        dictionaryId,
        extraParam: JSON.stringify(list),
        // configWindVaneDTOList: list.map((item, i) => ({
        //   configWindVaneId: item.configWindVaneId,
        //   sort: i,
        // })),
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    // {
    //   title: '图标',
    //   dataIndex: 'image',
    //   render: (val) => <PopImgShow url={val}></PopImgShow>,
    // },
    {
      title: '城市',
      dataIndex: 'cityName',
    },
    {
      title: '排序',
      align: 'right',
      dataIndex: 'sort',
      render: () => <DragHandle />,
    },
    {
      type: 'handle',
      dataIndex: 'cityCode',
      render: (val, record) => {
        return [
          // {
          //   type: 'info',
          //   auth: true,
          //   click: () => fetchGetDetail(val, record, 'detail'),
          // },
          // {
          //   type: 'edit',
          //   auth: true,
          //   click: () => fetchGetDetail(val, record, 'edit'),
          // },
          {
            type: 'del',
            auth: true,
            click: () => fetchDetailDel(val, record),
          },
        ];
      },
    },
  ];

  // const cityList = CITYJSON.map((item) => {
  //   const children = item.children.map((every) => ({
  //     value: every.value,
  //     label: every.label,
  //     pid: every.pid,
  //   }));
  //   return {
  //     ...item,
  //     children: children,
  //   };
  // });

  // const handleCityChange = (val) => {
  //   setCityCode(val);
  // };

  return (
    <>
      {/* <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', width: 100, textAlign: 'center' }}>选择城市:</span>
        <Cascader value={cityCode} options={cityList} onChange={handleCityChange} />
      </div> */}

      <TableDataBlock
        order={true}
        // firstFetch={false}
        tableSort={{ key: 'cityCode', onSortEnd: fetchDetailSort }}
        cardProps={{
          title: '热门城市配置',
          bordered: false,
          extra: (
            <Button
              type="primary"
              onClick={() => setVisible({ dictionaryId, detail: hotCityList, show: true })}
            >
              新增
            </Button>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        params={{ parent: 'hotCityConfig', child: 'hotCityList' }}
        rowKey={(record) => `${record.cityCode}`}
        dispatchType="walkingManage/fetchHotCityPageList"
        pagination={false}
        list={hotCityList}
      ></TableDataBlock>
      <HotCityDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></HotCityDrawer>
    </>
  );
};

export default connect(({ walkingManage, loading }) => ({
  // list: walkingManage.vaneList,
  hotCityList: walkingManage.hotCity.list,
  dictionaryId: walkingManage.hotCity.dictionaryId,
  loading:
    loading.effects['walkingManage/fetchHotCityPageList'] ||
    loading.effects['walkingManage/fetchHotCityPageConfigDel'] ||
    loading.effects['walkingManage/fetchHotCityPageConfigChange'] ||
    loading.effects['walkingManage/fetchHotCityPageConfigSort'],
}))(VaneManage);
