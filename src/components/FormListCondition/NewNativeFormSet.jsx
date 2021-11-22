import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { MARKET_JUMP_TYPE } from '@/common/constant';
import { Radio } from '@/components/FormCondition/formModule';
import NewJumpTypeBlock from './components/Native/NewJumpTypeBlock';
import AppJumpSet from './components/Native/AppJumpSet';

const FormItem = Form.Item;

/**
 * 全局跳转app h5 设置表单
 * @param {Object} detail 表单回填参数
 * jumpType 链接类型, nativeJumpType app打开的页面类型, param = {} app 跳转需要的参数键
 * @param {String} port 进入端口 user 用户 merchant 商家
 * @param {Function} getJumpType 外围获取跳转类型 回调
 * @returns
 */
const NewNativeFormSet = ({ detail = {}, port = 'user', getJumpType, form, dispatch }) => {
  const [showUrl, setShowUrl] = useState(false); // 链接类型 h5 inside
  const [showApi, setShowApi] = useState(false); // 打开的页面类型
  const [paramKey, setParamKey] = useState(['paramName', 'paramValue']); // app 跳转需要的参数键

  useEffect(() => {
    const { jumpType, nativeJumpType, param = {} } = detail;
    if (!jumpType) form.setFieldsValue({ jumpType: '' });
    fetchGetJumpNative(); // 获取后端配置的 app打开的页面类型 和 参数键值对
    fetchWalkManageNavigation(); // 获取风向标
    setShowUrl(jumpType); // 表单回填参数 链接类型
    if (jumpType !== 'h5' && jumpType !== '') {
      setShowApi(nativeJumpType); // 表单回填参数 app打开的页面类型
      setParamKey(Object.keys(param)); // 表单回填参数 app 跳转需要的参数键
    }
  }, []);

  // 获取后端配置的 app打开的页面类型 和 参数键值对
  const fetchGetJumpNative = () => {
    dispatch({
      type: 'baseData/fetchGetJumpNative',
    });
  };

  // 获取风向标
  const fetchWalkManageNavigation = () => {
    dispatch({
      type: 'walkingManage/fetchWalkManageNavigation',
    });
  };

  return (
    <>
      <FormItem
        key={`jumpType`}
        label="跳转类型"
        name={'jumpType'}
        style={{ maxWidth: '100%' }}
        rules={[
          {
            required: true,
            validator: () => {
              return Promise.resolve();
            },
          },
        ]}
      >
        <Radio
          select={
            port === 'merchant' // 商家端进入时映射
              ? (({ native, ...other }) => other)(MARKET_JUMP_TYPE)
              : MARKET_JUMP_TYPE // 默认进入映射
          }
          onChange={(e) => {
            setShowUrl(e.target.value); // 设置跳转类型
            setShowApi(false); // 重置跳转类型的表单
            getJumpType && getJumpType(e.target.value); // 外围获取跳转类型
            form.setFieldsValue({ nativeJumpType: undefined }); // 重置 app 跳转映射
          }}
        ></Radio>
      </FormItem>
      {/* 选择跳转类型后展示的表单 */}
      <NewJumpTypeBlock
        form={form}
        showUrl={showUrl}
        setShowApi={setShowApi}
        setParamKey={setParamKey}
      ></NewJumpTypeBlock>
      {/* 跳转原生页面表单 */}
      <AppJumpSet form={form} showApi={showApi} paramKey={paramKey}></AppJumpSet>
    </>
  );
};

export default connect()(NewNativeFormSet);
