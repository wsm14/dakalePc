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

  const { show = false, type = 'add', detail = {} } = visible;
  const [form] = Form.useForm();

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { url, activeDate: time, jumpUrlType, ...other } = values;
      // 上传图片到oss -> 提交表单
      aliOssUpload(url).then((res) => {
        dispatch({
          type: { add: 'openAdvert/fetchOpenAdvertSet', edit: 'openAdvert/fetchOpenAdvertEdit' }[
            type
          ],
          payload: {
            ...other,
            appLaunchImageId: detail.idString,
            userType: tabKey,
            mediaType: 'image',
            jumpUrlType: jumpUrlType === '无' ? '' : jumpUrlType,
            url: res.toString(),
            startDate: time[0].format('YYYY-MM-DD 00:00:00'),
            endDate: time[1].format('YYYY-MM-DD 23:59:59'),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const modalProps = {
    title: `${{ add: '新增', edit: '编辑', info: '详情' }[type]} - ${OPEN_ADVERT_PORT[tabKey]}`,
    visible: show,
    onClose,
    footer: type !== 'info' && (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
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
