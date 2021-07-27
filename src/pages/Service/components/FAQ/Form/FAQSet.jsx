import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { FAQ_PART_TYPE } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const FAQSet = (props) => {
  const { dispatch, visible = {}, tabKey, onClose, cRef, loading, sortList } = props;
  const { type = '', detail = {} } = visible;

  const [form] = Form.useForm();

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
            userType: tabKey,
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
    // {
    //   label: 'FAQ所属位置',
    //   name: 'userType',
    //   type: 'radio',
    //   select: typeList ? typeList.map(({ key, tab }) => ({ value: key, name: tab })) : [],
    // },
    {
      label: 'FAQ所属分类',
      name: 'questionCategoryId',
      type: 'select',
      select: sortList,
      fieldNames: { label: 'questionCategoryName', value: 'questionCategoryIdString' },
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
      label: 'FAQ内容描述',
      type: 'textArea',
      name: 'questionDesc',
      maxLength: 600,
    },
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

  const modalProps = {
    title: `${type == 'add' ? '新增' : '编辑'}问题 - ${FAQ_PART_TYPE[tabKey]}`,
    visible: !!type,
    onClose,
    footer: (
      <Button onClick={fetchUpData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={detail} />
    </DrawerCondition>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  sortList: serviceFAQ.sortList.list,
  loading: loading.models.serviceFAQ,
}))(FAQSet);
