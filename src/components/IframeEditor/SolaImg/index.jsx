import React, { useImperativeHandle, useState } from 'react';
import { Tabs } from 'antd';
import EditorForm from '../editorForm';
import aliOssUpload from '@/utils/aliOssUpload';
import SourceSet from './source';
import styles from './index.less';

const SolaImg = (props) => {
  const { form, initialValues, showPanel, cRef } = props;

  const [tabs, setTabs] = useState(initialValues && initialValues.apiUrl ? '2' : '1');
  const [linkType, setLinkType] = useState((initialValues && initialValues.linkType) || '');

  const formItems = [
    {
      label: '图片',
      name: 'data',
      type: 'upload',
      required: true,
      isCut: true,
      ratio: 375 / showPanel.height,
      maxFile: 1,
      className: styles.ifame_solaImg,
    },
    {
      label: '跳转形式',
      name: 'linkType',
      type: 'radio',
      select: [
        { value: '', name: '无' },
        { value: 'h5', name: 'h5' },
        { value: 'navite', name: 'App页面' },
      ],
      onChange: (e) => {
        form.setFieldsValue({ link: undefined });
        setLinkType(e.target.value);
      },
    },
    {
      label: '链接',
      name: 'link',
      visible: linkType == 'h5',
    },
    {
      label: 'App页面',
      type: 'select',
      name: 'link',
      select: [
        { value: '', name: '商家页面' },
        { value: 'h5', name: '商品页面' },
        { value: 'navite', name: '卡豆乐园' },
      ],
      visible: linkType == 'navite',
    },
  ];

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((content) => {
        return aliOssUpload(content.data).then((res) => {
          return { ...content, data: res.toString() };
        });
      });
    },
  }));

  return (
    <Tabs type="card" onChange={setTabs} activeKey={tabs}>
      <Tabs.TabPane tab="自定义" key="1">
        {tabs == 1 && (
          <EditorForm formItems={formItems} initialValues={initialValues} form={form}></EditorForm>
        )}
      </Tabs.TabPane>
      <Tabs.TabPane tab="数据源" key="2">
        {tabs == 2 && <SourceSet form={form} initialValues={initialValues}></SourceSet>}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default SolaImg;
