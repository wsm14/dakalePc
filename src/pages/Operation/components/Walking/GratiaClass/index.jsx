import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import EditableCell from './EditableCell';

const VaneManage = (props) => {
  const { serviceFAQ, loading, dispatch, style } = props;
  const { list: FAQList } = serviceFAQ;

  const childRef = useRef();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(''); // 编辑的key
  const [addList, setAddList] = useState([]); // 添加的列

  const isEditing = (record) => record.questionIdString === editingKey;

  const edit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.questionIdString);
  };

  const cancel = () => {
    setEditingKey('');
    setAddList([]);
  };

  const save = () => {
    form.validateFields().then((values) => {
      console.log(values);
      cancel();
    });
  };

  const addRow = () => {
    form.resetFields();
    const questionIdString = 'add';
    setAddList([{ questionIdString }]);
    setEditingKey(questionIdString);
  };

  // 获取详情
  const fetchShareDetail = (val, type) => {
    dispatch({
      type: 'serviceFAQ/fetchShareDetail',
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
      dataIndex: 'questionTitle',
      align: 'center',
      editable: true,
    },
    {
      title: '显示文案',
      dataIndex: 'status',
      align: 'center',
      editable: true,
    },
    {
      title: '副标题',
      dataIndex: 'sort',
      editable: true,
      align: 'center',
      required: false,
    },
    {
      title: '操作',
      dataIndex: 'questionIdString',
      align: 'right',
      render: (val, record) => {
        const editable = isEditing(record);
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
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
    const { dataIndex, title, required } = col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: dataIndex === 'questionTitle' ? 'select' : 'text',
        dataIndex,
        title,
        required,
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
        rowKey={(record) => `${record.questionIdString}`}
        params={{ userType: 'user' }}
        dispatchType="serviceFAQ/fetchGetList"
        {...FAQList}
        list={[...FAQList.list, ...addList]}
      ></TableDataBlock>
    </Form>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  serviceFAQ,
  loading: loading.models.serviceFAQ,
}))(VaneManage);
