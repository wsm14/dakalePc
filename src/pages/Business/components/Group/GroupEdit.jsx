import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Modal, notification } from 'antd';
import { checkFileData } from '@/utils/utils';
import uploadLive from '@/utils/uploadLive';
import aliOssUpload from '@/utils/aliOssUpload';
import CrmGroupSelect from './Form/Info/CrmGroupSelect';
import BaseInfoForm from './Form/Info/BaseInfoForm';
import BusinessLicense from './Form/Info/BusinessLicense';
import OhterInfoForm from './Form/Info/OhterInfoForm';
import DrawerCondition from '@/components/DrawerCondition';

const { confirm } = Modal;

const GroupEdit = (props) => {
  const {
    cRef,
    visible = false,
    dispatch,
    onClose,
    loadingAdd,
    loadingUpDate,
    handleActivateShow,
  } = props;
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

  // 上传提交
  const fetchUpData = (values, handle) => {
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
                  merchantGroupIdString: mreDetail.merchantGroupIdString,
                  contentType: 'video',
                  provinceCode: allCode[0],
                  cityCode: allCode[1],
                  districtCode: allCode[2],
                  categoryNode: topCategSelect.join('.'),
                  videoUrl: undefined,
                  videoId: videos,
                  frontImage: imgs, // 封面连接
                  frontImageWidth: imgs ? 960 : undefined, // 封面宽 16
                  frontImageHeight: imgs ? 540 : undefined, // 封面长 9
                  businessLicenseObject: {
                    ...businessLicenseObject,
                    validityPeriod: activeValidity[1].format('YYYY-MM-DD'),
                    establishDate: activeValidity[0].format('YYYY-MM-DD'),
                  },
                  mainImages: res.slice(0, 1).toString(),
                  localImages: res.slice(1, lImg.length + 1).toString(),
                  brandPublicityImage: res.slice(lImg.length + 1).toString(),
                },
                callback: (id) => {
                  if (handle === 'save') {
                    cRef.current.fetchGetData(); // 保存
                    onClose();
                  } else {
                    // 下一步 激活 merchantGroupIdString 和详情返回一致
                    handleActivateShow({ merchantGroupIdString: id, ...other });
                    onClose();
                  }
                },
              });
            });
          },
        });
      },
    });
  };

  // 修改时显示确认同步消息框
  function showConfirm(callback) {
    confirm({
      title: '温馨提示',
      content: (
        <div>
          修改图片是否同步至所有子门店？
          <br />
          确定同步将同步至子门店，不同步仅更改集团内照片信息
        </div>
      ),
      okText: '确定同步',
      cancelText: '不同步',
      onOk() {
        callback(1); // 同步
      },
      onCancel() {
        callback(0); // 不同步
      },
    });
  }

  // 提交集团数据
  const fetchUpGroupData = (handle) => {
    form.validateFields().then((values) => {
      const {
        mainImages, // 店铺头图
        localImages, // 店铺环境图
        lat,
        lnt,
      } = values;
      if (!lat && !lnt) {
        notification.error({
          message: '请点击查询！设置经纬度',
        });
        return;
      }
      const checkImg = (val) => val && typeof val !== 'string';
      if (type === 'edit' && typeof checkImg(mainImages) && checkImg(localImages)) {
        showConfirm((synFlag) => fetchUpData({ ...values, synFlag }, handle));
      } else fetchUpData(values, handle);
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
        <Button onClick={() => fetchUpGroupData('save')} loading={loadingUpDate || loadingAdd}>
          保存
        </Button>
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
          <BaseInfoForm form={form} formType={type} initialValues={mreDetail}></BaseInfoForm>
          {/* 营业执照信息 */}
          <BusinessLicense form={form} initialValues={mreDetail}></BusinessLicense>
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
