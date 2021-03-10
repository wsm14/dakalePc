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
  nowTrade,
  dispatch,
  ...restProps
}) => {
  const inputNode =
    inputType === 'select' ? (
      <Select
        placeholder="请选择"
        onChange={onChange}
        // 排除已存在的类目不可再次选择，但修改时可显示当前类目
        options={tradeList
          .filter(
            (item) =>
              nowTrade.indexOf(item.categoryIdString) === -1 || item.categoryIdString == record.id,
          )
          .map((item) => ({
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

export default connect(({ walkingManage, sysTradeList }) => ({
  nowTrade: walkingManage.nowTrade,
  tradeList: sysTradeList.list.list,
}))(EditableCell);
