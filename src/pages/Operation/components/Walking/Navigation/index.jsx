import React, { useRef } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import TableDataBlock from '@/components/TableDataBlock';
import DndDragContext from '@/components/DndDragContext';

const NavigationManage = (props) => {
  const { navigation, loading, dispatch, style } = props;

  const childRef = useRef();

  // 排序
  const fetchDetailSort = (value) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageNavigationSort',
      payload: value,
      callback: childRef.current.fetchGetData,
    });
  };

  // 子项目排序 需要父级项目id 当前序号 数据
  const handleSortData = (id, index, list) => {
    fetchDetailSort({
      categoryDTOList: [
        {
          categoryIdString: id,
          navigationSort: index,
          categoryScenesDTOList: list.map(({ categoryScenesId }, index) => ({
            categoryScenesId,
            sort: index,
          })),
        },
      ],
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
      render: (val, row, index) => {
        const { categoryScenesDTOList: data = [] } = row;
        return data.length ? (
          <DndDragContext
            accept={val}
            data={data}
            onEnd={(list) => handleSortData(val, index, list)}
          >
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
    <TableDataBlock
      tableSort={{
        key: 'categoryIdString',
        onSortEnd: (val) =>
          fetchDetailSort({
            categoryDTOList: val.map((item, index) => ({ ...item, navigationSort: index })),
          }),
      }}
      cardProps={{ title: '导航类目页面配置', style }}
      cRef={childRef}
      loading={loading}
      pagination={false}
      columns={getColumns}
      rowKey={(record) => `${record.categoryIdString}`}
      dispatchType="walkingManage/fetchWalkManageNavigation"
      {...navigation}
    ></TableDataBlock>
  );
};

export default connect(({ walkingManage, loading }) => ({
  navigation: walkingManage.navigation,
  loading:
    loading.effects['walkingManage/fetchWalkManageNavigation'] ||
    loading.effects['walkingManage/fetchWalkManageNavigationSort'],
}))(NavigationManage);
