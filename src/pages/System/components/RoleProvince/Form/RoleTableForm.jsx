import React, { useState, useImperativeHandle } from 'react';
import { connect } from 'umi';
import { Table, Checkbox, Select } from 'antd';
import { WORKER_ROLEDATA_TYPE } from '@/common/roleConstant';
import router from '../../../../../../config/router.config';

const RoleTableForm = (props) => {
  const { loading, treeList, cRef, userInfo } = props;
  // 选择的菜单
  const [selectedRowKeys, setSelectedRowKeys] = useState(userInfo.selectedRowKeys || []);
  // 选择的菜单ID
  const [selectedPKeys, setSelectedPKeys] = useState(userInfo.selectedPKeys || []);
  // 选择的按钮
  const [selectedBtns, setSelectedBtns] = useState(userInfo.selectedBtns || {});
  // 选择的数据
  const [selectedDatas, setSelectedDatas] = useState(userInfo.selectedDatas || {});

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchGetData: () => ({
      selectedBtns,
      selectedDatas,
      selectedRowKeys: Array.from(new Set([...selectedPKeys, ...selectedRowKeys])),
    }),
  }));

  // 递归获取规则项目
  const getParentId = (list, iid) => {
    for (let o of list || []) {
      if (o.path == iid) return o;
      const o_ = getParentId(o.routes, iid);
      if (o_) return o_;
    }
  };

  // 全选
  const handleSelectAll = (value) => setSelectedBtns({ ...selectedBtns, ...value });

  // 选择权限
  const handleSelectData = (value) => setSelectedDatas({ ...selectedDatas, ...value });

  // table 表头
  const getColumns = [
    {
      title: '菜单名称',
      dataIndex: 'accessName',
      width: 150,
    },
    {
      title: '数据权限',
      dataIndex: 'pidString',
      width: 150,
      render: (val, record) => {
        const buttonsItem = getParentId(router[2].routes, record.accessUrl) || {};
        const { data = true } = buttonsItem;
        return (
          !record.children &&
          data && (
            <Select
              showSearch
              defaultValue="1"
              value={selectedDatas[record.authAccessId]}
              disabled={selectedRowKeys.indexOf(record.authAccessId) == -1}
              onChange={(value) => handleSelectData({ [record.authAccessId]: value })}
              dropdownMatchSelectWidth={false}
              style={{ width: 150 }}
              optionFilterProp="children"
            >
              {WORKER_ROLEDATA_TYPE.map((item) => (
                <Select.Option value={`${item.value}`} key={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )
        );
      },
    },
    {
      title: '操作权限',
      dataIndex: 'authAccessId',
      render: (val, record) => {
        const disabled = selectedRowKeys.indexOf(val) == -1;
        const buttonsItem = getParentId(router[2].routes, record.accessUrl);
        const checkBtnShow = buttonsItem && buttonsItem.buttons && buttonsItem.buttons.length;
        return checkBtnShow ? (
          <>
            <Checkbox
              disabled={disabled}
              checked={selectedBtns[val] && selectedBtns[val].length == buttonsItem.buttons.length}
              onChange={(e) =>
                // 全选操作，false 则值为空
                handleSelectAll({
                  [val]: e.target.checked ? buttonsItem.buttons.map((item) => item.value) : [],
                })
              }
            >
              全选
            </Checkbox>
            <br></br>
            <Checkbox.Group
              disabled={disabled}
              value={selectedBtns[val]}
              options={buttonsItem.buttons}
              onChange={(valKey) => handleSelectAll({ [val]: valKey })}
            />
          </>
        ) : (
          ''
        );
      },
    },
  ];

  return (
    <Table
      size="small"
      loading={loading}
      dataSource={treeList}
      columns={getColumns}
      rowKey={(record) => `${record.authAccessId}`}
      pagination={false}
      expandable={{
        defaultExpandAllRows: true,
      }}
      rowSelection={{
        fixed: true,
        checkStrictly: false,
        selectedRowKeys,
        onChange: (val, record) => {
          const newPid = Array.from(
            new Set(record.map((item) => item.pidString).filter((i) => i != 0)),
          );
          const newPArr = Array.from(new Set([...val, ...newPid]));
          setSelectedPKeys(newPArr);
          setSelectedRowKeys(val);
        },
      }}
    ></Table>
  );
};

export default connect(({ sysMenuList, loading }) => ({
  treeList: sysMenuList.list,
  loading: loading.models.sysMenuList,
}))(RoleTableForm);
