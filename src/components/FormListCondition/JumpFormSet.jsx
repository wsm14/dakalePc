import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { BANNER_JUMP_TYPE } from '@/common/constant';
import { Radio, Input, Select, TreeSelect } from '@/components/FormCondition/formModule';
import FormCondition from '@/components/FormCondition';

const FormItem = Form.Item;

const JumpFormBlock = ({ navigation, nativeList, form, dispatch, detail = {}, port = 'user' }) => {
  const [showUrl, setShowUrl] = useState(false); // 链接类型
  const [showApi, setShowApi] = useState(false); // 打开的页面类型
  const [paramKey, setParamKey] = useState(['paramName', 'paramValue']); // app 跳转需要的参数

  useEffect(() => {
    const { jumpUrlType, nativeJumpType, param = {} } = detail;
    fetchGetJumpNative();
    fetchWalkManageNavigation();
    setShowUrl(jumpUrlType);
    setShowApi(nativeJumpType);
    setParamKey(Object.keys(param));
  }, []);

  // 获取风向标
  const fetchWalkManageNavigation = () => {
    dispatch({
      type: 'walkingManage/fetchWalkManageNavigation',
    });
  };

  // 获取风向标
  const fetchGetJumpNative = () => {
    dispatch({
      type: 'baseData/fetchGetJumpNative',
    });
  };

  const scenesProps = {
    label: '选择场景',
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
        key={`nativeJumpType`}
        label="跳转内容"
        name={'nativeJumpType'}
        rules={[{ required: true, message: `请选择跳转内容` }]}
        style={{ maxWidth: '100%' }}
      >
        <Select
          label="跳转内容"
          select={nativeList}
          placeholder={'请选择跳转内容'}
          onChange={(val, item) => {
            setParamKey(item.option.paramKey);
            setShowApi(val);
          }}
        ></Select>
      </FormItem>
    ),
  };

  return (
    <>
      <FormItem
        key={`jumpUrlType`}
        label="跳转类型"
        name={'jumpUrlType'}
        rules={[{ required: true, message: `请确认跳转类型` }]}
        style={{ maxWidth: '100%' }}
      >
        <Radio
          select={
            port === 'merchant'
              ? (({ 无, H5 }) => ({ 无, H5 }))(BANNER_JUMP_TYPE)
              : BANNER_JUMP_TYPE
          }
          onChange={(e) => {
            setShowUrl(e.target.value);
            setShowApi(false);
            form.setFieldsValue({ nativeJumpType: undefined });
          }}
        ></Radio>
      </FormItem>
      {jumpTypeBlock[showUrl]}
      {showApi === 'vaneWind' && (
        <>
          <FormItem
            key={`treeSelect`}
            label="选择风向标"
            name={['param', paramKey[0]]}
            rules={[{ required: true, message: `请选择风向标` }]}
            style={{ maxWidth: '100%' }}
          >
            <TreeSelect
              {...scenesProps}
              onChange={(val, options, extra) => {
                const { node } = extra.allCheckedNodes[0];
                form.setFieldsValue({ param: { [paramKey[1]]: node.props.title } });
              }}
            ></TreeSelect>
          </FormItem>
          <FormItem key={`pamranOhter`} hidden={true} name={['param', paramKey[1]]}></FormItem>
        </>
      )}
      {showApi === 'activity' && (
        <>
          <FormItem
            key={`activityInput`}
            label="请输入参数"
            name={['param', paramKey[0]]}
            rules={[{ required: true, message: `请输入参数` }]}
            style={{ maxWidth: '100%' }}
          >
            <Input placeholder={'请输入参数'}></Input>
          </FormItem>
        </>
      )}
    </>
  );
};

export default connect(({ baseData, walkingManage, loading }) => ({
  navigation: walkingManage.navigation,
  nativeList: baseData.nativeList,
  loading: loading.effects['walkingManage/fetchWalkManageNavigation'],
}))(JumpFormBlock);
