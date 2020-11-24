import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Switch, Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import TableEdit from '@/components/TableEdit';
import SectionEdit from '../Form/SectionEditForm';

const SectionList = (props) => {
  const { loading, dispatch, list } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 部门修改
  const fetchEdit = (payload) => {
    dispatch({
      type: 'workerManageSection/fetchWMSSectionEdit',
      payload: {
        ...payload,
        departmentId: payload.departmentIdString,
        pid: payload.pidString,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // table 表头
  const getColumns =  [
    {
      title: '部门',
      width: 350,
      dataIndex: 'departmentName',
      maxLength: 10,
      editable: true,
      suffix: true,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      maxLength: 20,
      editable: true,
      required: false,
    },
    {
      title: '启用状态',
      align: 'center',
      dataIndex: 'departmentStatus',
      render: (val, record) => (
        <Switch
          checkedChildren="启"
          unCheckedChildren="停"
          checked={val === '1'}
          onClick={() =>
            fetchEdit({
              ...record,
              departmentStatus: 1 ^ val,
            })
          }
        />
      ),
    },
    {
      title: '操作',
      align: 'center',
      width: 250,
      dataIndex: 'pid',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '添加子部门',
              click: () =>
                setVisible({
                  visible: true,
                  userInfo: {
                    ...record,
                    weight: record.children
                      ? record.children[record.children.length - 1].weight + 1
                      : 1,
                  },
                }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TableEdit
        cRef={childRef}
        rowKey={(record) => `${record.departmentIdString}`}
        list={list}
        dispatchType="workerManageSection/fetchGetList"
        loading={loading}
        columns={getColumns}
        handleEdit={fetchEdit}
      >
        <div style={{ marginBottom: 18, textAlign: 'right' }}>
          <Button
            className="dkl_green_btn"
            key="1"
            onClick={() =>
              setVisible({
                visible: true,
                userInfo: { weight: list.length ? list[list.length - 1].weight + 1 : 1 },
              })
            }
          >
            新增部门
          </Button>
        </div>
      </TableEdit>
      <SectionEdit childRef={childRef} {...visible} onClose={() => setVisible(false)}></SectionEdit>
    </>
  );
};

export default connect(({ workerManageSection, loading }) => ({
  list: workerManageSection.list,
  loading: loading.models.workerManageSection,
}))(SectionList);
