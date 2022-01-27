import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { BOTTOM_ICON_TYPE } from '@/common/constant';
import { NewNativeFormSet } from '@/components/FormListCondition';
import { BOTTOM_ICON_IMG } from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const BottomIconConfigSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef, tabKey } = props;
  const { show = false, detail } = visible;

  const [form] = Form.useForm();

  // 提交
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { icon, ...other } = values;
      const { configBottomCenterIconId } = detail;

      // 上传图片到oss -> 提交表单
      const iconImg = await aliOssUpload(icon);

      dispatch({
        type: 'globalConfig/fetchUpdateConfigBottomCenterIcon',
        payload: {
          ...other,
          configBottomCenterIconId,
          flag: 'updateConfig',
          icon: iconImg.toString(),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '底部中心icon',
      name: 'icon',
      type: 'upload',
      maxFile: 1,
      extra: '请上传132*88px的jpg、png、gif图片',
      imgRatio: BOTTOM_ICON_IMG,
    },
    {
      type: 'noForm',
      formItem: <NewNativeFormSet form={form} detail={detail}></NewNativeFormSet>,
    },
  ];

  const modalProps = {
    title: `${BOTTOM_ICON_TYPE[tabKey]}-${detail?.version}-编辑`,
    visible: show,
    loading,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave} loading={loading}>
        确定
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects.globalConfig,
}))(BottomIconConfigSet);
