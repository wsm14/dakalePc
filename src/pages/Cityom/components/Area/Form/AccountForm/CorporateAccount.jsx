import React, { useState, useImperativeHandle } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import { PHONE_PATTERN } from '@/common/regExp';
import moment from 'moment';
import cityList from '@/common/city';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const CorporateAccount = (props) => {
  const { detail = {}, type, dispatch, cRef, loading } = props;

  const [form] = Form.useForm();
  // 是否允许输入
  const [disabledInfo, setDisabledInfo] = useState(false);

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    fetchData: () => form.validateFields(),
  }));

  // 上传图片返回url ocr识别营业执照
  const fetchMerBusinessUpload = (file) => {
    setDisabledInfo(true);
    aliOssUpload(file).then((res) => {
      setDisabledInfo(false);
      dispatch({
        type: 'areaCenter/fetchGetOcrLicense',
        payload: {
          imageUrl: res.toString(),
        },
        callback: (val) => {
          form.setFieldsValue({
            businessLicenseObject: {
              businessLicenseImg: res.toString(),
              socialCreditCode: val.regNum,
              businessName: val.name,
              signInAddress: val.address,
              validityPeriod: val.validPeriod,
              businessScope: val.business,
            },
            // bankBindingObject: {
            //   cardName: val.name,
            // },
          });
        },
      });
    });
  };

  // 上传图片返回url ocr开户行
  const fetchGetOcrBank = (file) => {
    setDisabledInfo(true);
    aliOssUpload(file).then((res) => {
      setDisabledInfo(false);
      dispatch({
        type: 'areaCenter/fetchGetOcrBank',
        payload: {
          imageUrl: res.toString(),
        },
        callback: (val) => {
          form.setFieldsValue({
            bankBindingObject: {
              cardName: val.enterpriseNameCH,
              openAccountPermit: res.toString(),
              cardNo: val.enterpriseBankId,
              bankBranchName: val.enterpriseBankName,
            },
          });
        },
      });
    });
  };

  // 上传图片返回url ocr身份证正面
  const fetchGetOcrFront = (file) => {
    setDisabledInfo(true);
    aliOssUpload(file).then((res) => {
      setDisabledInfo(false);
      dispatch({
        type: 'areaCenter/fetchGetOcrFront',
        payload: {
          imageUrl: res.toString(),
        },
        callback: (val) => {
          form.setFieldsValue({
            bankBindingObject: {
              certFrontPhoto: res.toString(),
              legalPerson: val.name,
              legalCertId: val.num,
            },
          });
        },
      });
    });
  };

  // 上传图片返回url ocr身份证反面
  const fetchGetOcrBefor = (file) => {
    setDisabledInfo(true);
    aliOssUpload(file).then((res) => {
      setDisabledInfo(false);
      dispatch({
        type: 'areaCenter/fetchGetOcrBefor',
        payload: {
          imageUrl: res.toString(),
        },
        callback: (val) => {
          form.setFieldsValue({
            activeDate: [
              moment(val.startDate, 'YYYY-MM-DD'),
              moment(val.endDate === '长期' ? '20991231' : val.endDate, 'YYYY-MM-DD'),
            ],
            bankBindingObject: {
              certReversePhoto: res.toString(),
              startDate: val.startDate,
              legalCertIdExpires: val.endDate === '长期' ? '20991231' : val.endDate,
            },
          });
        },
      });
    });
  };

  const formItems = [
    {
      title: '对公账户信息',
      label: '营业执照',
      name: ['businessLicenseObject', 'businessLicenseImg'],
      type: 'upload',
      maxFile: 1,
      onChange: (file) => fetchMerBusinessUpload(file),
      extra: '以下信息通过OCR识别，请检查后再提交哦',
    },
    {
      label: '店铺名称',
      disabled: disabledInfo || loading,
      name: ['businessLicenseObject', 'businessName'],
    },
    {
      label: '统一社会信用代码',
      disabled: disabledInfo || loading,
      name: ['businessLicenseObject', 'socialCreditCode'],
    },
    {
      label: '注册地址',
      disabled: disabledInfo || loading,
      name: ['businessLicenseObject', 'signInAddress'],
    },
    {
      label: '营业期限',
      disabled: disabledInfo || loading,
      name: ['businessLicenseObject', 'validityPeriod'],
    },
    {
      label: '经营范围',
      type: 'textArea',
      disabled: disabledInfo || loading,
      name: ['businessLicenseObject', 'businessScope'],
    },
    {
      label: '开户许可证',
      name: ['bankBindingObject', 'openAccountPermit'],
      type: 'upload',
      maxFile: 1,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      onChange: (file) => fetchGetOcrBank(file),
    },
    {
      label: '开户名称',
      disabled: disabledInfo || loading,
      name: ['bankBindingObject', 'cardName'],
    },
    {
      label: '银行卡号',
      disabled: disabledInfo || loading,
      name: ['bankBindingObject', 'cardNo'],
    },
    {
      label: '开户银行',
      disabled: disabledInfo || loading,
      name: ['bankBindingObject', 'bankBranchName'],
    },
    {
      label: '开户支行城市',
      type: 'cascader',
      disabled: disabledInfo || loading,
      name: 'allCityCode',
      onChange: (val) => {
        form.setFieldsValue({
          bankBindingObject: {
            provCode: val[0].value,
            areaName: val[1].label,
            areaCode: val[1].value,
          },
        });
      },
      select: JSON.parse(JSON.stringify(cityList)).map((item) => {
        item.children = item.children.map((items) => {
          return { label: items.label, value: items.value };
        });
        return item;
      }),
      show: false,
    },
    {
      label: '开户支行城code',
      name: ['bankBindingObject', 'provCode'],
      hidden: true,
    },
    {
      label: '开户支行市名',
      name: ['bankBindingObject', 'areaName'],
      hidden: true,
    },
    {
      label: '开户支行市code',
      name: ['bankBindingObject', 'areaCode'],
      hidden: true,
    },
    // {
    //   label: '输入支行',
    //   disabled: disabledInfo,
    //   name: ['bankBindingInfo', 'bankBranchName'],
    // },
  ];

  const info = [
    {
      title: '法人信息',
      label: '法人身份证正面照',
      name: ['bankBindingObject', 'certFrontPhoto'],
      type: 'upload',
      maxFile: 1,
      onChange: (file) => fetchGetOcrFront(file),
    },
    {
      label: '法人身份证反面照',
      name: ['bankBindingObject', 'certReversePhoto'],
      type: 'upload',
      maxFile: 1,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      onChange: (file) => fetchGetOcrBefor(file),
    },
    {
      label: '法人姓名',
      disabled: disabledInfo || loading,
      name: ['bankBindingObject', 'legalPerson'],
    },
    {
      label: '法人身份证号码',
      disabled: disabledInfo || loading,
      name: ['bankBindingObject', 'legalCertId'],
    },
    {
      label: '法人身份有效期',
      type: 'rangePicker',
      disabled: disabledInfo || loading,
      name: 'activeDate',
      onChange: (val) =>
        val &&
        form.setFieldsValue({
          bankBindingObject: {
            startDate: val[0].format('YYYYMMDD'),
            legalCertIdExpires: val[1].format('YYYYMMDD'),
          },
        }),
      render: (val, row) => `${row.startDate || ''} - ${row.legalCertIdExpires || ''}`,
    },
    {
      label: '身份有效期开始',
      name: ['bankBindingObject', 'startDate'],
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '身份有效期结束',
      name: ['bankBindingObject', 'legalCertIdExpires'],
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '法人手机号',
      disabled: disabledInfo || loading,
      name: ['bankBindingObject', 'legalMp'],
      maxLength: 11,
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
  ];

  return (
    <>
      {type != 'detail' ? (
        <FormCondition formItems={[...formItems, ...info]} form={form} initialValues={detail} />
      ) : (
        <>
          <DescriptionsCondition
            title="对公账户信息"
            formItems={formItems}
            initialValues={detail}
          ></DescriptionsCondition>
          <DescriptionsCondition
            title="法人信息"
            formItems={info}
            initialValues={detail}
            style={{ marginTop: 24 }}
          ></DescriptionsCondition>
        </>
      )}
    </>
  );
};

export default connect(({ areaCenter, loading }) => ({
  detail: areaCenter.bankDetail,
  loading: loading.models.areaCenter,
}))(CorporateAccount);
