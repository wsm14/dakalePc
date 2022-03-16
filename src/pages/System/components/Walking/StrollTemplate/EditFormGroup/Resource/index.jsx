import React, { useImperativeHandle } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import aliOssUpload from '@/utils/aliOssUpload';
import EditorForm from '../editorForm';

/**
 * 单图配置
 */
const Resource = (props) => {
  const { id, value = {}, cRef, form, virtualList, resourceList, loading, dispatch } = props;

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getContent: () => {
      return form.validateFields().then((content) => {
        return { isModuleConfig: 1, ...content };
      });
    },
  }));

  // 搜索资源位内容
  const fetchContentList = debounce((data) => {
    if (!data) return;
    dispatch({
      type: 'baseData/fetchPageResourceTemplateContent',
      payload: {
        deleteFlag: 1,
        ...data,
      },
    });
  }, 500);

  // 搜索选择优惠比例
  const fetchClassifyGetMre = debounce((data) => {
    if (!data) return;
    dispatch({
      type: 'baseData/fetchPagePreferentialActivity',
      payload: {
        type: 'assembly',
        preferentialDefaultType: 'otherDefault',
        ...data,
      },
    });
  }, 500);

  const formItems = [
    {
      label: '资源位内容',
      name: 'resourceTemplateContentId',
      type: 'select',
      select: resourceList,
      loading: loading,
      onSearch: (name) => {
        fetchContentList(name ? { name } : '');
      },
    },
    {
      label: '选择优惠比例',
      name: 'preferentialActivityId',
      type: 'select',
      select: virtualList,
      loading: loading,
      required: true,
      fieldNames: {
        label: 'name',
        value: 'preferentialActivityId',
      },
      onSearch: (activityName) => {
        fetchClassifyGetMre(activityName ? { activityName } : '');
      },
    },
  ];

  return (
    <div className="active_template_editor_group">
      <EditorForm formItems={formItems} id={id} initialValues={value || {}} form={form} />
    </div>
  );
};

export default connect(({ baseData, loading }) => ({
  resourceList: baseData.resourceList,
  virtualList: baseData.virtualList.list,
  loading:
    loading.effects['baseData/fetchPagePreferentialActivity'] ||
    loading.effects['baseData/fetchPageResourceTemplateContent'],
}))(Resource);
