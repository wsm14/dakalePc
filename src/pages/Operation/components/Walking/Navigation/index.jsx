import React, { useRef } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import TableDataBlock from '@/components/TableDataBlock';
import DndDragContext from '@/components/DndDragContext';

const VaneManage = (props) => {
  const { navigation, loading, dispatch, style } = props;

  const childRef = useRef();

  // 获取详情
  const fetchShareDetail = (val, type) => {
    dispatch({
      type: 'shareManage/fetchShareDetail',
      payload: {
        userMomentIdString: val,
      },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '类目',
      dataIndex: 'categoryName',
      className: 'drag-visible',
    },
    {
      title: '场景',
      align: 'center',
      dataIndex: 'categoryIdString',
      render: (val, row) => {
        const { categoryScenesDTOList: data = [] } = row;
        return data.length ? (
          <DndDragContext accept={val} data={data} onEnd={(list) => console.log(val, list)}>
            {row.categoryScenesDTOList.map((item) => (
              <Tag color="orange" key={item.categoryId}>
                {item.scenesName}
              </Tag>
            ))}
          </DndDragContext>
        ) : (
          ''
        );
      },
    },
    {
      title: '排序',
      align: 'right',
      dataIndex: 'sort',
      render: () => <DragHandle />,
    },
  ];

  return (
    <>
      <TableDataBlock
        tableSort={{ key: 'categoryIdString', onSortEnd: (val) => console.log(val) }}
        cardProps={{ title: '导航类目页面配置', style }}
        cRef={childRef}
        loading={loading}
        pagination={false}
        columns={getColumns}
        rowKey={(record) => `${record.categoryIdString}`}
        dispatchType="walkingManage/fetchWalkManageNavigation"
        {...navigation}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ walkingManage, loading }) => ({
  navigation: walkingManage.navigation,
  loading: loading.effects['walkingManage/fetchWalkManageNavigation'],
}))(VaneManage);
