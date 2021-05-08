import React, { useContext, useState, useEffect, useRef } from 'react';
import { Input, Form } from 'antd';
import styles from './style.less';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  maxLength,
  required,
  suffix,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [totalNum, setTotalNum] = useState(0); // 字数计算
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  const dataNum = maxLength && `${totalNum || 0}/${maxLength}`;
  if (editable) {
    childNode = editing ? (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Form.Item
          style={{
            margin: 0,
            flex: 1,
            marginRight: 10,
          }}
          name={dataIndex}
          rules={[
            {
              required: required == false ? false : true,
              message: `请输入${title}`,
            },
          ]}
        >
          <Input
            ref={inputRef}
            onPressEnter={save}
            onFocus={(e) => setTotalNum(e.target.value.length)}
            onChange={(e) => setTotalNum(e.target.value.length)}
            suffix={suffix ? dataNum : false}
            maxLength={maxLength}
          />
        </Form.Item>
        <a onClick={save} style={{ marginRight: 10 }}>
          保存
        </a>
        <a onClick={() => setEditing(!editing)}>取消</a>
      </div>
    ) : (
      <div
        className={styles['editable-cell-value-wrap']}
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export { EditableRow, EditableCell };
