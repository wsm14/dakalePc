import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Modal, Input } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AreaSet = (props) => {
  const { dispatch, province, fetchAreaQueryInfo, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [rowKey, setRowKey] = useState([]);
  const [rowCKey, setCRowKey] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [dictList, setDictList] = useState([]);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      price: '',
      gdp: '',
      population: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => setEditingKey('');

  const save = (row) => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'areaQuery/fetchAreaQueryInfoSet',
        payload: {
          id: row.id,
          ...values,
        },
        callback: () => {
          if (`${row.id}`.length === 2) fetchAreaQueryInfo({ level: 1 });
          else if (`${row.id}`.length === 4)
            fetchAreaQueryCityInfo({ pid: `${row.id}`.slice(0, 2) });
          else if (`${row.id}`.length === 6) fetchAreaQueryDInfo({ pid: `${row.id}`.slice(0, 4) });
          setEditingKey('');
        },
      });
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '省/市/区',
      dataIndex: 'name',
    },
    {
      title: '签约价格',
      align: 'center',
      dataIndex: 'price',
      editable: true,
    },
    {
      title: 'GDP',
      align: 'center',
      dataIndex: 'gdp',
      editable: true,
    },
    {
      title: '人口',
      align: 'center',
      dataIndex: 'population',
      editable: true,
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'id',
      render: (val, row) => {
        const editable = isEditing(row);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(row)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </a>
            <a onClick={cancel}>取消</a>
          </span>
        ) : (
          <a disabled={editingKey !== ''} onClick={() => !editingKey && edit(row)}>
            修改
          </a>
        );
      },
    },
  ];

  const mergedColumns = getColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // 获取详情
  const fetchAreaQueryCityInfo = (payload) => {
    dispatch({
      type: 'areaQuery/fetchAreaQueryCityInfo',
      payload,
      callback: setCityList,
    });
  };

  // 获取详情
  const fetchAreaQueryDInfo = (payload) => {
    dispatch({
      type: 'areaQuery/fetchAreaQueryCityInfo',
      payload,
      callback: setDictList,
    });
  };

  const expandedRowRender = (columns) => {
    return (
      <TableDataBlock
        noCard={false}
        pagination={false}
        size="middle"
        tableSize="small"
        columns={columns}
        loading={loading}
        rowKey={(record) => `${record.id}`}
        list={cityList}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        expandable={{
          expandedRowKeys: rowCKey,
          onExpand: (expanded, row) => {
            if (expanded) {
              fetchAreaQueryDInfo({ pid: row.id });
              setCRowKey([`${row.id}`]);
            } else setCRowKey([]);
          },
          expandedRowRender: () => expandedRowRenderD(mergedColumns),
        }}
      ></TableDataBlock>
    );
  };

  const expandedRowRenderD = (columns) => {
    return (
      <TableDataBlock
        noCard={false}
        pagination={false}
        size="middle"
        tableSize="small"
        columns={columns}
        loading={loading}
        rowKey={(record) => `${record.id}`}
        list={dictList}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      ></TableDataBlock>
    );
  };

  return (
    <Modal
      title={`城市信息`}
      destroyOnClose
      maskClosable
      width={1000}
      visible={visible}
      footer={null}
      onCancel={onClose}
      bodyStyle={{ height: 700, overflowY: 'auto' }}
    >
      <Form form={form} component={false}>
        <TableDataBlock
          noCard={false}
          pagination={false}
          size="middle"
          tableSize="small"
          columns={mergedColumns}
          loading={loading}
          rowKey={(record) => `${record.id}`}
          params={{ level: 1 }}
          dispatchType={'areaQuery/fetchAreaQueryInfo'}
          list={province}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          expandable={{
            expandedRowKeys: rowKey,
            onExpand: (expanded, row) => {
              if (expanded) {
                fetchAreaQueryCityInfo({ pid: row.id });
                setRowKey([`${row.id}`]);
              } else setRowKey([]);
            },
            expandedRowRender: () => expandedRowRender(mergedColumns),
          }}
        ></TableDataBlock>
      </Form>
    </Modal>
  );
};

export default connect(({ areaQuery, loading }) => ({
  province: areaQuery.province,
  loading: loading.models.areaQuery,
}))(AreaSet);
