import React from 'react';
import { Form, Select, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const BusinessCateFormlist = (props) => {
  const { form, list = [] } = props;

  return (
    <Form.List name="configGoodsTagCategoryList">
      {(fields, { add, remove }, { errors }) => {
        const dataList = form.getFieldValue('configGoodsTagCategoryList');
        console.log(dataList);
        return (
          <>
            {fields.map((field, index) => (
              <Form.Item required={false} key={field.key}>
                <Form.Item
                  {...field}
                  name={[field.name, 'categoryId']}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[{ required: true, message: '请选择类目' }]}
                  noStyle
                >
                  <Select placeholder="选择一级行业类目" style={{ width: 200 }}>
                    {list.map((items) => (
                      <Select.Option
                        key={items.categoryId}
                        disabled={dataList.some((i) => i && i.categoryId === items.categoryId)}
                        value={items.categoryId}
                      >
                        {items.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {fields.length > 1 && index !== 0 ? (
                  <MinusCircleOutlined
                    style={{ marginLeft: 5 }}
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              ></Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
};
export default BusinessCateFormlist;
