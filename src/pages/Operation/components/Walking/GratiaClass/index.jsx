import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import EditableCell from './EditableCell';

const GratiaClassManage = (props) => {
  const { classList, loading, dispatch, style } = props;

  const childRef = useRef();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null); // 编辑的key
  const [addList, setAddList] = useState([]); // 添加的列
  const [tradeName, setTradeName] = useState(null); // 选择的行业名称

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 行业类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 新增/修改
  const fetchDetailAdd = (val) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageGratiaClassAdd',
      payload: { categoryList: val },
      callback: childRef.current.fetchGetData,
    });
  };

  const isEditing = (row) => row.id === editingKey;

  const edit = (row) => {
    form.setFieldsValue(row);
    setTradeName(row.categoryName);
    setEditingKey(row.id);
  };

  const cancel = () => {
    setTradeName(null);
    setEditingKey(null);
    setAddList([]);
  };

  const save = () => {
    form.validateFields().then((values) => {
      const newData = { ...values, categoryName: tradeName };
      let newList = classList;
      // 新增直接附加新数据给数组
      if (editingKey === 'add') newList = [...classList, newData];
      else {
        // 修改替换新数据
        const index = newList.findIndex((item) => item.id === editingKey);
        newList.splice(index, 1, newData);
      }
      fetchDetailAdd(newList);
      cancel();
    });
  };

  const addRow = () => {
    form.resetFields();
    const id = 'add';
    setAddList([{ id }]);
    setEditingKey(id);
  };

  // table 表头
  const getColumns = [
    {
      title: '类目',
      align: 'center',
      editable: true,
      dataIndex: 'id',
      inputType: 'select',
      onChange: (val, option) => setTradeName(option.label),
      render: (val, row) => row.categoryName,
    },
    {
      title: '显示文案',
      align: 'center',
      editable: true,
      dataIndex: 'showCopy',
    },
    {
      title: '副标题',
      align: 'center',
      editable: true,
      required: false,
      dataIndex: 'subtitle',
    },
    {
      title: '操作',
      dataIndex: 'categoryName',
      align: 'right',
      render: (val, record) => {
        const editable = isEditing(record);
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                auth: true,
                visible: !editable,
                click: () => edit(record),
              },
              {
                auth: true,
                title: '保存',
                visible: editable,
                click: save,
              },
              {
                auth: true,
                title: '取消',
                visible: editable,
                click: () => cancel(record),
              },
            ]}
          />
        );
      },
    },
  ];

  const mergedColumns = getColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    const { dataIndex, title, required, inputType = 'input', onChange } = col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType,
        dataIndex,
        title,
        required,
        onChange,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <TableDataBlock
        cardProps={{
          title: '特惠商品类目配置',
          extra: (
            <Button type="primary" onClick={addRow}>
              新增
            </Button>
          ),
          style,
        }}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        cRef={childRef}
        loading={loading}
        columns={mergedColumns}
        rowKey={(record) => `${record.id}`}
        dispatchType="walkingManage/fetchWalkManageGratiaClass"
        pagination={false}
        list={[...classList, ...addList]}
      ></TableDataBlock>
    </Form>
  );
};

export default connect(({ walkingManage, loading }) => ({
  classList: walkingManage.class,
  loading:
    loading.effects['walkingManage/fetchWalkManageGratiaClass'] ||
    loading.effects['walkingManage/fetchWalkManageGratiaClassAdd'],
}))(GratiaClassManage);
