import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tabs, Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const InviteImg = (props) => {
  const { loading, dispatch } = props;
  const [tabKey, setTabKey] = useState('user');
  useEffect(() => {
    getShareList();
  }, [tabKey]);
  const getShareList = () => {
    dispatch({
      type: 'globalConfig/fetchInviteImgList',
      payload: {
        shareType: tabKey,
      },
    });
  };

  const { TabPane } = Tabs;
  const [form] = Form.useForm();

  const handleUpload = () => {
    form.validateFields().then((values) => {
      const { shareImg } = values;
      aliOssUpload(shareImg).then((res) => {
        dispatch({
          type: 'globalConfig/fetchInviteImgSave',
          payload: {
            shareImg: res.toString(),
            shareType: tabKey,
          },
          callback: () => {
            getShareList();
          },
        });
      });
    });
  };

  const formItems = [
    {
      name: 'shareImg',
      type: 'upload',
      maxFile: 6,
    },
  ];
  const handleChange = (key) => {
    setTabKey(key);
  };

  return (
    <>
      <Tabs defaultActiveKey="user" onChange={handleChange}>
        <TabPane tab="用户端/小程序" key="user">
          <FormCondition form={form} formItems={formItems}></FormCondition>
        </TabPane>
        <TabPane tab="商家端" key="merchant">
          <FormCondition form={form} formItems={formItems}></FormCondition>
        </TabPane>
      </Tabs>
      <Button type="primary" onClick={handleUpload}>
        确认
      </Button>
    </>
  );
};
export default connect(({ loading, globalConfig }) => ({ loading: loading.models.globalConfig }))(
  InviteImg,
);
