import React, { useState } from 'react';
import { connect } from 'umi';
import { Drawer, Button, Space, Form, Skeleton } from 'antd';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import UrlList from './urlList';

const FAQSet = (props) => {
  const { dispatch, visible = {}, typeList, onClose, cRef, loading, sortList } = props;
  const { type = '', detail = {} } = visible;

  const [form] = Form.useForm();
  const [skeletonType, setSkeletonType] = useState(true);

  // 确认数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      const { questionDescImg = '' } = values;
      aliOssUpload(questionDescImg).then((res) => {
        dispatch({
          type: {
            add: 'serviceFAQ/fetchFAQAdd',
            edit: 'serviceFAQ/fetchFAQEdit',
          }[type],
          payload: {
            ...detail,
            ...values,
            questionDescImg: res.toString(),
            id: detail.questionIdString,
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: 'FAQ标题',
      name: 'questionTitle',
    },
    {
      label: 'FAQ所属位置',
      name: 'userType',
      type: 'radio',
      select: typeList ? typeList.map(({ key, tab }) => ({ value: key, name: tab })) : [],
    },
    {
      label: 'FAQ所属分类',
      name: 'questionCategoryId',
      type: 'select',
      select: sortList,
      fieldNames: { labelKey: 'questionCategoryName', valueKey: 'questionCategoryIdString' },
      onChange: (val, item) => {
        form.setFieldsValue({
          questionCategoryName: item.children[0],
        });
      },
    },
    {
      label: 'FAQ所属分类名称',
      name: 'questionCategoryName',
      hidden: true,
    },
    {
      label: '超链接',
      type: 'noForm',
      rules: [{ required: false }],
      childrenOwn: <UrlList key="url"></UrlList>,
    },
    {
      label: 'FAQ内容描述',
      type: 'textArea',
      name: 'questionDesc',
      maxLength: 600,
      // type: 'noForm',
      // childrenOwn: (
      //   <Form.Item
      //     key="questionDescText"
      //     label={'FAQ内容描述'}
      //     name={'questionDescText'}
      //     rules={[
      //       { type: 'string', max: 600, message: '最多输入600个字' },
      //       { required: true, message: '请输入FAQ内容描述' },
      //     ]}
      //     labelCol={24}
      //     wrapperCol={24}
      //   >
      //     <EditorForm
      //       setContent={(val, text) => {
      //         form.setFieldsValue({
      //           questionDesc: val,
      //           questionDescText: text,
      //         });
      //       }}
      //       content={detail.questionDesc}
      //       contentClass={styles.edit_height}
      //       maxLength={600}
      //     ></EditorForm>
      //   </Form.Item>
      // ),
    },
    // {
    //   label: 'FAQ内容描述a',
    //   name: 'questionDesc',
    //   hidden: true,
    // },
    {
      label: '上传图片',
      type: 'upload',
      name: 'questionDescImg',
      maxFile: 3,
      rules: [{ required: false }],
    },
    {
      label: '同时设置猜你想问',
      name: 'likeStatus',
      type: 'radio',
      select: ['不设置', '设置'],
      rules: [{ required: false }],
    },
  ];

  return (
    <Drawer
      title={`${type == 'add' ? '新增' : '编辑'}问题`}
      width={600}
      visible={!!type}
      destroyOnClose
      afterVisibleChange={(showEdit) => {
        if (showEdit) {
          setSkeletonType(false);
        } else {
          setSkeletonType(true);
        }
      }}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={fetchUpData} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <Skeleton loading={skeletonType} active>
        <FormCondition formItems={formItems} form={form} initialValues={detail} />
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  sortList: serviceFAQ.sortList.list,
  loading: loading.models.serviceFAQ,
}))(FAQSet);
