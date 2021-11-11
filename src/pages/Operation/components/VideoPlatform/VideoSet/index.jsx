import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import VideoFormList from './VideoFormList';

const VideoSet = (props) => {
  const { visible = {}, onClose, fetchGetRate } = props;
  const { type, show, initialValues = {} } = visible;
  const { listPayload, title, ownerId, momentId } = initialValues;

  // type merchant:'商家' ，ugc：UGC视频 , videoAD: 视频广告

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

  const modalProps = {
    title: `设置--${title}`,
    visible: show,
    onClose,
    width: 850,
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
    </DrawerCondition>
  );
};

export default connect()(VideoSet);
