import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Button } from 'antd';
import EditorForm from '@/components/EditorForm';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import styles from '../style.less';

const BusinessVideoSet = (props) => {
  const { dispatch, loading, setTabKey } = props;

  const [form] = Form.useForm();
  const [titleNum, setTitleNum] = useState(0); // 输入标题
  const [content, setContent] = useState(''); // 输入的富文本内容

  // 上传图片到oss -> 提交表单
  const onFinish = () => {
    form.validateFields().then((values) => {
      const { coverImg } = values;
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: 'serviceNews/fetchNewsEdit',
          payload: {
            ...values,
            content,
            coverImg: res.toString(),
            publisherName: '哒卡乐',
          },
          callback: () => setTabKey('tab1'),
        });
      });
    });
  };

  const formItems = [
    {
      label: '封面图',
      name: 'coverImg',
      type: 'upload',
      maxFile: 1,
    },
    {
      label: '简介',
      name: 'description',
      type: 'textArea',
      rows: 6,
      maxLength: 200,
    },
  ];

  return (
    <Row justify="center" gutter={[16, 16]}>
      <Col lg={24} xl={16} xxl={12} md={24} sm={24} xs={24}>
        <Form form={form}>
          <Form.Item
            name="title"
            className={styles.article_title}
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input
              size="large"
              maxLength={50}
              suffix={`${titleNum}/50`}
              placeholder="输入文章标题"
              onChange={(e) => setTitleNum(e.target.value.length)}
            />
          </Form.Item>
          <EditorForm setContent={setContent}></EditorForm>
        </Form>
      </Col>
      <Col lg={24} xl={8} xxl={6} md={24} sm={24} xs={24}>
        <FormCondition
          formItems={formItems}
          form={form}
          layout="vertical"
          formItemLayouts={{
            labelCol: null,
            wrapperCol: null,
          }}
        ></FormCondition>
        <Button disabled={!content.length} type="primary" onClick={onFinish} loading={loading}>
          确定添加
        </Button>
      </Col>
    </Row>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessVideoSet);
