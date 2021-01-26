import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import {  Button, Form } from 'antd';
import { PUZZLE_AD_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';

const PuzzleAdSet = (props) => {
  const { visible, onSumbit, onClose, loadings, loading } = props;

  const { show = false, info = '' } = visible;
  const [form] = Form.useForm();
  // 上传文件根据接口改变文件参数key
  const [showType, setShowType] = useState(false);
  // 上传确认按钮loading
  const [fileUpload, setFileUpload] = useState(false);

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { activeDate: time } = values;
      // 上传图片到oss -> 提交表单
      setFileUpload(true);
      aliOssUpload(values[showType]).then((res) => {
        setFileUpload(false);
        onSumbit(
          {
            ...values,
            [showType]: res.toString(),
            puzzleAdsId: info.puzzleAdsId,
            startShowTime: time[0].format('YYYY-MM-DD'),
            endShowTime: time[1].format('YYYY-MM-DD'),
            activeDate: undefined,
          },
          onClose,
        );
      });
    });
  };

  const formItems = [
    {
      label: '广告类型',
      type: 'select',
      name: 'type',
      select: PUZZLE_AD_TYPE,
      onChange: (value) => {
        setShowType(value);
        form.setFieldsValue({ descsdription: '' });
      },
    },
    {
      label: '广告说明',
      type: 'textArea',
      name: 'description',
      rules: [{ required: false }],
    },
    {
      label: '图片上传',
      type: 'upload',
      maxFile: 5,
      visible: showType === 'image',
      name: 'image',
    },
    {
      label: '视频上传',
      type: 'videoUpload',
      maxFile: 1,
      visible: showType === 'video',
      name: 'video',
      extra: '仅支持MP4',
    },
    {
      type: 'rangePicker',
      label: '展示时间',
      name: 'activeDate',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '品牌名',
      name: 'brandName',
    },
  ];

  const closeDrawer = () => {
    onClose();
  };

  const modalProps = {
    title: '编辑',
    width: 650,
    visible: show,
    loading:loadings.effects['businessBrand/fetchGetList'],
    onClose: closeDrawer,
    afterCallBack: () => setShowType(info.type),
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading || fileUpload}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={info} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loadings: loading,
  loading: loading.models.puzzleAd,
}))(PuzzleAdSet);
