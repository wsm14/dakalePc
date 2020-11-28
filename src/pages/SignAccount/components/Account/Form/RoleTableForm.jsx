import React, { useState, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Table, Checkbox, Select } from 'antd';
import { WORKER_ROLEDATA_TYPE, ROLE_BUTTON_TYPE } from '@/common/constant';
import router from '../../../../../../config/router.config';

const RoleTableForm = (props) => {
  const { loading, treeList, cRef, userInfo } = props;
  // 选择的菜单
  const [selectedRowKeys, setSelectedRowKeys] = useState(userInfo.selectedRowKeys || []);
  // 选择的菜单ID
  const [selectedPKeys, setSelectedPKeys] = useState(userInfo.selectedRowKeys || []);
  // 选择的按钮
  const [selectedBtns, setSelectedBtns] = useState(userInfo.selectedBtns || {});
  // 选择的数据
  const [selectedDatas, setSelectedDatas] = useState(userInfo.selectedDatas || {});

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchGetData: () => {
      return {
        selectedBtns,
        selectedDatas,
        selectedRowKeys: selectedPKeys,
      };
    },
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
      dataIndex: 'accessUrl',
      width: 150,
      render: (val, record) => {
        return (
          !record.children && (
            <Select
              showSearch
              defaultValue="1"
              value={selectedDatas[record.accessIdString]}
              disabled={selectedRowKeys.indexOf(record.accessIdString) == -1}
              onChange={(value) => handleSelectData({ [record.accessIdString]: value })}
              dropdownMatchSelectWidth={false}
              style={{ width: 150 }}
              optionFilterProp="children"
            >
              {/* 可选数据权限选项 */}
              {WORKER_ROLEDATA_TYPE.filter((i) => i.value <= Number(record.dataType)).map(
                (item) => (
                  <Select.Option value={`${item.value}`} key={item.value}>
                    {item.name}
                  </Select.Option>
                ),
              )}
            </Select>
          )
        );
      },
    },
    {
      title: '操作权限',
      dataIndex: 'accessIdString',
      render: (val, record) => {
        // const disabled = selectedRowKeys.indexOf(val) == -1;
        // const buttonsItem = getParentId(router[2].routes, record.accessUrl);
        // const checkBtnShow = buttonsItem && buttonsItem.buttons && buttonsItem.buttons.length;
        const disabled = selectedRowKeys.indexOf(val) == -1;
        // 按钮映射回显
        const buttonsItem = record.buttons
          ? record.buttons.map((item) => ({
              value: item,
              label: ROLE_BUTTON_TYPE[item],
            }))
          : [];
        const checkBtnShow = record.buttons;
        return checkBtnShow ? (
          <>
            <Checkbox
              disabled={disabled}
              checked={selectedBtns[val] && selectedBtns[val].length == buttonsItem.length}
              onChange={(e) =>
                // 全选操作，false 则值为空
                handleSelectAll({
                  [val]: e.target.checked ? buttonsItem.map((item) => item.value) : [],
                })
              }
            >
              全选
            </Checkbox>
            <br></br>
            <Checkbox.Group
              disabled={disabled}
              value={selectedBtns[val]}
              options={buttonsItem}
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
    <>
      <Table
        size="small"
        loading={loading}
        dataSource={treeList}
        columns={getColumns}
        rowKey={(record) => `${record.accessUrl}`}
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
    </>
  );
};

export default connect(({ roleSetting, loading }) => ({
  treeList: roleSetting.userMenu,
  loading: loading.models.roleSetting,
}))(RoleTableForm);
