import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { WXFRIEND_SHARE_IMG } from '@/common/imgRatio';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import VideoFormList from './VideoFormList';
import aliOssUpload from '@/utils/aliOssUpload';

const VideoSet = (props) => {
  const { visible = {}, onClose, fetchGetRate, loading, onSubmit, childRef } = props;
  const { type, show, initialValues = {} } = visible;
  const { listPayload, title, ownerId, momentId } = initialValues;

  // type merchant:'商家' ，ugc：UGC视频 , videoAD: 视频广告
  const [form] = Form.useForm();
  const [collection] = Form.useForm();
  const [share] = Form.useForm();
  const [reward] = Form.useForm();

  const commonProps = {
    momentId,
    ownerId,
    fetchGetRate,
    listPayload,
  };

  // show  判断是否是UGC视频，是的话显示打赏卡豆数设置
  const formContent = [
    {
      show: false,
      rateType: 'collection',
      form: collection,
      initialValues: initialValues.collectionList,
      formItems: [
        {
          label: '收藏数',
          type: 'formItem',
          formItem: (
            <VideoFormList
              name="collection"
              form={collection}
              ruleType="collection"
              {...commonProps}
              collectionValues={initialValues.collectionList}
            ></VideoFormList>
          ),
        },
      ],
    },
    {
      show: false,
      rateType: 'share',
      form: share,
      initialValues: initialValues.shareList,
      formItems: [
        {
          label: '分享数',
          type: 'formItem',
          formItem: (
            <VideoFormList
              name="share"
              form={share}
              ruleType="share"
              {...commonProps}
              shareValues={initialValues.shareList}
            ></VideoFormList>
          ),
        },
      ],
    },
    {
      show: type !== 'ugc',
      rateType: 'reward',
      form: reward,
      initialValues: initialValues.rewardList,
      formItems: [
        {
          label: '打赏卡豆数',
          type: 'formItem',
          formItem: (
            <VideoFormList
              name="reward"
              form={reward}
              ruleType="reward"
              {...commonProps}
              rewardValues={initialValues.rewardList}
            ></VideoFormList>
          ),
        },
      ],
    },
  ];

  const formItems = [
    {
      label: '微信好友分享图',
      name: 'friendShareImg',
      type: 'upload',
      maxFile: 1,
      maxSize: 128,
      isCut: false,
      imgRatio: WXFRIEND_SHARE_IMG,
      rules: [{ required: false }],
      extra: (
        <>
          <span>{`请上传比例为 5 * 4，大小128kb以内的jpg图片（375 * 300以上`}</span>
          <br />
          <span>{`底部确认按钮只对微信好友分享图有效`}</span>
        </>
      ),
    },
  ];

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { friendShareImg = '' } = values;
      const fImg = await aliOssUpload(friendShareImg);
      onSubmit(
        {
          momentId,
          ownerId,
          friendShareImg: fImg.toString(),
        },
        () => {
          childRef.current.fetchGetData();
          onClose();
        },
      );
    });
  };

  const modalProps = {
    title: `设置--${title}`,
    visible: show,
    onClose,
    width: 850,
    footer:
      type === 'videoAD' ? null : (
        <Button type="primary" onClick={handleSave} loading={loading}>
          确认
        </Button>
      ),
  };
  return (
    <DrawerCondition {...modalProps}>
      {formContent.map((item) =>
        !item.show ? (
          <div key={item.rateType}>
            <FormCondition
              form={item.form}
              formItems={item.formItems}
              initialValues={item.initialValues}
            ></FormCondition>
          </div>
        ) : null,
      )}
      {type === 'videoAD' ? null : (
        <FormCondition
          form={form}
          formItems={formItems}
          initialValues={initialValues}
        ></FormCondition>
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['videoPlatform/fetchNewShareNoAudit'],
}))(VideoSet);
