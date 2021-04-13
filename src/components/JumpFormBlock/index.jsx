import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { BANNER_JUMP_TYPE } from '@/common/constant';
import { Radio, Input, Select, TreeSelect } from '@/components/FormCondition/formModule';
import FormCondition from '@/components/FormCondition';

const FormItem = Form.Item;

const JumpFormBlock = ({ navigation, form, dispatch }) => {
  const [showUrl, setShowUrl] = useState(false); // 链接类型
  const [showApi, setShowApi] = useState(false); // 打开的页面类型

  useEffect(() => {
    fetchWalkManageNavigation();
  }, []);

  // 获取风向标
  const fetchWalkManageNavigation = () => {
    dispatch({
      type: 'walkingManage/fetchWalkManageNavigation',
    });
  };

  const scenesProps = {
    label: '选择场景',
    multiple: true,
    showCheckedStrategy: 'SHOW_ALL',
    select: navigation.list.map(
      ({
        categoryIdString: categoryScenesId,
        categoryName: scenesName,
        categoryScenesDTOList,
      }) => ({ categoryScenesId, scenesName, categoryScenesDTOList, disabled: true }),
    ),
    fieldNames: {
      label: 'scenesName',
      value: 'categoryScenesId',
      children: 'categoryScenesDTOList',
    },
  };

  // 选择跳转类型后展示的表单
  const jumpTypeBlock = {
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
    inside: (
      <FormItem
        key={`jumpContent`}
        label="跳转内容"
        name={'jumpContent'}
        rules={[{ required: true, message: `请选择跳转内容` }]}
        style={{ maxWidth: '100%' }}
      >
        <Select
          label="跳转内容"
          select={[
            { name: '1', value: '1', type: 'list' },
            { name: '2', value: '12', type: 'list' },
            { name: '3', value: '13', type: 'list' },
            { name: '4', value: '14', type: 'tag' },
          ]}
          placeholder={'请选择跳转内容'}
          onChange={(val, item) => setShowApi(item.option.type)}
        ></Select>
      </FormItem>
    ),
  };

  return (
    <>
      <FormItem
        key={`jumpType`}
        label="跳转类型"
        name={'jumpType'}
        rules={[{ required: true, message: `请确认跳转类型` }]}
        style={{ maxWidth: '100%' }}
      >
        <Radio
          select={BANNER_JUMP_TYPE}
          onChange={(e) => {
            setShowUrl(e.target.value);
            setShowApi(false);
            form.setFieldsValue({ jumpContent: undefined });
          }}
        ></Radio>
      </FormItem>
      {jumpTypeBlock[showUrl]}
      {showApi === 'tag' && (
        <FormItem
          key={`treeSelect`}
          label="选择风向标"
          name={'scenesId'}
          rules={[{ required: true, message: `请选择风向标` }]}
          style={{ maxWidth: '100%' }}
        >
          <TreeSelect {...scenesProps}></TreeSelect>
        </FormItem>
      )}
    </>
  );
};

export default connect(({ walkingManage, loading }) => ({
  navigation: walkingManage.navigation,
  loading: loading.effects['walkingManage/fetchWalkManageNavigation'],
}))(JumpFormBlock);
