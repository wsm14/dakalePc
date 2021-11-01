import React, { useState, useMemo } from 'react';
import { connect } from 'umi';
import { Form, Button, InputNumber } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import {
  MODAL_FREQUENCY,
  BANNER_JUMP_TYPE,
  BANNER_LOOK_AREA,
  MARKET_MODAL_TYPE,
} from '@/common/constant';
import { LABEL_ICON } from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';

const UgcLabelSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef } = props;
  const { show = false, type = 'add', detail = {} } = visible;
  const [form] = Form.useForm();
  //保存
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      console.log(values);
      const { img, ...ohter } = values;
      // 上传图片到oss -> 提交表单
      const imgList = await aliOssUpload(img);
      dispatch({
        type: {
          add: 'globalConfig/fetchSaveMomentTagAdd',
          edit: 'globalConfig/fetchUpdateMomentTag',
        }[type],
        payload: {
          ...ohter,
          img: imgList.toString(),
          configMomentTagId: detail?.configMomentTagId,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    visible: show,
    title: '弹窗内容配置',
    onClose,
    zIndex: 1001,
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['globalConfig/fetchSaveMomentTagAdd'] ||
          loading.effects['globalConfig/fetchUpdateMomentTag']
        }
      >
        保存
      </Button>
    ),
  };
  const formItems = useMemo(
    () => [
      {
        label: '浮窗名称',
        name: 'name',
        maxLength: '15',
      },
      {
        label: '活动时间',
        type: 'rangePicker',
        name: 'arraignmentTimeStart',
        end: 'arraignmentTimeEnd',
      },
      {
        label: '浮窗图片',
        type: 'upload',
        name: 'img',
        maxFile: 1,
        extra: '请上传165*147px png、jpeg、gif图片',
        imgRatio: LABEL_ICON,
      },
      {
        label: '跳转内容',
        name: '22',
        type: 'radio',
        select: BANNER_JUMP_TYPE,
      },
    ],
    [],
  );
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({ loading }))(UgcLabelSet);
