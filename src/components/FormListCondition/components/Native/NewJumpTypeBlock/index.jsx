import React from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { Input, Select } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 选择跳转类型后展示的表单
 * @param {Array} nativeList 跳转原生页面后端映射
 * @param {Boolean} showUrl 展示表单类型 h5 inside
 * @param {Function} setShowApi inside 原生页面时 获取对应参数 展示自定义表单
 * @param {Function} setParamKey inside 原生页面时 app 跳转需要的参数键
 */
const JumpTypeBlock = ({ nativeList, showUrl = false, setShowApi, setParamKey = {} }) => {
  if (!showUrl) return null;
  return {
    无: null,
    H5: (
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
  }[showUrl];
};
export default connect(({ baseData }) => ({
  nativeList: baseData.nativeList,
}))(JumpTypeBlock);
