import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Form, Modal, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import EditableCell from './EditableCell';

const JobsClassManage = (props) => {
  const { jobsClasslist, loading, visible, onClose, dispatch } = props;

  const childRef = useRef();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null); // 编辑的key
  const [addList, setAddList] = useState([]); // 添加的列

  // 新增 / 修改 删除
  const fetchJobsClassSet = (flag = {}) => {
    form.validateFields().then((values) => {
      dispatch({
        type: {
          true: 'solicitJobs/fetchJobsClassSave',
          false: 'solicitJobs/fetchJobsClassSet',
        }[editingKey === 'add'],
        payload: {
          jobTypeId: editingKey !== 'add' ? editingKey : '',
          ...values,
          ...flag,
        },
        callback: () => {
          childRef.current.fetchGetData();
          cancel();
        },
      });
    });
  };

  const isEditing = (row) => row.jobTypeId === editingKey;

  const edit = (row) => {
    form.setFieldsValue(row);
    setAddList([]);
    setEditingKey(row.jobTypeId);
  };

  const cancel = () => {
    setEditingKey(null);
    setAddList([]);
  };

  const addRow = () => {
    form.resetFields();
    const jobTypeId = 'add';
    setAddList([{ jobTypeId }]);
    setEditingKey(jobTypeId);
  };

  // table 表头
  const getColumns = [
    {
      title: '职位',
      align: 'center',
      editable: true,
      dataIndex: 'jobType',
    },
    {
      title: '操作',
      dataIndex: 'jobTypeId',
      align: 'right',
      render: (jobTypeId, record) => {
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
                type: 'del',
                auth: true,
                visible: !editable,
                click: () => fetchJobsClassSet({ jobTypeId, deleteFlag: 0 }),
              },
              {
                auth: true,
                title: '保存',
                visible: editable,
                click: () => fetchJobsClassSet(),
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
    const { dataIndex, title, required, onChange } = col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex,
        title,
        required,
        onChange,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Modal
      title={'职位类别'}
      width={850}
      destroyOnClose
      visible={visible}
      onCancel={onClose}
      okText="新增"
      onOk={addRow}
    >
      <Form form={form} component={false}>
        <TableDataBlock
          noCard={false}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          cRef={childRef}
          loading={loading}
          columns={mergedColumns}
          rowKey={(record) => `${record.jobTypeId}`}
          dispatchType="solicitJobs/fetchJobsClassList"
          pagination={false}
          list={[...jobsClasslist, ...addList]}
        ></TableDataBlock>
      </Form>
    </Modal>
  );
};

export default connect(({ solicitJobs, loading }) => ({
  jobsClasslist: solicitJobs.jobsClasslist,
  loading:
    loading.effects['solicitJobs/fetchJobsClassList'] ||
    loading.effects['solicitJobs/fetchJobsClassSave'] ||
    loading.effects['solicitJobs/fetchJobsClassSet'],
}))(JobsClassManage);
