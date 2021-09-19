import React from 'react';
import DrawerCondition from '@/components/DrawerCondition';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

import { Button, Form } from 'antd';
const CheckRefuseDraw = (props) => {
  const { visible = {}, onClose, dispatch, onCloseF, cRef, loading } = props;
  const { show = false, auditId, ownerId, type, detail } = visible;

  const [form] = Form.useForm();

  const formItems = [
    {
      label: `驳回原因`,
      type: 'textArea',
      name: 'rejectReason',
    },
    {
      label: `添加图片说明`,
      type: 'upload',
      name: 'rejectImg',
      rules: [{ required: false }],
    },
  ];

  const handleReject = () => {
    form.validateFields().then((values) => {
      const { rejectImg = '' } = values;
      aliOssUpload(rejectImg).then((res) => {
        dispatch({
          type: 'specialGoodsCheck/fetchSpecialGoodsAuditReject',
          payload: {
            ...values,
            auditId,
            ownerId,
            rejectImg: res.toString(),
          },
          callback: () => {
            onClose();
            onCloseF();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const modalProps = {
    visible: show,
    title: '驳回原因',
    onClose,
    footer: type === 'edit' && (
      <Button type="primary" onClick={handleReject} loading={loading}>
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['specialGoodsCheck/fetchSpecialGoodsAuditReject'],
}))(CheckRefuseDraw);
