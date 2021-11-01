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
  const { show = false, type = 'add', detail = { messageType: 'pic' } } = visible;
  const [modalType, setModalType] = useState('');
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
    afterCallBack: () => {
      setModalType(detail.messageType);
    },
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
        label: '弹窗名称',
        name: 'name',
        maxLength: '15',
      },
      {
        label: '弹窗频率',
        name: 'aaa',
        type: 'radio',
        select: MODAL_FREQUENCY,
      },
      {
        label: '推送时间',
        type: 'rangePicker',
        name: 'arraignmentTimeStart',
        end: 'arraignmentTimeEnd',
      },
      {
        label: '弹窗类型',
        name: 'messageType',
        type: 'radio',
        select: MARKET_MODAL_TYPE,
        onChange: (e) => {
          setModalType(e.target.value);
        },
      },
      {
        label: '弹窗图片',
        type: 'upload',
        name: 'img',
        maxFile: 1,
        extra: '请上传900*1077px png、jpeg、gif图片',
        imgRatio: LABEL_ICON,
        visible: modalType === 'pic',
      },
      {
        label: '弹窗链接',
        name: 'link11',
        visible: modalType === 'link',
      },
      {
        label: '跳转内容',
        name: '22',
        type: 'radio',
        select: BANNER_JUMP_TYPE,
      },
      {
        label: '可见范围',
        name: '333',
        type: 'radio',
        select: BANNER_LOOK_AREA,
      },
    ],
    [modalType],
  );
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({ loading }))(UgcLabelSet);
