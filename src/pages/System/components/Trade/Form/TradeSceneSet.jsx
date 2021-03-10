import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const TradeSceneSet = (props) => {
  const { visible, dispatch, loading, onClose, categoryId, childRef } = props;
  const { show = false, type, detail = {} } = visible;

  const title = { add: '新增', edit: '编辑' }[type];
  const [form] = Form.useForm();

  const handleSceneUpdate = () => {
    form.validateFields().then((values) => {
      const { image } = values;
      aliOssUpload(image).then((res) => {
        const payload = {
          add: {
            categoryId,
            ...values,
            image: res.toString(),
          },
          edit: {
            categoryScenesId: detail.categoryScenesId,
            ...values,
            image: res.toString(),
          },
        }[type];
        dispatch({
          type: { add: 'sysTradeList/fetchSceneAdd', edit: 'sysTradeList/fetchSceneUpdate' }[type],
          payload: payload,
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };
  const formItems = [
    {
      label: '适用场景',
      name: 'scenesName',
      maxLength: 6,
    },
    {
      label: '图片',
      type: 'upload',
      name: 'image',
      maxFile: 1,
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: `设置 - ${title}`,
    visible: show,
    onClose,
    footer: (
      <Button onClick={handleSceneUpdate} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['sysTradeList/fetchSceneAdd'],
}))(TradeSceneSet);
