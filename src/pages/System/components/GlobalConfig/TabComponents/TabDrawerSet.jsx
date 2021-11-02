import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { TABINDEX_VIDEO_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const TabDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef, TagObj, tabKey, version } = props;
  const { defaultTagNames, tagNames } = TagObj;
  const { show = false, type = 'add', detail = { area: 'detail' } } = visible;
  console.log(detail);
  const [form] = Form.useForm();
  const [areaType, setAreaType] = useState('detail');

  //保存
  const handleSave = () => {
    form.validateFields().then((values) => {
      const { cityCode, defaultTags = [], tags = [], ...ohter } = values;
      dispatch({
        type: {
          add: 'globalConfig/fetchIndexTabAdd',
          edit: 'globalConfig/fetchIndexTabEdit',
        }[type],
        payload: {
          ...ohter,
          area: areaType,
          userOs: tabKey,
          version: version,
          cityCode: cityCode && cityCode[1],
          configIndexTabId: detail?.configIndexTabId,
          defaultTags: defaultTags.toString(),
          tags: tags.toString(),
          flag: {
            add: 'addCity',
            edit: 'updateTag',
          }[type],
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };
  const modalProps = {
    visible: show,
    title: type === 'edit' ? '编辑' : '新增',
    loading: loading.effects['globalConfig/fetchTabIndexTag'],
    onClose,
    afterCallBack: () => {
      fetchTabIndexTag();
      setAreaType(detail.area);
    },
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['globalConfig/fetchIndexTabAdd'] ||
          loading.effects['globalConfig/fetchIndexTabEdit']
        }
      >
        保存
      </Button>
    ),
  };

  const formItems = [
    {
      label: '城市',
      name: 'cityCode',
      type: 'cascader',
      cityType: 'city',
      visible: areaType === 'detail',
    },
    {
      label: '选择标签（默认标签）',
      name: 'defaultTags',
      type: 'multiple',
      select: defaultTagNames,
      rules: [{ required: false }],
      fieldNames: {
        label: 'name',
        value: 'configMomentTagId',
      },
    },
    {
      label: '选择标签（UCG标签）',
      name: 'tags',
      type: 'multiple',
      select: tagNames,
      rules: [{ required: false }],
      fieldNames: {
        label: 'name',
        value: 'configMomentTagId',
      },
    },
    // {
    //   label: '标签介绍',
    //   type: 'textArea',
    //   name: 'introduce',
    // },
  ];

  // 获取选择标签
  const fetchTabIndexTag = () => {
    dispatch({
      type: 'globalConfig/fetchTabIndexTag',
      callback: (pickUpId) => type === 'add' && form.setFieldsValue({ defaultTags: [pickUpId] }),
    });
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading, globalConfig }) => ({
  TagObj: globalConfig.TagObj,
  loading: loading,
}))(TabDrawerSet);
