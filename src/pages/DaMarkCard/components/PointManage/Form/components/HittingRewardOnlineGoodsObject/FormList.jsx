import React, { useState } from 'react';
import update from 'immutability-helper';
import { Space, Form, InputNumber, Input, Radio } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import { MinusCircleOutlined } from '@ant-design/icons';
import Upload from '@/components/FormCondition/Upload/Img';
import Video from '@/components/FormCondition/Upload/Video';
import styles from './index.less';

const FormList = (props) => {
  const { name, form, field, remove, move } = props;
  const [videoType, setVideoType] = useState('1'); // 视频类型

  const uploadVideo = async (index, val) => {
    let videoUrl = await aliOssUpload(val);
    // 获取视频的时长 长宽高
    const videoElement = document.createElement('video');
    videoElement.addEventListener('loadedmetadata', function (_event) {
      const duration = videoElement.duration; // 单位：秒
      // 获取数据数组
      const dataList = form.getFieldValue(name);
      // 更新数据数组
      const newData = update(dataList, {
        $splice: [
          [index, 1, { ...dataList[index], length: duration, videoUrl: videoUrl.toString() }],
        ],
      });
      form.setFieldsValue({
        hittingRewardOnlineGoodsObject: {
          subRewardList: newData,
        },
      });
    });
    videoElement.src = videoUrl.toString();
    videoElement.load();
  };

  const uploadImg = async (index, val) => {
    let imgUrl = await aliOssUpload(val);
    // 获取数据数组
    const dataList = form.getFieldValue(name);
    // 更新数据数组
    const newData = update(dataList, {
      $splice: [
        [
          index,
          1,
          {
            ...dataList[index],
            onlineGoodsDTO: { ...dataList.onlineGoodsDTO, goodsImg: imgUrl.toString() },
          },
        ],
      ],
    });
    form.setFieldsValue({
      hittingRewardOnlineGoodsObject: {
        subRewardList: newData,
      },
    });
  };

  return (
    <div key={field.key}>
      <Space className={styles.ifame_carouseal} align="baseline">
        <Form.Item name={[field.name, 'onlineGoodsDTO', 'goodsImg']} noStyle>
          <Upload maxFile={1} form={form} onChange={(val) => uploadImg(field.name, val)}></Upload>
        </Form.Item>
        <div>
          <Form.Item name={[field.name, 'onlineGoodsDTO', 'goodsName']} noStyle>
            <Input style={{ marginBottom: 24 }} placeholder="请输入商品名称" maxLength={20} />
          </Form.Item>
          <div>
            <Form.Item name={[field.name, 'onlineGoodsDTO', 'oriPrice']} noStyle>
              <InputNumber style={{ width: 180, marginRight: 10 }} addonBefore="售价￥" />
            </Form.Item>
            <Form.Item name={[field.name, 'total']} noStyle>
              <InputNumber style={{ width: 160 }} placeholder="每月奖品总量" />
            </Form.Item>
          </div>
        </div>
        <MinusCircleOutlined onClick={() => remove(field.name)} />
      </Space>
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
            <Video maxFile={1} form={form} onChange={(val) => uploadVideo(field.name, val)}></Video>
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
