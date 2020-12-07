import React from 'react';
import { connect } from 'dva';
import BaseForm from './BaseForm';
import ContactForm from './ContactForm';

const AddFromSet = (props) => {
  const { form, detailInfo = {}, type } = props;

  const formProps = {
    form,
    detail: detailInfo,
    type,
  };

  return (
    <>
      {/* 基础信息 */}
      <BaseForm {...formProps}></BaseForm>
      {/* 联系人信息 帐号信息 */}
      <ContactForm {...formProps}></ContactForm>
    </>
  );
};

export default connect(({ areaCenter }) => ({
  detailInfo: areaCenter.detail,
}))(AddFromSet);
