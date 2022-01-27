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
        <Form.Item name={[name, 'actualGoodsDTO', 'goodsImg']} noStyle>
          <Upload maxFile={1} form={form} onChange={uploadVideo}></Upload>
        </Form.Item>
        <div>
          <Form.Item name={[name, 'actualGoodsDTO', 'goodsName']} noStyle>
            <Input
              style={{ width: 300, marginBottom: 24 }}
              placeholder="请输入商品名称"
              maxLength={20}
            />
          </Form.Item>
          <div>
            <Form.Item name={[name, 'total']} noStyle>
              <InputNumber style={{ width: 160 }} placeholder="每月奖金总量" />
            </Form.Item>
          </div>
        </div>
        <MinusCircleOutlined style={{ marginLeft: 20 }} onClick={() => remove(field.name)} />
      </Space>
    </div>
  );
};

export default FormList;
