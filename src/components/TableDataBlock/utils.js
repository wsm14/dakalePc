import Ellipsis from '@/components/Ellipsis';

const tablePropsHandle = {
  // 表头处理
  columns: ({ order, columns, list }, page) => {
    // 序号
    const indexOrder = [{ title: '序号', fixed: 'left', width: 80, dataIndex: 'numId' }];

    const tableRenderEllipsis = (ellipsis = {}, render) => ({
      render: (val, row) => (
        <Ellipsis length={10} tooltip {...ellipsis}>
          {render ? render(val, row) : val || '--'}
        </Ellipsis>
      ),
    });

    // 表头处理
    const newColumns = (order ? indexOrder : [])
      .concat(columns)
      .map(({ ellipsis = false, render, ...other }) => ({
        ...other,
        render,
        ...(ellipsis ? tableRenderEllipsis(ellipsis, render) : {}),
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
