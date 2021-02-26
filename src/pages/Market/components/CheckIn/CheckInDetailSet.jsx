import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const CheckInDetailSet = (props) => {
  const { dispatch, childRef, visible, onClose } = props;
  const { show = false, CeditType, record = {}, id, initialValues = {} } = visible;
  const [form] = Form.useForm();

  const fetchSysCheckIn = () => {
    form.validateFields().then((values) => {
      const defineSet = {
        type: {
          true: 'sysCheckIn/fetchCheckInTextImgAdd',
          false: 'sysCheckIn/fetchCheckInTextImgEdit',
        }[!id],
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      };

      const { content } = values;
      aliOssUpload(content).then((res) => {
        dispatch({
          ...defineSet,
          payload: {
            false: { id, content: res.toString() },
            true: { ...record, content: res.toString() },
          }[!id],
        });
      });
    });
  };

  const formItems = {
    text: [
      {
        label: '文案',
        name: 'content',
        type: 'textArea',
      },
    ],
    image: [
      {
        label: '图片上传',
        name: 'content',
        type: 'upload',
        maxFile: 1,
      },
    ],
  }[CeditType];

  const modalProps = {
    title: { text: '文案编辑', image: '图片编辑' }[CeditType],
    onClose,
    visible: show,
    footer: (
      <Button type="primary" onClick={fetchSysCheckIn}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ sysCheckIn, loading }) => ({
  sysCheckIn,
  loading,
}))(CheckInDetailSet);
