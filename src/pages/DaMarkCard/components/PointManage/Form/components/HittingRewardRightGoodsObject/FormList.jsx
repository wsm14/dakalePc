import React, { useState } from 'react';
import update from 'immutability-helper';
import { Space, Form, InputNumber, Input, Radio } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { goodsDom } from './CouponFreeDom';
import aliOssUpload from '@/utils/aliOssUpload';
import Video from '@/components/FormCondition/Upload/Video';
import styles from './index.less';

const FormList = (props) => {
  const { name, form, field, remove, initialValues } = props;
  const [videoType, setVideoType] = useState('1'); // 视频类型

  const uploadVideo = async (index, val) => {
    // const dataList = form.getFieldValue(name);
    // const newData = update(dataList, {
    //   $splice: [[index, 1, { ...dataList[index], length: 1112345 }]],
    // });
    let videoUrl = await aliOssUpload(val);
    // 获取视频的时长 长宽高
    const videoElement = document.createElement('video');
    videoElement.addEventListener('loadedmetadata', function (_event) {
      const duration = videoElement.duration; // 单位：秒
      const dataList = form.getFieldValue(name);
      const newData = update(dataList, {
        $splice: [
          [index, 1, { ...dataList[index], length: duration, videoUrl: videoUrl.toString() }],
        ],
      });
      form.setFieldsValue({
        hittingRewardRightGoodsObject: {
          subRewardList: newData,
        },
      });
    });
    videoElement.src = videoUrl.toString();
    videoElement.load();
  };

  return (
    <div key={field.key}>
      <Space className={styles.ifame_carouseal} align="baseline">
        {(() => {
          const goodsItem = form.getFieldValue(name)[field.name]['rightGoodsObject'];
          return goodsDom(goodsItem, goodsItem?.specialGoodsId);
        })()}
        <DeleteOutlined onClick={() => remove(field.name)} />
      </Space>
      <Form.Item label="权益商品Id" name={[field.name, 'rewardId']} hidden={true}>
        <Input />
      </Form.Item>
      <Form.Item
        label="每月奖品总量"
        name={[field.name, 'total']}
        rules={[{ required: true, message: '请输入每月奖品总量' }]}
      >
        <InputNumber style={{ width: 250 }} min={0} placeholder="每月奖品总量" />
      </Form.Item>
      <Form.Item label="奖品视频" name={[field.name, 'isThirdVideo']}>
        <Radio.Group onChange={(e) => setVideoType(e.target.value)}>
          <Radio value="0">哒卡乐视频</Radio>
          <Radio value="1">第三方视频</Radio>
        </Radio.Group>
      </Form.Item>
      {videoType === '0' && (
        <>
          <Form.Item
            preserve={false}
            name={[field.name, 'videoUrl']}
            rules={[{ required: true, message: '请选择视频' }]}
          >
            <Video
              name={[
                'hittingRewardRightGoodsObject',
                'subRewardList',
                field.name,
                'actualGoodsDTO',
                'goodsImg',
              ]}
              initialValues={initialValues}
              maxFile={1}
              form={form}
              onChange={(val) => uploadVideo(field.name, val)}
              onRemove={() => uploadVideo(field.name, undefined)}
            ></Video>
          </Form.Item>
          <Form.Item preserve={false} hidden={true} name={[field.name, 'length']}>
            <Input />
          </Form.Item>
        </>
      )}
    </div>
  );
};

export default FormList;
