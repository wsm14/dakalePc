import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tabs, Form, Button } from 'antd';
import { GLOBAL_CONFIG_SHARE } from '@/common/imgRatio';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import StoreList from '@/pages/Business/components/Group/StoreList';

const InviteImg = (props) => {
  const { loading, dispatch } = props;
  const [tabKey, setTabKey] = useState('user');
  const [list, setList] = useState({});

  useEffect(() => {
    getShareList();
  }, [tabKey]);

  const getShareList = () => {
    dispatch({
      type: 'globalConfig/fetchInviteImgList',
      payload: {
        shareType: tabKey,
      },
      callback: (list) => setList(list),
    });
  };

  const { TabPane } = Tabs;
  const [user] = Form.useForm();
  const [merchant] = Form.useForm();

  const handleUpload = (form) => {
    console.log(form);
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
      extra: '请上传1080*2340px的png/jpg格式图片',
      imgRatio: GLOBAL_CONFIG_SHARE,
    },
  ];
  const handleChange = (key) => {
    setList({});
    setTabKey(key);
  };

  return (
    <>
      <Tabs defaultActiveKey="user" onChange={handleChange}>
        <TabPane tab="用户端/小程序" key="user" loading={loading}>
          <FormCondition form={user} formItems={formItems} initialValues={list}></FormCondition>
          <Button type="primary" onClick={() => handleUpload(user)}>
            确认
          </Button>
        </TabPane>
        <TabPane tab="商家端" key="merchant" loading={loading}>
          <FormCondition form={merchant} formItems={formItems} initialValues={list}></FormCondition>
          <Button type="primary" onClick={() => handleUpload(merchant)}>
            确认
          </Button>
        </TabPane>
      </Tabs>
    </>
  );
};
export default connect(({ loading, globalConfig }) => ({
  loading: loading.effects['globalConfig/fetchInviteImgList'],
}))(InviteImg);
