import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import debounce from 'lodash/debounce';
import { Select } from '@/components/FormCondition/formModule';
import { MARKET_JUMP_TYPE } from '@/common/constant';
import { Radio } from '@/components/FormCondition/formModule';
import NewJumpTypeBlock from './components/Native/NewJumpTypeBlock';
import AppJumpSet from './components/Native/AppJumpSet';

const FormItem = Form.Item;

/**
 * 全局跳转app h5 设置表单
 * @param {Array} jumpTypeSelect 自定义跳转类型入参
 * @param {Object} detail 表单回填参数
 * jumpUrlType 链接类型, nativeJumpType app打开的页面类型, param = {} app 跳转需要的参数键
 * @param {String} port 进入端口 user 用户 merchant 商家 mark 哒卡小程序
 * @param {Function} getJumpType 外围获取跳转类型 回调
 * @returns
 */
const NewNativeFormSet = ({
  jumpTypeSelect,
  detail = {},
  port = 'user',
  getJumpType,
  form,
  dispatch,
  virtualList,
  loading,
}) => {
  const [showUrl, setShowUrl] = useState(false); // 链接类型 h5 native
  const [showApi, setShowApi] = useState(false); // 打开的页面类型
  const [paramKey, setParamKey] = useState(['paramName', 'paramValue']); // app 跳转需要的参数键

  useEffect(() => {
    fetchGetJumpNative(); // 获取后端配置的 app打开的页面类型 和 参数键值对
    fetchWalkManageNavigation(); // 获取风向标

    detail.preferentialActivityId &&
      fetchPagePreferentialActivity({ preferentialActivityId: detail.preferentialActivityId });
  }, []);

  useEffect(() => {
    // form.setFieldsValue({ preferentialActivityId: undefined });
  }, [showUrl, showApi]);

  // 获取后端配置的 app打开的页面类型 和 参数键值对
  const fetchGetJumpNative = () => {
    dispatch({
      type: 'baseData/fetchGetJumpNative',
      callback: () => {
        const { jumpUrlType } = detail;
        if (!jumpUrlType) form.setFieldsValue({ jumpUrlType: '' });
        setShowUrl(jumpUrlType); // 表单回填参数 链接类型
      },
    });
  };

  // 获取风向标
  const fetchWalkManageNavigation = () => {
    dispatch({
      type: 'walkingManage/fetchWalkManageNavigation',
    });
  };

  // 搜索选择优惠比例
  const fetchPagePreferentialActivity = debounce((data) => {
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

  return (
    <>
      <FormItem
        required
        key={`jumpUrlType`}
        label="跳转类型"
        name={'jumpUrlType'}
        style={{ maxWidth: '100%' }}
      >
        <Radio
          select={
            jumpTypeSelect ||
            (['mark', 'merchant'].includes(port)
              ? (({ native, ...other }) => other)(MARKET_JUMP_TYPE) // 商家端 哒卡小程序进入时映射
              : MARKET_JUMP_TYPE) // 默认进入映射
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
        detail={detail}
        showUrl={showUrl}
        setShowApi={setShowApi}
        setParamKey={setParamKey}
      ></NewJumpTypeBlock>
      {/* 跳转原生页面表单 */}
      <AppJumpSet form={form} showApi={showApi} paramKey={paramKey}></AppJumpSet>
      {/* 优惠活动名称 */}
      {showUrl && (
        <FormItem
          label="选择优惠比例"
          name="preferentialActivityId"
          rules={[{ required: true, message: `请选择优惠比例` }]}
          hidden={['phoneBill', 'memberRecharge'].includes(showApi)}
        >
          <Select
            placeholder={'请输入搜索'}
            fieldNames={{
              label: 'name',
              value: 'preferentialActivityId',
            }}
            filterOption={false}
            select={virtualList}
            loading={loading}
            onSearch={(activityName) =>
              fetchPagePreferentialActivity(activityName ? { activityName } : '')
            }
          ></Select>
        </FormItem>
      )}
    </>
  );
};

export default connect(({ baseData, loading }) => ({
  virtualList: baseData.virtualList.list,
  loading: loading.effects['baseData/fetchPagePreferentialActivity'],
}))(NewNativeFormSet);
