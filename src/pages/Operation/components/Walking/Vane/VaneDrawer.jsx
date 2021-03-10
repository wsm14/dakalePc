import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { VANE_URL_TYPE } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';

const VaneDrawer = (props) => {
  const { navigation, dispatch, cRef, visible, onClose, loading } = props;

  const { show = false, type = 'add', detail = '' } = visible;
  const [form] = Form.useForm();
  const [showPop, setShowPop] = useState(false); // 显示气泡
  const [showUrl, setShowUrl] = useState(false); // 显示选择框或者URL

  const allProps = {
    add: {
      title: '新增',
      api: 'walkingManage/fetchWalkManageVaneAdd',
    },
    edit: {
      title: '修改',
      api: 'walkingManage/fetchWalkManageVaneEditDel',
    },
    detail: {
      title: '详情',
    },
  }[type];

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { image, bubbleFlag = 0 } = values;
      // 上传图片到oss -> 提交表单
      aliOssUpload(image).then((res) => {
        dispatch({
          type: allProps.api,
          payload: {
            configWindVaneId: detail.configWindVaneId,
            ...values,
            bubbleFlag: Number(bubbleFlag),
            image: res.toString(),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '显示名称',
      name: 'name',
      maxLength: 6,
    },
    {
      label: '显示图标',
      type: 'upload',
      name: 'image',
      maxFile: 1,
      extra: '请上传XX*XX尺寸png、jpeg格式图片',
    },
    {
      label: '显示气泡',
      type: 'switch',
      name: 'bubbleFlag',
      rules: [{ required: false }],
      onChange: setShowPop,
      show: false,
    },
    {
      label: '气泡内容',
      name: 'bubbleContent',
      visible: showPop,
      maxLength: 4,
    },
    {
      label: '跳转类型',
      type: 'radio',
      name: 'jumpType',
      select: VANE_URL_TYPE,
      onChange: (e) => setShowUrl(e.target.value),
      render: (val) => VANE_URL_TYPE[val],
    },
    {
      label: '链接',
      name: 'jumpUrl',
      visible: showUrl === 'url',
      show: showUrl === 'url',
    },
    {
      label: '选择场景',
      type: 'treeSelect',
      name: 'scenesId',
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
      visible: showUrl === 'scenes',
      show: false,
    },
  ];

  const modalProps = {
    title: allProps.title,
    visible: show,
    onClose,
    afterCallBack: () => {
      setShowPop(detail.bubbleFlag);
      setShowUrl(detail.jumpType || false);
    },
    footer: type !== 'detail' && (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {type === 'detail' ? (
        <DescriptionsCondition initialValues={detail} formItems={formItems}></DescriptionsCondition>
      ) : (
        <FormCondition initialValues={detail} formItems={formItems} form={form} />
      )}
    </DrawerCondition>
  );
};

export default connect(({ walkingManage, loading }) => ({
  navigation: walkingManage.navigation,
  loading: loading.models.walkingManage,
}))(VaneDrawer);
