import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import debounce from 'lodash/debounce';
import { Input, Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 选择跳转类型后展示的表单
 * @param {Array} nativeList 跳转原生页面后端映射
 * @param {Boolean} showUrl 展示表单类型 h5 inside
 * @param {Function} setShowApi inside 原生页面时 获取对应参数 展示自定义表单
 * @param {Function} setParamKey inside 原生页面时 app 跳转需要的参数键
 */
const JumpTypeBlock = ({
  form,
  nativeList,
  showUrl = false,
  detail = {},
  setShowApi,
  setParamKey = {},
  resourceList,
  loading,
  dispatch,
}) => {
  if (!['无', 'h5', 'native', 'inside', 'template'].includes(showUrl)) return null;

  useEffect(() => {
    // 跳转app 修改回显
    const { nativeJumpType, jumpUrlType } = detail; // 获取详情类型
    if (
      (showUrl === 'native' || showUrl === 'inside') &&
      jumpUrlType !== 'h5' &&
      jumpUrlType !== ''
    ) {
      const nativeIndex = nativeList.findIndex((i) => i.value === nativeJumpType);
      setParamKey(() => {
        setShowApi(nativeJumpType); // 表单回填参数 app打开的页面类型
        return nativeList[nativeIndex]?.paramKey || [];
      }); // 表单回填参数 app 跳转需要的参数键
    }
    detail.resourceTemplateContentId &&
      fetchContentList({ resourceTemplateContentId: detail.resourceTemplateContentId });
  }, []);

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

  return {
    无: null,
    h5: (
      <FormItem
        key={`jumpUrl`}
        label="链接"
        name={'jumpUrl'}
        rules={[
          { required: true, message: `请输入链接` },
          {
            type: 'url',
            message: '请输入正确链接格式',
          },
        ]}
        style={{ maxWidth: '100%' }}
      >
        <Input placeholder={'请输入链接'}></Input>
      </FormItem>
    ),
    // 原生页面
    native: (
      <FormItem
        key={`nativeJumpType`}
        label="跳转内容"
        name={'nativeJumpType'}
        rules={[{ required: true, message: `请选择跳转内容` }]}
        style={{ maxWidth: '100%' }}
      >
        <Select
          label="跳转内容"
          select={nativeList.filter((item) => item.value !== 'windVaneCategory')}
          placeholder={'请选择跳转内容'}
          onChange={(val, item) => {
            console.log(val, item);
            setParamKey(item.option.paramKey);
            setShowApi(val);
          }}
        ></Select>
      </FormItem>
    ),
    template: (
      <FormItem
        label="资源位内容"
        name="resourceTemplateContentId"
        rules={[{ required: true, message: `请选择资源位内容` }]}
      >
        <Select
          placeholder={'请选择'}
          select={resourceList}
          loading={loading}
          onSearch={(name) => fetchContentList(name ? { name } : '')}
        ></Select>
      </FormItem>
    ),
  }[showUrl];
};
export default connect(({ baseData, loading }) => ({
  resourceList: baseData.resourceList,
  nativeList: baseData.nativeList,
  loading: loading.effects['baseData/fetchPageResourceTemplateContent'],
}))(JumpTypeBlock);
