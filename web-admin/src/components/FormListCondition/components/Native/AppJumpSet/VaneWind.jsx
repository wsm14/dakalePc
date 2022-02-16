import React from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { TreeSelect } from '@/components/FormCondition/formModule';

const FormItem = Form.Item;

/**
 * 风向标
 * @param {Array} paramKey app跳转参数键值
 */
const VaneWind = ({ paramKey, navigation, form }) => {
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

  return (
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
  );
};

export default connect(({ walkingManage }) => ({
  navigation: walkingManage.navigation,
}))(VaneWind);
