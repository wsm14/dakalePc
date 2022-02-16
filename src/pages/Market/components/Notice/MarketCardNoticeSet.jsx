import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const MarketCardNoticeSet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, type, initialValues = {} } = visible;
  const { configAnnounceIdString: configAnnounceId } = initialValues;
  const [form] = Form.useForm();

  // 公告新增
  const fetchMarketNoticeAdd = () => {
    form.validateFields().then((values) => {
      const { image } = values;
      const defineSet = {
        type: {
          add: 'marketCardNotice/fetchMarketNoticeAdd',
          edit: 'marketCardNotice/fetchNoticeEdit',
        }[type],
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      };

      aliOssUpload(image).then((res) => {
        dispatch({
          ...defineSet,
          payload: { configAnnounceId, ...values, image: res.toString() },
        });
      });
    });
  };

  const formItems = [
    {
      label: '上传公告图',
      type: 'upload',
      name: 'image',
      maxFile: 1,
    },
    {
      label: '公告说明',
      name: 'description',
      type: 'textArea',
      maxLength: 20,
    },
  ];

  const modalProps = {
    title: `公告${!Object.keys(initialValues).length ? '新增' : '修改'}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchMarketNoticeAdd} loading={loading}>
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

export default connect(({ loading }) => ({
  loading: loading.models.marketCardNotice,
}))(MarketCardNoticeSet);
