import React, { useState } from 'react';
import { Space, Form, InputNumber, Input, Radio } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { goodsDom } from './CouponFreeDom';
import { MinusCircleOutlined } from '@ant-design/icons';
import Upload from '@/components/FormCondition/Upload/Img';
import Video from '@/components/FormCondition/Upload/Video';
import styles from './index.less';

const FormList = (props) => {
  const { name, form, field, remove, move, handleType } = props;
  const [videoType, setVideoType] = useState('1'); // 视频类型

  const uploadVideo = () => {};
  return (
    <div key={field.key}>
      <Space className={styles.ifame_carouseal} align="baseline">
        <Form.Item name={[field.name, 'onlineGoodsDTO', 'goodsImg']} noStyle>
          <Upload maxFile={1} form={form} onChange={uploadVideo}></Upload>
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
              <InputNumber style={{ width: 160 }} placeholder="每月奖金总量" />
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
        <Form.Item
          name={[field.name, 'videoUrl']}
          rules={[{ required: true, message: '请选择视频' }]}
        >
          <Video form={form} onChange={uploadVideo}></Video>
        </Form.Item>
      )}
      <Form.Item hidden={true} name={[field.name, 'length']}>
        <Input />
      </Form.Item>
    </div>
  );
};

export default FormList;
