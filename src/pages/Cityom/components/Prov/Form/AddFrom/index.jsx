import React from 'react';
import BaseForm from './BaseForm';
import ContactForm from './ContactForm';

const AddFromSet = (props) => {
  const { form, detail, type } = props;

  const formProps = {
    form,
    detail,
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

export default AddFromSet;
