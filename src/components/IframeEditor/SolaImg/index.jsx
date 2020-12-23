import React, { useImperativeHandle, useState } from 'react';
import { Tabs } from 'antd';
import EditorForm from '../editorForm';
import aliOssUpload from '@/utils/aliOssUpload';
import SourceSet from './source';
import SearchData from '../searchData/searchDataContent';
import { SearchOutlined } from '@ant-design/icons';
import { NATIVE_PATH_TYPE } from '../nativePath';
import styles from './index.less';

const SolaImg = (props) => {
  const { form, initialValues, showPanel, cRef } = props;

  const [tabs, setTabs] = useState(initialValues && initialValues.apiUrl ? '2' : '1');
  const [linkType, setLinkType] = useState((initialValues && initialValues.linkType) || '');
  const [linkPath, setLinkPath] = useState((initialValues && initialValues.path) || '');
  const [visibleSearch, setVisibleSearch] = useState({ visible: false, valueName: '', type: '' });

  const formItems = [
    {
      label: '图片',
      name: 'data',
      type: 'upload',
      required: true,
      isCut: true,
      ratio: showPanel.width / showPanel.height,
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
        { value: 'native', name: 'App页面' },
      ],
      onChange: (e) => {
        form.setFieldsValue({ path: undefined });
        setLinkType(e.target.value);
        setLinkPath('');
      },
    },
    {
      label: '链接',
      name: 'path',
      visible: linkType == 'h5',
      addonAfter: (
        <SearchOutlined
          onClick={() => setVisibleSearch({ visible: true, valueName: 'path', type: 'url' })}
        />
      ),
    },
    {
      label: 'App页面',
      type: 'select',
      name: 'path',
      visible: linkType == 'native',
      onChange: (value) => {
        form.setFieldsValue({ param: '' });
        setLinkPath(value);
        if (value === 'goMerchantBox')
          setVisibleSearch({ visible: true, valueName: 'param', type: 'merchant' });
      },
      select: NATIVE_PATH_TYPE,
    },
    {
      label: '数据',
      name: 'param',
      required: true,
      visible: linkPath == 'goMerchantBox',
      addonAfter: (
        <SearchOutlined
          onClick={() => setVisibleSearch({ visible: true, valueName: 'param', type: 'merchant' })}
        />
      ),
      disabled: true,
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
        <SearchData
          form={form}
          {...visibleSearch}
          onCancel={() => setVisibleSearch({ show: false })}
        ></SearchData>
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab="数据源" key="2">
        {tabs == 2 && <SourceSet form={form} initialValues={initialValues}></SourceSet>}
      </Tabs.TabPane> */}
    </Tabs>
  );
};

export default SolaImg;
