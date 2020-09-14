import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Checkbox, Form } from 'antd';
import styles from './style.less';

const SysRoleAllocation = (props) => {
  const { visible, setVisible, loading, dispatch, cRef, form } = props;

  const {
    show = false,
    record: { idList = [], accessList = [], treeKeyList, roleId = '' },
  } = visible;

  const [treeKey, setTreeKey] = useState(treeKeyList);

  // 确认
  const handleUpdata = () => {
    form.validateFields().then(() => {
      dispatch({
        type: 'sysRoleList/fetchRoleMenuSet',
        payload: {
          roleId,
          ...form.getFieldsValue(),
        },
        callback: () => {
          setVisible();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  // 获取点击的父级以及所有子级id
  let parentIdObj = [];
  const mapCheckedKeys = (arr) => {
    arr.map((item) => {
      parentIdObj.push(item.idString);
      if (item.subAuthAccessDTOList) {
        mapCheckedKeys(item.subAuthAccessDTOList);
      }
    });
    return parentIdObj;
  };

  // 点击选择方法 没写选择中间态
  const handleSelectFirst = (e, item, pid) => {
    const oldData = form.getFieldsValue().accessIdList; // 获取当前选择id组
    let ary = [];
    ary = mapCheckedKeys([item]); // 获取点击的父级以及所有子级id
    setTimeout(() => {
      let accessIdList = [];
      // 子级选择后 父级同时选择
      if (pid && e.target.checked) {
        accessIdList = Array.from(new Set([...oldData, item.idString, pid])).filter((i) => i);
      } else if (pid && !e.target.checked) {
        // 子级取消 父级弱存在子级选择 则不取消否则同时取消
        const treeObj = treeKey.filter((items) => items[pid])[0][pid];
        const newArr = form.getFieldsValue().accessIdList;
        const keylength = treeObj.filter((key) => newArr.indexOf(key) > -1).length;
        if (!keylength) {
          accessIdList = Array.from(new Set([...newArr])).filter((i) => i !== pid);
          form.setFieldsValue({ accessIdList });
        }
        return;
      } else if (e.target.checked) {
        // 选择父级同时选择所有子级
        accessIdList = Array.from(new Set([...oldData, ...ary])).filter((i) => i);
        parentIdObj = [];
      } else {
        // 取消父级同时取消所有子级
        accessIdList = oldData.filter((id) => ary.indexOf(id) === -1);
        parentIdObj = [];
      }
      form.setFieldsValue({ accessIdList });
    }, 0);
  };

  // 列表内容遍历
  const checkForm = accessList.map((item) => {
    const { subAuthAccessDTOList: children, accessName: name } = item;

    return (
      <React.Fragment key={name}>
        <tr>
          <td>
            <Checkbox value={item.idString} onChange={(e) => handleSelectFirst(e, item)}>
              {name}
            </Checkbox>
          </td>
          <td>
            <Checkbox
              value={children[0].idString}
              onChange={(e) => handleSelectFirst(e, children[0], item.idString)}
            >
              {children[0].accessName}
            </Checkbox>
          </td>
          {/* <td>
          {item.children[0].children &&
            item.children[0].children.map((btn) => (
              <Checkbox value={btn.id} key={btn.name}>
                {btn.name}
              </Checkbox>
            ))}
        </td> */}
        </tr>
        {children.slice(1).map((other) => (
          <tr key={other.accessName}>
            <td></td>
            <td>
              <Checkbox
                value={other.idString}
                onChange={(e) => handleSelectFirst(e, other, item.idString)}
              >
                {other.accessName}
              </Checkbox>
            </td>
            {/* <td>
            {other.children &&
              other.children.map((btn) => (
                <Checkbox value={btn.id} key={btn.name}>
                  {btn.name}
                </Checkbox>
              ))}
          </td> */}
          </tr>
        ))}
      </React.Fragment>
    );
  });

  useEffect(() => {
    if (show) {
      setTreeKey(treeKeyList);
      form.setFieldsValue({ accessIdList: idList });
    }
  }, [show]);

  return (
    <Modal
      title="角色配置"
      width={800}
      destroyOnClose
      visible={show}
      onCancel={setVisible}
      onOk={() => handleUpdata()}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form form={form} preserve={false} layout="horizontal" scrollToFirstError={true}>
        <Form.Item name="accessIdList" noStyle>
          <Checkbox.Group style={{ width: '100%' }}>
            <table className={styles.tree_table}>
              <thead>
                <tr>
                  <th width={150}>模块</th>
                  <th width={150}>菜单</th>
                  {/* <th>按钮</th> */}
                </tr>
              </thead>
              <tbody>{checkForm}</tbody>
            </table>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.sysRoleList,
}))(SysRoleAllocation);
