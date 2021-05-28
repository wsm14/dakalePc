import Ellipsis from '@/components/Ellipsis';
import HandleSetTable from './HandleSetTable';
import DraggableContent from './SortBlock';

const tablePropsHandle = {
  // 表格排序
  tableSort: (list, tableSort) => (tableSort ? DraggableContent(list, tableSort) : {}),
  // 表头处理
  columns: ({ order, columns, list }, page) => {
    // 序号
    const indexOrder = [{ title: '序号', fixed: 'left', width: 80, dataIndex: 'numId' }];

    // 文本缩略
    const tableRenderEllipsis = (ellipsis = {}, render) => ({
      render: (val, row, index) => (
        <Ellipsis length={10} tooltip {...ellipsis}>
          {render ? render(val, row, index) : val || '--'}
        </Ellipsis>
      ),
    });

    // 操作按钮
    const tableRenderHandle = (render = () => []) => ({
      title: '操作',
      fixed: 'right',
      align: 'right',
      render: (val, row, index) => (
        <HandleSetTable formItems={render(val, row, index)}></HandleSetTable>
      ),
    });

    // 表头处理
    const newColumns = (order ? indexOrder : [])
      .concat(columns)
      .map(({ ellipsis = false, type, render, ...other }) => ({
        render,
        ...(type === 'handle' ? tableRenderHandle(render) : {}),
        ...(ellipsis ? tableRenderEllipsis(ellipsis, render) : {}),
        ...other,
      }));

    // 数据处理
    const newDataSource = order
      ? list.map((item, index) => ({
          numId: (page - 1) * 10 + index + 1,
          ...item,
        }))
      : list;

    return { dataSource: newDataSource, columns: newColumns };
  },
};

export default tablePropsHandle;
