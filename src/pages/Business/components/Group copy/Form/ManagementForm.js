import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import PopImgShow from '@/components/PopImgShow';

const ManagementForm = (props) => {
  const { list, form, initialValues, cRef } = props;
  const [upload, setUpload] = useState('');
  const [uploadName, setUploadName] = useState({
    upload: '',
  });
  const [ImageShow, setImageShow] = useState(false);
  const Images = (
    <div style={{ marginLeft: '18%', display: 'flex', alignItems: 'center' }}>
      品牌LOGO:{' '}
      <div style={{ marginLeft: '10px' }}>
        <PopImgShow url={upload}></PopImgShow>
      </div>
    </div>
  );
  useImperativeHandle(cRef, () => ({
    getImage: () => {
      let obj = {};
      if (upload.length > 0) {
        obj = {
          brandLogo: upload,
          brandName: uploadName,
        };
      }
      return {
        ...obj,
      };
    },
  }));

  useEffect(() => {
    if (upload !== '') {
      setImageShow(true);
    } else {
      setImageShow(false);
    }
  }, [upload]);
  useEffect(() => {
    if (initialValues.brandLogo && initialValues.brandLogo.length > 0) {
      setUpload(initialValues.brandLogo);
      setImageShow(true);
    }
  }, [initialValues]);
  const formItems = [
    {
      label: '品牌',
      name: 'brandId',
      type: 'select',
      rules: [{ required: false }],
      onChange: (e, value) => {
        let url =
          list.filter((item) => {
            return item.configBrandIdString === e;
          })[0].brandLogo || '';
        let brandName =
          list.filter((item) => {
            return item.configBrandIdString === e;
          })[0].brandName || '';
        setUpload(url);
        setUploadName(brandName);
      },
      select: list,
      fieldNames: { label: 'brandName', value: 'configBrandIdString' },
      // loading,
      // labelInValue: true,
      // visible: !userInfo.roleId,
      // select: selectValue.map((item) => ({ name: item.value, value: item.child })),
    },
    {
      type: 'noForm',
      visible: ImageShow,
      formItem: Images,
      // label: '品牌LOGO',
      // name: 'brandLogo',
      // type: 'upload',
      // rules: [{ required: false }],
      // disable: false,
      // maxFile: 1,
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ businessBrand }) => ({
  list: businessBrand.list,
  ...businessBrand,
}))(ManagementForm);
