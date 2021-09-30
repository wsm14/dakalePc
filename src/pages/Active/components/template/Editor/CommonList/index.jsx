import React, { useImperativeHandle, useState } from 'react';
import { Form, Button } from 'antd';
import GoodsSelectModal from './components/GoodsSelectModal';
import FormList from './FormList';
import EditorForm from '../editorForm';
import showDomJs from './showDom';
import list_1 from './img/list_1.png';
import list_2 from './img/list_2.png';
import list_3 from './img/list_3.png';
import '../index.less';

/**
 * 商品列表
 */
const CommonList = (props) => {
  const { value = {}, cRef, form } = props;

  const [visible, setVisible] = useState(false);

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((content) => {
        return content;
      });
    },
  }));

  const formItems = [
    {
      label: '模块样式',
      name: 'styleIndex',
      type: 'classSelect',
      required: true,
      select: [list_1, list_2, list_3],
    },
  ];

  return (
    <div className="active_template_editor_group">
      <div className="active_title">基础配置</div>
      {/* <div className="active_title_msg">图片默认宽度100%，高度自适应</div> */}
      <EditorForm formItems={formItems} initialValues={value || { styleIndex: 0 }} form={form}>
        <div className="active_title">选择商品</div>
        <Form.List
          name="list"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('请至少选择1个商品'));
                }
              },
            },
          ]}
        >
          {(fields, { remove, move }, { errors }) => {
            return (
              <>
                <Form.ErrorList errors={errors} />
                {fields.map((field, i) => (
                  <FormList
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                    move={move}
                  ></FormList>
                ))}
                <Form.Item>
                  <Button disabled={fields.length === 50} block onClick={() => setVisible(true)}>
                    {fields.length} / {50} 选择商品
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </EditorForm>
      <GoodsSelectModal
        form={form}
        visible={visible}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </div>
  );
};

// 回显dom
CommonList.dom = showDomJs;

export default CommonList;
