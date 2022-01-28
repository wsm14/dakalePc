import React from 'react';
import update from 'immutability-helper';
import { Space, Form, InputNumber, Input, Radio } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import aliOssUpload from '@/utils/aliOssUpload';
import Upload from '@/components/FormCondition/Upload/Img';
import styles from './index.less';

const FormList = (props) => {
  const { name, form, field, remove, move, initialValues } = props;

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
            actualGoodsDTO: {
              ...dataList[index].actualGoodsDTO,
              goodsImg: imgUrl.toString(),
            },
          },
        ],
      ],
    });
    form.setFieldsValue({
      hittingRewardActualGoodsObject: {
        subRewardList: newData,
      },
    });
  };

  return (
    <div key={field.key}>
      <Space className={styles.ifame_carouseal} align="baseline">
        <Form.Item name={[field.name, 'actualGoodsDTO', 'goodsImg']} noStyle>
          <Upload
            name={[
              'hittingRewardActualGoodsObject',
              'subRewardList',
              field.name,
              'actualGoodsDTO',
              'goodsImg',
            ]}
            maxFile={1}
            form={form}
            initialvalues={initialValues}
            onChange={(val) => uploadImg(field.name, val)}
            onRemove={() => uploadImg(field.name, undefined)}
          ></Upload>
        </Form.Item>
        <div>
          <Form.Item name={[field.name, 'actualGoodsDTO', 'goodsName']} noStyle>
            <Input
              style={{ width: 300, marginBottom: 24 }}
              placeholder="请输入商品名称"
              maxLength={20}
            />
          </Form.Item>
          <div>
            <Form.Item name={[field.name, 'total']} noStyle>
              <InputNumber style={{ width: 160 }} placeholder="每月奖品总量" />
            </Form.Item>
          </div>
        </div>
        <MinusCircleOutlined style={{ marginLeft: 20 }} onClick={() => remove(field.name)} />
      </Space>
    </div>
  );
};

export default FormList;
