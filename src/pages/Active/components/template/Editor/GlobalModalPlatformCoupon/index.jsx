import React, { useImperativeHandle, useState } from 'react';
import { Form, Button, Tabs } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import GoodsSelectModal from './components/GoodsSelectModal';
import FormList from './FormList';
import EditorForm from '../editorForm';
import showDomJs from './showDom';

const { TabPane } = Tabs;

/**
 * 商品列表
 */
const CommonList = (props) => {
  const { value = {}, cRef, form } = props;

  const [visible, setVisible] = useState(false);

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then(async (content) => {
        const box_head = await aliOssUpload(content.box_head);
        const box_title = await aliOssUpload(content.box_title);
        const coupon_get = await aliOssUpload(content.coupon_get);
        const coupon_bag = await aliOssUpload(content.coupon_bag);
        const coupon_end = await aliOssUpload(content.coupon_end);
        return { ...content, box_head, box_title, coupon_get, coupon_bag, coupon_end };
      });
    },
  }));

  const base = [
    {
      label: '顶部装饰图',
      name: 'box_head',
      type: 'upload',
      maxFile: 1,
      required: true,
    },
    {
      label: '卡券背景图',
      name: 'coupon_bag',
      type: 'upload',
      maxFile: 1,
      required: true,
    },
    {
      label: '弹窗背景色1',
      name: 'box_bag1',
      required: true,
      extra: '颜色1 和 颜色2 不同会显示渐变色，颜色相同则无渐变',
    },
    {
      label: '弹窗背景色2',
      name: 'box_bag2',
      required: true,
      extra: '颜色1 和 颜色2 不同会显示渐变色，颜色相同则无渐变',
    },
    {
      label: '标题图片',
      name: 'box_title',
      type: 'upload',
      maxFile: 1,
      required: true,
      extra: '标题顶部居中显示',
    },
    {
      label: '标题图片宽',
      name: 'title_width',
      type: 'number',
      required: true,
      extra: '默认 540px，高度自适应',
    },
  ];

  const btn = [
    {
      label: '领取按钮图片',
      name: 'coupon_get',
      type: 'upload',
      maxFile: 1,
      required: true,
      extra: '按钮底部居中显示',
    },
    {
      label: '已领完按钮图片',
      name: 'coupon_end',
      type: 'upload',
      maxFile: 1,
      required: true,
    },
    {
      label: '按钮图片宽',
      name: 'btn_width',
      type: 'number',
      required: true,
      extra: '默认 400px',
    },
    {
      label: '按钮图片高',
      name: 'btn_height',
      type: 'number',
      required: true,
      extra: '默认 80px',
    },
  ];

  return (
    <div className="active_template_editor_group">
      <Tabs type="card">
        <TabPane forceRender tab="选择券" key="1">
          <EditorForm initialValues={value || {}} form={form}>
            <Form.List
              name="list"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      return Promise.reject(new Error('请至少选择1个券'));
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
                      <Button disabled={fields.length === 5} block onClick={() => setVisible(true)}>
                        {fields.length} / {5} 选择券
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List>
          </EditorForm>
        </TabPane>
        <TabPane forceRender tab="弹窗配置" key="2">
          <EditorForm initialValues={value || {}} formItems={base} form={form}></EditorForm>
        </TabPane>
        <TabPane forceRender tab="按钮配置" key="3">
          <EditorForm initialValues={value || {}} formItems={btn} form={form}></EditorForm>
        </TabPane>
      </Tabs>
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
