import React, { useState, useMemo } from 'react';
import { connect } from 'umi';
import { Form, Button, InputNumber } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
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
      const { img, ...other } = values;
      // 上传图片到oss -> 提交表单
      const imgList = await aliOssUpload(img);
      dispatch({
        type: {
          add: 'globalConfig/fetchSaveMomentTagAdd',
          edit: 'globalConfig/fetchUpdateMomentTag',
        }[type],
        payload: {
          ...other,
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
    title: type === 'edit' ? '编辑' : '新增',
    onClose,
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
        label: '标签名称',
        name: 'name',
        maxLength: '10',
      },
      {
        label: '标签图片',
        type: 'upload',
        name: 'img',
        maxFile: 1,
        extra: '请上传5:4比例的图片，大小不得小于230*184px',
        imgRatio: LABEL_ICON,
      },
      {
        label: '标签数据',
        type: 'formItem',
        required: true,
        rules: 'false',
        formItem: (
          <>
            <Form.Item
              name="participateNum"
              rules={[{ required: true, message: '请输入参与人数' }]}
              style={{ display: 'inline-block', width: 'calc(23%)' }}
            >
              <InputNumber min={0} placeholder={'请输入数字'} />
            </Form.Item>
            <span style={{ display: 'inline-block', marginTop: 5 }}>人参与，</span>
            <Form.Item
              name="onlookersNum"
              rules={[{ required: true, message: '请输入围观人数' }]}
              style={{ display: 'inline-block', width: 'calc(23%)' }}
            >
              <InputNumber min={0} placeholder={'请输入数字'} />
            </Form.Item>
            <span style={{ display: 'inline-block', marginTop: 5 }}>人围观</span>
          </>
        ),
      },
      {
        label: '标签介绍',
        type: 'textArea',
        name: 'introduce',
        maxLength: 30,
      },
    ],
    [type],
  );
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({ loading }))(UgcLabelSet);
