import React, { useState, useImperativeHandle } from 'react';
import { connect } from 'umi';
import { Table, Checkbox } from 'antd';
import { ROLE_BUTTON_TYPE } from '@/common/roleConstant';
import router from '../../../../../../config/router.config';

const RoleTableForm = (props) => {
  /**
   * flag
   * 1 为当前所有系统菜单配置权限
   * 获取系统菜单配置 本地菜单做按钮映射
   * 0 为限制账户菜单配置权限
   * 调用接口获取菜单配置上限 按钮映射从菜单项目获取
   **/
  const { loading, userMenu, cRef, userInfo, serverMenu, flag = 1 } = props;

  // 选择的菜单
  const [selectedRowKeys, setSelectedRowKeys] = useState(userInfo.selectedRowKeys || []);
  // 选择的菜单ID
  const [selectedPKeys, setSelectedPKeys] = useState(userInfo.selectedPKeys || []);
  // 选择的按钮
  const [selectedBtns, setSelectedBtns] = useState(userInfo.selectedBtns || {});
  // // 选择的数据
  // const [selectedDatas, setSelectedDatas] = useState(userInfo.selectedDatas || {});

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchGetData: () => {
      return {
        selectedBtns,
        // selectedDatas,
        selectedRowKeys: Array.from(new Set([...selectedPKeys, ...selectedRowKeys])),
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

  // // 选择权限
  // const handleSelectData = (value) => setSelectedDatas({ ...selectedDatas, ...value });

  // table 表头
  const getColumns = [
    {
      title: '菜单名称',
      dataIndex: 'accessName',
      width: 150,
    },
    // 运营后台无数据权限配置
    // {
    //   title: '数据权限',
    //   dataIndex: 'accessUrl',
    //   width: 150,
    //   render: (val, record) => {
    //     return (
    //       !record.children && (
    //         <Select
    //           showSearch
    //           defaultValue="1"
    //           value={selectedDatas[record.accessIdString]}
    //           disabled={selectedRowKeys.indexOf(record.accessIdString) == -1}
    //           onChange={(value) => handleSelectData({ [record.accessIdString]: value })}
    //           dropdownMatchSelectWidth={false}
    //           style={{ width: 150 }}
    //           optionFilterProp="children"
    //         >
    //           {/* 可选数据权限选项 */}
    //           {WORKER_ROLEDATA_TYPE.filter((i) => i.value <= Number(record.dataType)).map(
    //             (item) => (
    //               <Select.Option value={`${item.value}`} key={item.value}>
    //                 {item.name}
    //               </Select.Option>
    //             ),
    //           )}
    //         </Select>
    //       )
    //     );
    //   },
    // },
    {
      title: '操作权限',
      dataIndex: 'accessIdString',
      render: (val, record) => {
        // 禁选状态
        const disabled = selectedRowKeys.indexOf(val) == -1;
        // 按钮数据获取 flag 0 时获取数据按钮
        let getButtonData = record;
        // flag 1 时按钮获取
        if (flag == 1) getButtonData = getParentId(router[2].routes, record.accessUrl);
        // 按钮映射回显
        const buttonsItem =
          getButtonData && getButtonData.buttons
            ? getButtonData.buttons.map((item) => ({
                value: item,
                label: ROLE_BUTTON_TYPE[item],
              }))
            : [];
        //是否渲染选择项目
        const checkBtnShow = buttonsItem.length > 0;
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
        dataSource={flag == 1 ? serverMenu : userMenu}
        columns={getColumns}
        rowKey={(record) => `${record.accessIdString}`}
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
            // pid
            setSelectedPKeys(newPArr);
            // 没有pid
            setSelectedRowKeys(val);
          },
        }}
      ></Table>
    </>
  );
};

export default connect(({ roleSetting, loading }) => ({
  userMenu: roleSetting.userMenu,
  serverMenu: roleSetting.serverMenu,
  loading: loading.models.roleSetting,
}))(RoleTableForm);
