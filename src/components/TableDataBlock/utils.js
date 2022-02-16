import { Switch } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import AuthConsumer from '@/layouts/AuthConsumer';
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

    // 表头处理
    const newColumns = (order ? indexOrder : [])
      .concat(columns)
      .filter(({ show = true }) => show)
      .map(({ ellipsis = false, type, render, ...other }) => ({
        render,
        ...tablePropsHandle.tableComponents(type, render),
        ...(ellipsis ? tableRenderEllipsis(ellipsis, render) : {}),
        ...other,
      }));

    // 数据处理
    const newDataSource = order
      ? list?.map((item, index) => ({
          numId: (page - 1) * 10 + index + 1,
          ...item,
        }))
      : list;

    return { dataSource: newDataSource, columns: newColumns };
  },
  // 表格头类型组件处理
  tableComponents: (type, render = () => []) => {
    switch (type) {
      case 'handle':
        return {
          title: '操作',
          fixed: 'right',
          align: 'right',
          render: (val, row, index) => (
            <HandleSetTable formItems={render(val, row, index)}></HandleSetTable>
          ),
        };
      case 'switch':
        return {
          align: 'center',
          render: (val, row, index) => {
            const data = render(val, row, index);
            const {
              auth = true,
              noAuth,
              show,
              checkedChildren = '启',
              unCheckedChildren = '停',
              ...other
            } = data;
            return (
              <AuthConsumer auth={auth} noAuth={noAuth} show={show}>
                <Switch
                  checkedChildren={checkedChildren}
                  unCheckedChildren={unCheckedChildren}
                  {...other}
                />
              </AuthConsumer>
            );
          },
        };
      default:
        return {};
    }
  },
};

export default tablePropsHandle;
