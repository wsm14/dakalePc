import React, { useState, useEffect } from 'react';
import { checkCityName } from '@/utils/utils';
import { connect } from 'umi';
import { Button, Form, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import HistoryFollow from './HistoryFollow';
import TagModal from './TagModal';
import { FOLLOW_TYPE, FOLLOW_MANNER, SHARE_SEX_TYPE } from '@/common/constant';

const UserFollowSet = (props) => {
  const { visible, onClose, childRef, dispatch } = props;
  const { show = false, type, detail = {} } = visible;
  const [form] = Form.useForm();
  const [tagList, setTagList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [detailInfo, setDetailInfo] = useState({});

  const [visibleTag, setVisibleTag] = useState(false); //tag选择弹框
  const [visibleHistory, setVisibleHistory] = useState(false); //跟进记录

  useEffect(() => {
    if (show) {
      const { tags = '' } = detail;
      const list = tags ? tags.split(',') : [];
      setTagList(list);
      getUserList(detail.userIdString);
    }
    setDetailInfo(detail);
  }, [show]);

  //获取用户列表数据
  const getUserList = (content) => {
    if (!content || content.length < 2) return;
    dispatch({
      type: 'baseData/fetchGetUsersSearch',
      payload: {
        content,
      },
      callback: (useList) => {
        const list = useList.map((item) => ({
          ...item,
          value: item.userIdString,
          label: item.mobile + '-' + item.username + '-' + item.userIdString,
        }));
        setUserList(list);
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const apiUrl = {
        add: 'userFollow/fetchSaveUserFollowUp',
        edit: 'userFollow/fetchUpdateUserFollowUp',
      }[type];
      dispatch({
        type: apiUrl,
        payload: {
          userFollowUpId: detail.userFollowUpId,
          ...values,
          tags: tagList.toString(),
        },
        callback: () => {
          childRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const modalProps = {
    title: { add: '新增', edit: '编辑' }[type],
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        确定
      </Button>
    ),
  };

  const handleClose = (removedTag) => {
    const tags = tagList.filter((tag) => tag !== removedTag);
    setTagList(tags);
    form.setFieldsValue({
      tags: tags.toString(),
    });
  };

  const handleUseInfo = (userId) => {
    dispatch({
      type: 'userFollow/fetchGetUserDetail',
      payload: {
        userId,
      },
      callback: (Info) => {
        setDetailInfo(Info);
        setTagList([]);
      },
    });
  };

  const useItem = [
    {
      label: '用户',
      name: 'userId',
      type: 'select',
      select: userList,
      disabled: type == 'edit',
      fieldNames: { label: 'label', value: 'value' },
      onSearch: (val) => getUserList(val),
      onChange: (val) => handleUseInfo(val),
    },
  ];

  const followwItem = [
    // {
    //   title: '用户标签',
    //   label: '用户标签',
    //   name: 'pushStatus',
    // },
    {
      title: '跟进详情',
      label: '跟进方式',
      name: 'manner',
      type: 'select',
      select: FOLLOW_MANNER,
    },
    {
      label: '跟进类型',
      name: 'type',
      type: 'select',
      select: FOLLOW_TYPE,
    },
    {
      label: '跟进内容',
      name: 'content',
      span: 2,
    },
    {
      label: '跟进标签',
      name: 'tags',
      type: 'formItem',
      rules: [{ required: true }],
      formItem: (
        <>
          {tagList.map((tag, index) => (
            <Tag className="edit-tag" key={tag} closable onClose={() => handleClose(tag)}>
              {tag}
            </Tag>
          ))}
          <Tag
            style={{ padding: '0 20px' }}
            onClick={() =>
              setVisibleTag({
                show: true,
                tagArr: detail.tagArr,
                oldTag: tagList,
                setTagList,
              })
            }
          >
            <PlusOutlined />
          </Tag>
        </>
      ),
    },
    {
      label: '跟进结果',
      name: 'result',
      span: 2,
    },
    {
      label: '跟进人',
      name: 'follower',
    },
    {
      label: '跟进时间',
      name: 'followTime',
    },
  ];

  const formItems = [
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '注册手机号',
      name: 'mobile',
    },
    {
      label: 'ID',
      name: 'userId',
    },
    {
      label: '身份',
      name: 'content',
    },
    {
      label: '性别',
      name: 'gender',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      label: '地区',
      name: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      label: '注册时间',
      name: 'createTime',
    },
    {
      label: '最后行为时间',
      name: 'finalActTime',
    },
  ];

  const handleOpenRecord = () => {
    setVisibleHistory(true);
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <FormCondition formItems={useItem} form={form} initialValues={detailInfo}></FormCondition>
        {/* 编辑或者有用户详情 */}
        {detailInfo.userIdString && (
          <DescriptionsCondition
            labelStyle={{ width: 120 }}
            formItems={formItems}
            column={2}
            initialValues={detailInfo}
          ></DescriptionsCondition>
        )}
        <div>
          <a style={{ float: 'right', marginTop: 5 }} onClick={handleOpenRecord}>
            历史跟进情况
          </a>
          <FormCondition
            formItems={followwItem}
            form={form}
            initialValues={detailInfo}
          ></FormCondition>
        </div>
      </DrawerCondition>

      {/* 历史跟进详情 */}
      <HistoryFollow
        visible={visibleHistory}
        onClose={() => setVisibleHistory(false)}
        userId={detailInfo.userIdString}
      ></HistoryFollow>
      <TagModal visible={visibleTag} onClose={() => setVisibleTag(false)}></TagModal>
    </>
  );
};

export default connect()(UserFollowSet);
