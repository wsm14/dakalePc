import React, { useState } from 'react';
import { Space, Form, InputNumber, Input, Radio } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { goodsDom } from './CouponFreeDom';
import aliOssUpload from '@/utils/aliOssUpload';
import Video from '@/components/FormCondition/Upload/Video';
import styles from './index.less';

const FormList = (props) => {
  const { name, form, field, remove, move, handleType } = props;
  const [videoType, setVideoType] = useState('1'); // 视频类型

  const uploadVideo = async (val) => {
    let imgUrl = await aliOssUpload(val);
    // 获取视频的时长 长宽高
    const videoElement = document.createElement('video');
    videoElement.addEventListener('loadedmetadata', function (_event) {
      const duration = videoElement.duration; // 单位：秒
      form.setFieldsValue({
        hittingRewardRightGoodsObject: {
          // [`${subRewardList[field.name]}`]: {
          //   length: parseInt(duration),
          // },
        },
      });
    });
    videoElement.src = imgUrl.toString();
    videoElement.load();
  };

  return (
    <div key={field.key}>
      <Space className={styles.ifame_carouseal} align="baseline">
        {(() => {
          const goodsItem = form.getFieldValue(name)[field.name]['rightGoodsObject'];
          return goodsDom(goodsItem, goodsItem?.specialGoodsId);
        })()}
        {handleType !== 'edit' && <DeleteOutlined onClick={() => remove(field.name)} />}
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
      <Form.Item label="奖品视频" name={[name, 'isThirdVideo']}>
        <Radio.Group onChange={(e) => setVideoType(e.target.value)} value={videoType}>
          <Radio value="0">哒卡乐视频</Radio>
          <Radio value="1">第三方视频</Radio>
        </Radio.Group>
      </Form.Item>
      {videoType === '0' && (
        <>
          <Form.Item name={[name, 'videoUrl']} rules={[{ required: true, message: '请选择视频' }]}>
            <Video form={form} onChange={uploadVideo}></Video>
          </Form.Item>
          <Form.Item hidden={true} name={[name, 'length']}>
            <Input />
          </Form.Item>
        </>
      )}
      {/* <Form.Item hidden={true} name={[name, 'videoUrl']} >
        <Input />
      </Form.Item> */}
    </div>
  );
};

export default FormList;
