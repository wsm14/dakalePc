import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const BDSet = (props) => {
  const { visible = {}, onClose, childRef, loading, dispatch } = props;

  const { show = '', detail = {}, darenTag = {} } = visible;

  useEffect(() => {
    if (detail?.userIdentification === '') {
      form.setFieldsValue({ userIdentification: '0' });
    }
  }, []);

  const darenTags = ['无'].concat(darenTag.extraParam?.split(','));

  const [form] = Form.useForm();

  // 提交表单
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const payload =
        values.userIdentification === '0'
          ? {
              userIdString: detail.kolUserId,
            }
          : {
              userIdString: detail.kolUserId,
              userIdentification: darenTags[values.userIdentification],
            };
      dispatch({
        type: 'expertUserList/fetchDarenTagSet',
        payload,
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '哒人标识',
      name: 'userIdentification',
      type: 'radio',
      select: darenTags,
    },
  ];

  const modalProps = {
    title: '设置哒人标识',
    visible: show,
    onClose,
    afterCallBack: () => {
      form.resetFields();
    },
    footer: (
      <Button type="primary" onClick={fetchGetFormData} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={
          detail.userIdentification === ''
            ? { userIdentification: '0' }
            : {
                userIdentification: darenTags.indexOf(detail.userIdentification).toString(),
              }
        }
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['expertUserList/fetchDarenTagSet'],
}))(BDSet);
