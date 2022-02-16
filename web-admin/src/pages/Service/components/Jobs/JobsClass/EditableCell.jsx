import React from 'react';
import { connect } from 'umi';
import { Input, Form } from 'antd';

const EditableCell = ({
  jobsClasslist,
  editing,
  dataIndex,
  title,
  children,
  required,
  dispatch,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            { required: true, message: `请确认${title}!` },
            {
              validator: (rule, value) => {
                if (jobsClasslist.some((item) => item.jobType === value)) {
                  return Promise.reject('职位已存在，请修改');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入职位名称" />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default connect(({ solicitJobs }) => ({
  jobsClasslist: solicitJobs.jobsClasslist,
}))(EditableCell);
