import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Drawer, Button, Space, Form, Skeleton } from 'antd';
import { PUZZLE_AD_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const PuzzleAdSet = (props) => {
  const { dispatch, visible, onSumbit, onClose, brandList, loadings, loading } = props;

  const { show = false, info = '' } = visible;
  const [form] = Form.useForm();
  const [showType, setShowType] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  // 骨架框显示
  const [skeletonType, setSkeletonType] = useState(true);

  // 获取品牌
  const fetchGetBrandList = () => {
    dispatch({
      type: 'businessBrand/fetchGetList',
      payload: { page: 1, limit: 999 },
    });
  };

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
      type: 'select',
      name: 'brandId',
      select: brandList,
      fieldNames: { labelKey: 'brandName', valueKey: 'configBrandIdString' },
      onChange: (value, item) => {
        form.setFieldsValue({ brandName: item.children[0] });
      },
    },
    {
      label: '品牌名',
      name: 'brandName',
      hidden: true,
    },
  ];

  const modalProps = {
    title: '编辑',
    width: 560,
    visible: show,
    maskClosable: true,
    destroyOnClose: true,
  };

  const closeDrawer = () => {
    setSkeletonType(true);
    onClose();
  };

  return (
    <Drawer
      {...modalProps}
      onClose={closeDrawer}
      afterVisibleChange={(showEdit) => {
        if (showEdit) {
          fetchGetBrandList();
          setShowType(info.type);
          setSkeletonType(false);
        }
      }}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={fetchGetFormData} type="primary" loading={loading || fileUpload}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <Skeleton loading={skeletonType || loadings.effects['businessBrand/fetchGetList']} active>
        <FormCondition initialValues={info} formItems={formItems} form={form} />
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ businessBrand, loading }) => ({
  brandList: businessBrand.list,
  loadings: loading,
  loading: loading.models.puzzleAd,
}))(PuzzleAdSet);
