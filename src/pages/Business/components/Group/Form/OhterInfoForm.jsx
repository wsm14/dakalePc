import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { SPACE_PATTERN, WORD_NUM_PATTERN } from '@/common/regExp';
import PopImgShow from '@/components/PopImgShow';
import FormCondition from '@/components/FormCondition';

/**
 * 品牌信息 && 登录信息 && 联系人信息 && 店铺信息
 */
const OhterInfoForm = ({ form, list, formType, dispatch, initialValues }) => {
  const [bandImg, setBandImg] = useState({ show: false, url: '' });

  // 获取品牌信息
  useEffect(() => {
    fetchMasterManagementList();
  }, []);

  useEffect(() => {
    if (initialValues.brandLogo) {
      setBandImg({ show: true, url: initialValues.brandLogo });
    }
  }, [initialValues]);

  const fetchMasterManagementList = () => {
    dispatch({
      type: 'businessBrand/fetchGetList',
      payload: {
        page: 1,
        limit: 999,
      },
    });
  };

  const formItems = [
    {
      title: '03 品牌信息',
      label: '品牌',
      name: 'brandId',
      type: 'select',
      select: list,
      allowClear: true,
      onChange: (e, value) => {
        form.setFieldsValue({
          brandName: value?.option?.brandName || undefined,
          brandLogo: value?.option?.brandLogo || undefined,
        });
        setBandImg({ show: value?.option ? true : false, url: value?.option?.brandLogo });
      },
      rules: [{ required: false }],
      fieldNames: { label: 'brandName', value: 'configBrandIdString' },
    },
    {
      label: '品牌名称',
      name: 'brandName',
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '品牌名称',
      name: 'brandLogo',
      hidden: true,
      rules: [{ required: false }],
    },
    {
      type: 'noForm',
      visible: bandImg.show,
      formItem: (
        <div style={{ marginLeft: '18%', display: 'flex', alignItems: 'center' }}>
          品牌LOGO:{' '}
          <div style={{ marginLeft: '10px' }}>
            <PopImgShow url={bandImg.url}></PopImgShow>
          </div>
        </div>
      ),
    },
    {
      title: '04 登录信息',
      label: '登录账号',
      name: 'account',
      maxLength: 30,
      disabled: formType === 'edit',
      addRules: [{ pattern: !SPACE_PATTERN, message: '账号格式不正确' }],
    },
    {
      label: '登录密码',
      name: 'password',
      maxLength: 16,
      visible: formType === 'add',
      addRules: [{ pattern: WORD_NUM_PATTERN, message: '密码格式不正确' }],
    },
    {
      title: '05 联系人信息',
      label: '联系人姓名',
      name: 'contactPerson',
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
    },
    {
      title: '06 店铺信息',
      label: '店铺主图',
      name: 'mainImages',
      type: 'upload',
      maxFile: 5,
      rules: [{ required: false }],
      extra: '店铺主图最多可上传5张',
    },
    {
      label: '店铺小图',
      name: 'localImages',
      type: 'upload',
      maxFile: 9,
      rules: [{ required: false }],
      extra: '店铺小图最多可上传9张',
    },
    {
      label: '店铺介绍',
      name: 'groupDesc',
      type: 'textArea',
      maxLength: 200,
      rules: [{ required: false }],
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ businessBrand }) => ({
  list: businessBrand.list,
}))(OhterInfoForm);
