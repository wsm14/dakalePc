import React, { useState, useEffect } from 'react';
import update from 'immutability-helper';
import { Space, Form, InputNumber, Input, Radio, Card, Button } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import aliOssUpload from '@/utils/aliOssUpload';
import { MinusCircleOutlined } from '@ant-design/icons';
import Upload from '@/components/FormCondition/Upload/Img';
import Video from '@/components/FormCondition/Upload/Video';
import FormCondition from '@/components/FormCondition';
import styles from './index.less';

import GoodsSelectModal from './GoodsSelectModal';
import { goodsDom, commerceDom } from '@/components/VideoSelectBindContent/CouponFreeDom';

const FormList = (props) => {
  const { name, form, field, remove, move, initialValues } = props;
  const [visible, setVisible] = useState(false); // 权益商品 弹窗

  const uploadImg = async (index, val) => {
    console.log(index, val);

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
            brandImg: imgUrl.toString(),
          },
        ],
      ],
    });
    form.setFieldsValue({
      [name]: newData,
    });
  };

  return (
    <div key={field.key}>
      <Card
        title={`品牌${field.name + 1}`}
        size="small"
        style={{ marginBottom: '10px' }}
        extra={
          <>
            <UpSquareOutlined
              onClick={() => {
                move(field.name, field.name - 1);
              }}
              style={{ marginRight: '5px' }}
            />
            <DownSquareOutlined
              onClick={() => {
                move(field.name, field.name + 1);
              }}
            />
            <Button type="link" onClick={() => remove(field.name)}>
              删除
            </Button>
          </>
        }
      >
        <Form.Item
          label="上传大牌图片"
          name={[field.name, 'brandImg']}
          rules={[{ required: true, message: '请上传品牌图片' }]}
        >
          <Upload
            name={[name, field.name, 'brandImg']}
            maxFile={1}
            initialvalues={initialValues}
            onChange={(val) => uploadImg(field.name, val)}
            onRemove={() => uploadImg(field.name, undefined)}
          ></Upload>
        </Form.Item>
        <Form.Item label="大牌商品" required={true}>
          <Button type="link" onClick={() => setVisible(true)}>
            +选择
          </Button>
        </Form.Item>
        <Form.List name={[field.name, 'activityGoodsList']}>
          {(fields2, { remove, move }, { errors }) => {
            return (
              <>
                <Form.ErrorList errors={errors} />
                {fields2.map((field2) => {
                  // const [nameIndex, setNameIndex] = useState(Number);
                  // useEffect(() => {
                  //   setNameIndex(field2.name + 1);
                  // }, [field2]);

                  // const inputDom = () => {
                  //   return (
                  //     <InputNumber
                  //       size="small"
                  //       value={nameIndex}
                  //       onChange={(val) => setNameIndex(val)}
                  //       onPressEnter={() => move(field2.name, nameIndex - 1)}
                  //       precision={0}
                  //       min={1}
                  //       max={fields2.length}
                  //       style={{ width: 60 }}
                  //     ></InputNumber>
                  //   );
                  // };

                  return (
                    <div key={field2.key}>
                      <Space key={field2.key} className={styles.ifame_carouseal} align="baseline">
                        <div className={styles.ifame_btnArr}>
                          <UpSquareOutlined
                            onClick={() => {
                              move(field2.name, field2.name - 1);
                            }}
                          />
                          <DownSquareOutlined
                            onClick={() => {
                              move(field2.name, field2.name + 1);
                            }}
                          />
                        </div>

                        {(() => {
                          const item =
                            form.getFieldValue(name)[field.name]['activityGoodsList'][field2.name];
                          return {
                            specialGoods: goodsDom({ ...item }, item?.activityGoodsId), // 特惠，自我游
                            commerceGoods: commerceDom({ ...item }, item?.activityGoodsId), // 电商品
                          }[item.activityType];
                        })()}
                        <DeleteOutlined onClick={() => remove(field2.name)} />
                      </Space>
                    </div>
                  );
                })}
              </>
            );
          }}
        </Form.List>
      </Card>
      <GoodsSelectModal
        typeGoods="subRewardList"
        form={form}
        visible={visible}
        indexNum={field.name}
        onSumbit={(list) => {
          // 获取数据数组
          const dataList = form.getFieldValue(name);
          // 更新数据数组
          const newData = update(dataList, {
            $splice: [
              [
                field.name,
                1,
                {
                  ...(dataList[field.name] ?? {}),
                  activityGoodsList: list,
                },
              ],
            ],
          });

          form.setFieldsValue({ [name]: newData });
        }}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </div>
  );
};

export default FormList;
