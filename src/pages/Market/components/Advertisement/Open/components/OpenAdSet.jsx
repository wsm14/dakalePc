import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { OPEN_ADVERT_PORT } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import OpenAdForm from './Form';
import OpenAdDetail from './Detail';

const OpenAdSet = (props) => {
  const { dispatch, cRef, visible, onClose, tabKey, loading } = props;

  const { show = false, type = 'add', detail = { mediaType: 'image' } } = visible;
  const [form] = Form.useForm();

  const fetchGetFormData = (data) => {
    dispatch({
      type: { add: 'openAdvert/fetchOpenAdvertSet', edit: 'openAdvert/fetchOpenAdvertEdit' }[type],
      payload: data,
      callback: () => {
        onClose();
        cRef.current.fetchGetData();
      },
    });
  };

  // 上传文件判断
  const fetchCheckUpFile = () => {
    form.validateFields().then((values) => {
      const { url, mediaType, launchOwner, activeDate: time, ...other } = values;

      const payload = {
        ...other,
        mediaType,
        launchOwner,
        userType: tabKey,
        appLaunchImageId: detail.idString,
      };

      // 视频上传
      if (mediaType === 'video') {
        fetchGetFormData(payload);
        return;
      }

      // 上传图片
      aliOssUpload(url).then((res) => {
        fetchGetFormData({
          ...payload,
          url: res.toString(),
          startDate: time[0].format('YYYY-MM-DD 00:00:00'),
          endDate: time[1].format('YYYY-MM-DD 23:59:59'),
        });
      });
    });
  };

  const modalProps = {
    title: `${{ add: '新增', edit: '编辑', info: '详情' }[type]} - ${OPEN_ADVERT_PORT[tabKey]}`,
    visible: show,
    onClose,
    footer: type !== 'info' && (
      <Button onClick={fetchCheckUpFile} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {type !== 'info' ? (
        <OpenAdForm detail={detail} form={form} tabKey={tabKey} />
      ) : (
        <OpenAdDetail detail={detail} />
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.openAdvert,
}))(OpenAdSet);
