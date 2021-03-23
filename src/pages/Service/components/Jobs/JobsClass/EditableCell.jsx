import React from 'react';
import { connect } from 'umi';
import { Input, Form } from 'antd';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  required,
  onChange,
  tradeList,
  nowTrade,
  dispatch,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: required === false ? false : true, message: `请确认${title}!` }]}
        >
          <Input placeholder="请输入职位名称" />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default connect(({ walkingManage, sysTradeList }) => ({
  nowTrade: walkingManage.nowTrade,
  tradeList: sysTradeList.list.list,
}))(EditableCell);
