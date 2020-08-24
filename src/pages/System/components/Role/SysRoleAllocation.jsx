import React, { useState } from 'react';
import { connect } from 'dva';
import { Modal, Form, Checkbox } from 'antd';
import styles from './style.less';

// 表单排版
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

const SysRoleAllocation = (props) => {
  const { visible, initialValues, dataList = [], setVisible } = props;

  const { show = false, record = '' } = visible;

  const [form] = Form.useForm();
  const [treeKey] = useState(() =>
    dataList.map((item) => ({ [item.id]: item.children.map((ctiem) => ctiem.id) })),
  );

  // 确认
  const handleUpdata = (close) => {
    form.validateFields().then((values) => {
      console.log(form.getFieldsValue());
      // dispatch({
      //   type: 'businessList/fetchMerchantSet',
      //   payload: {
      //     ...values,
      //   },
      //   callback: () => {
      //     onClose();
      //     cRef.current.fetchGetData();
      //   },
      // });
    });
  };

  let parentIdObj = [];
  const mapCheckedKeys = (arr) => {
    arr.map((item) => {
      parentIdObj.push(item.id);
      if (item.children) {
        mapCheckedKeys(item.children);
      }
    });
    return parentIdObj;
  };

  const handleSelectFirst = (e, item, pid, arr) => {
    const oldData = form.getFieldsValue().tiA;
    let ary = [];
    ary = mapCheckedKeys([item]);
    setTimeout(() => {
      if (pid && e.target.checked) {
        form.setFieldsValue({
          tiA: Array.from(new Set([...oldData, item.id, pid])).filter((i) => i),
        });
      } else if (pid && !e.target.checked) {
        const treeObj = treeKey.filter((items) => items[pid])[0][pid];
        const newArr = form.getFieldsValue().tiA;
        const keylength = treeObj.filter((key) => newArr.indexOf(key) > -1).length;
        if (!keylength) {
          form.setFieldsValue({
            tiA: Array.from(new Set([...newArr])).filter((i) => i !== pid),
          });
        }
        return;
      } else if (e.target.checked) {
        form.setFieldsValue({ tiA: Array.from(new Set([...oldData, ...ary])).filter((i) => i) });
        parentIdObj = [];
      } else {
        form.setFieldsValue({ tiA: oldData.filter((id) => ary.indexOf(id) === -1) });
        parentIdObj = [];
      }
    }, 0);
  };

  const checkForm = dataList.map((item) => (
    <React.Fragment key={item.name}>
      <tr>
        <td>
          <Checkbox value={item.id} onChange={(e) => handleSelectFirst(e, item)}>
            {item.name}
          </Checkbox>
        </td>
        <td>
          <Checkbox
            value={item.children[0].id}
            onChange={(e) => handleSelectFirst(e, item.children[0], item.id)}
          >
            {item.children[0].name}
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
      {item.children.slice(1).map((other) => (
        <tr key={other.name}>
          <td></td>
          <td>
            <Checkbox value={other.id} onChange={(e) => handleSelectFirst(e, other, item.id)}>
              {other.name}
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
  ));

  return (
    <Modal
      title="角色配置"
      width={800}
      destroyOnClose
      visible={show}
      onCancel={setVisible}
      onOk={() => handleUpdata()}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="horizontal"
        initialValues={initialValues || { tiA: [] }}
        {...formItemLayout}
        scrollToFirstError={true}
      >
        <Form.Item name="tiA" noStyle>
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

export default SysRoleAllocation;
