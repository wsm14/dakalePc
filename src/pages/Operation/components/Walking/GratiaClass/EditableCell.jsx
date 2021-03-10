import React from 'react';
import { connect } from 'umi';
import { Input, Select, Form } from 'antd';

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
  dispatch,
  ...restProps
}) => {
  const inputNode =
    inputType === 'select' ? (
      <Select
        placeholder="请选择"
        onChange={onChange}
        options={tradeList.map((item) => ({
          label: item.categoryName,
          value: item.categoryIdString,
        }))}
      />
    ) : (
      <Input maxLength={4} placeholder="最多输入4个字" />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: required === false ? false : true, message: `请确认${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default connect(({ sysTradeList }) => ({
  tradeList: sysTradeList.list.list,
}))(EditableCell);
