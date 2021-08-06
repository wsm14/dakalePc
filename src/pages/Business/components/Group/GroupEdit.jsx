import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { checkFileData } from '@/utils/utils';
import uploadLive from '@/utils/uploadLive';
import aliOssUpload from '@/utils/aliOssUpload';
import CrmGroupSelect from './Form/CrmGroupSelect';
import GroupInfoForm from './Form/GroupInfoForm';
import BusinessLicense from './Form/BusinessLicense';
import OhterInfoForm from './Form/OhterInfoForm';
import DrawerCondition from '@/components/DrawerCondition';

const GroupEdit = (props) => {
  const { visible = false, onClose, dispatch, cRef } = props;
  // 展示 表单内容类型 add edit 详情
  const { show, type, detail } = visible;

  const [form] = Form.useForm();
  const [formCrm] = Form.useForm();

  const [mreDetail, setMreDetail] = useState({}); // 集团详情
  const [crmSelect, setCrmSelect] = useState(true); // 是否显示crm 选择集团内容 新增显示

  // 认领或创建店铺前往新增
  const handleCrmAddGroup = (data) => {
    setMreDetail(data);
    setCrmSelect(false);
  };

  // 提交集团数据
  const fetchUpGroupData = (handle) => {
    form.validateFields().then((values) => {
      const {
        mainImages, // 店铺头图
        localImages, // 店铺环境图
        brandPublicityImage, // 品牌宣传图片
        frontImage, // 宣传视频封面
        videoId,
        videoUrl,
        activeValidity,
        topCategSelect,
        businessLicenseObject,
        allCode,
        ...other
      } = values;
      const mImg = checkFileData(mainImages);
      const lImg = checkFileData(localImages);
      const bImg = checkFileData(brandPublicityImage);
      uploadLive({
        data: frontImage, // 上传封面
        callback: (imgs) => {
          uploadLive({
            data: videoId ? videoId : videoUrl, // 上传视频
            title: values.brandName,
            callback: (videos) => {
              aliOssUpload([...mImg, ...lImg, ...bImg]).then((res) => {
                dispatch({
                  type: { add: 'groupSet/fetchAddList', edit: 'groupSet/fetchUpdateGroup' }[type],
                  payload: {
                    ...other,
                    provinceCode: allCode[0],
                    cityCode: allCode[1],
                    districtCode: allCode[2],
                    categoryNode: topCategSelect.join('.'),
                    videoUrl: undefined,
                    videoId: videos,
                    frontImage: imgs, // 封面连接
                    frontImageWidth: imgs ? 480 : undefined, // 封面宽 16
                    frontImageHeight: imgs ? 270 : undefined, // 封面长 9
                    businessLicenseObject: {
                      ...businessLicenseObject,
                      validityPeriod: activeValidity[1].format('YYYY-MM-DD'),
                      establishDate: activeValidity[0].format('YYYY-MM-DD'),
                    },
                    mainImages: res.slice(0, 1).toString(),
                    localImages: res.slice(1, lImg.length + 1).toString(),
                    brandPublicityImage: res.slice(lImg.length + 1).toString(),
                  },
                  callback: () => {
                    // 保存和下一步
                    if (handle === 'save') {
                      cRef.current.fetchGetData();
                      onClose();
                    } else {
                      onClose();
                    }
                  },
                });
              });
            },
          });
        },
      });
    });
  };

  const modalProps = {
    title: type == 'edit' ? '修改集团信息' : `新增集团`,
    visible: show,
    width: 700,
    onClose,
    afterCallBack: () => {
      setMreDetail(detail || {});
      setCrmSelect(type === 'add');
    },
    footer: !crmSelect && (
      <>
        <Button onClick={() => fetchUpGroupData('save')}>保存</Button>
        {type === 'add' && (
          <Button onClick={() => fetchUpGroupData('next')} type="primary">
            下一步
          </Button>
        )}
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {crmSelect ? (
        <CrmGroupSelect form={formCrm} goSet={handleCrmAddGroup} /> // 认领页面
      ) : (
        <>
          {/* 基础信息 */}
          <GroupInfoForm form={form} formType={type} initialValues={mreDetail}></GroupInfoForm>
          {/* 营业执照信息 */}
          <BusinessLicense form={form} bankStatus={mreDetail.bankStatus}></BusinessLicense>
          {/* 品牌信息 && 登录信息 && 联系人信息 && 店铺信息 */}
          <OhterInfoForm form={form} formType={type} initialValues={mreDetail}></OhterInfoForm>
        </>
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loadingAdd: loading.effects['groupSet/fetchAddList'],
  loadingUpDate: loading.effects['groupSet/fetchUpdateGroup'],
}))(GroupEdit);
