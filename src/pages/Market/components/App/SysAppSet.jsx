import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { BANNER_TYPE, BANNER_JUMP_TYPE } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SysAppSet = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const { show = false, info = '' } = visible;
  const [form] = Form.useForm();
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    if (show) setShowUrl(info.jumpType || false);
  }, [show]);

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { coverImg, beginDate: time, jumpType } = values;

      // 上传图片到oss -> 提交表单
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: { true: 'sysAppList/fetchBannerSet', false: 'sysAppList/fetchBannerEdit' }[!info],
          payload: {
            bannerId: info.bannerIdString,
            ...values,
            jumpType: jumpType === '无' ? '' : jumpType,
            coverImg: res.toString(),
            beginDate: time[0].format('YYYY-MM-DD 00:00:00'),
            endDate: time[1].format('YYYY-MM-DD 00:00:00'),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '图片上传',
      type: 'upload',
      maxFile: 1,
      name: 'coverImg',
    },
    {
      label: '图片位置',
      type: 'select',
      name: 'bannerType',
      select: BANNER_TYPE,
    },
    {
      type: 'textArea',
      label: '图片说明',
      name: 'description',
    },
    {
      type: 'rangePicker',
      label: '展示时间',
      name: 'beginDate',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '跳转类型',
      type: 'select',
      name: 'jumpType',
      select: BANNER_JUMP_TYPE,
      onChange: (value) => setShowUrl(value !== '无'),
    },
    {
      label: '跳转链接',
      visible: showUrl,
      name: 'jumpUrl',
    },
  ];

  const modalProps = {
    title: info ? '编辑' : '新增',
    visible: show,
    onClose,
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        initialValues={
          info
            ? {
                ...info,
                jumpType: info.jumpType ? info.jumpType : '无',
                beginDate: [
                  moment(info.beginDate, 'YYYY-MM-DD'),
                  moment(info.endDate, 'YYYY-MM-DD'),
                ],
              }
            : {}
        }
        formItems={formItems}
        form={form}
      />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.sysAppList,
}))(SysAppSet);
