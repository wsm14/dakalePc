import React from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { OPEN_ADVERT_PORT } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import JumpFormBlock from '@/components/JumpFormBlock';
import DrawerCondition from '@/components/DrawerCondition';

const OpenAdSet = (props) => {
  const { dispatch, cRef, visible, onClose, tabKey, loading } = props;

  const { show = false, type = 'add', detail = {} } = visible;
  const [form] = Form.useForm();

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { coverImg, beginDate: time, jumpType } = values;
      // 上传图片到oss -> 提交表单
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: { add: 'sysAppList/fetchBannerSet', edit: 'sysAppList/fetchBannerEdit' }[type],
          payload: {
            bannerId: detail.bannerIdString,
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
      label: '广告主名',
      name: 'descri232ption',
      maxLength: 20,
    },
    {
      label: '广告上传',
      type: 'upload',
      name: 'coverImg',
      maxFile: 1,
      imgRatio: 1920 / 1080,
    },
    {
      label: '广告说明',
      type: 'textArea',
      name: 'description',
      maxLength: 200,
    },
    {
      label: '展示时间',
      name: 'beginDate',
      type: 'rangePicker',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      type: 'noForm',
      formItem: <JumpFormBlock form={form}></JumpFormBlock>,
    },
  ];

  const modalProps = {
    title: `${type === 'edit' ? '编辑' : '新增'} - ${OPEN_ADVERT_PORT[tabKey]}`,
    visible: show,
    onClose,
    afterCallBack: () => {},
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.sysAppList,
}))(OpenAdSet);
