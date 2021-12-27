import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { checkCityName } from '@/utils/utils';
import { connect } from 'umi';
import { Button, Form, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import QuestionTooltip from '@/components/QuestionTooltip';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import HistoryFollow from './HistoryFollow';
import TagModal from './TagModal';
import { FOLLOW_TYPE, FOLLOW_MANNER, SHARE_SEX_TYPE } from '@/common/constant';

const UserFollowSet = (props) => {
  const { currentUser, visible, onClose, childRef, dispatch, loading } = props;
  const { show = false, type, detail = {} } = visible;

  const [form] = Form.useForm();

  const [tagList, setTagList] = useState([]); //  标签列表
  const [userList, setUserList] = useState([]); //  用户列表
  const [detailInfo, setDetailInfo] = useState({}); // 用户详情

  const [visibleTag, setVisibleTag] = useState(false); //tag选择弹框
  const [visibleHistory, setVisibleHistory] = useState(false); //跟进记录

  useEffect(() => {
    if (show) {
      const { tags = '' } = detail;
      const list = tags ? tags.split(',') : [];
      setTagList(list);
      type === 'edit' && getUserList(detail?.userIdString);
    }
    if (type === 'edit') {
      setDetailInfo({ ...detail, followTime: moment(detail.followTime, 'YYYY-MM-DD HH:mm:ss') });
    } else {
      setDetailInfo(detail);
    }
  }, [show]);

  //获取用户列表数据
  const getUserList = (content) => {
    if (type === 'edit') return;
    if (!content || content.length < 2) return;
    dispatch({
      type: 'baseData/fetchGetUsersSearch',
      payload: {
        content,
      },
      callback: (useList) => {
        const list = useList
          .map((item) => ({
            ...item,
            value: item.userIdString,
            label: item.mobile + '-' + item.username + '-' + item.userIdString,
          }))
          .splice(0, 100);
        setUserList(list);
      },
    });
  };

  // 提交表单
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
          followTime: values.followTime.format('YYYY-MM-DD HH:mm:ss'),
        },
        callback: () => {
          childRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const handleClose = (removedTag) => {
    const tags = tagList.filter((tag) => tag !== removedTag);
    setTagList(tags);
    form.setFieldsValue({
      tags: tags.toString(),
    });
  };

  // 获取用户详情
  const handleUseInfo = (userId) => {
    dispatch({
      type: 'userFollow/fetchGetUserDetail',
      payload: {
        userId,
      },
      callback: (Info) => {
        setDetailInfo({ userId, ...Info });
        setTagList([]);
      },
    });
  };

  const useItem = [
    {
      label: (
        <QuestionTooltip
          type="quest"
          title="用户"
          content={
            '请输入用户手机号、昵称或ID输入后下方列出符合的内容，选择一个，然后带出用户信息、用户标签，未选择时不显示。'
          }
        ></QuestionTooltip>
      ),
      name: 'userId',
      type: 'select',
      select: userList,
      placeholder: '请输入用户手机号、昵称或ID',
      rules: [{ required: true, message: '请选择用户' }],
      loading: loading.effects['baseData/fetchGetUsersSearch'],
      hidden: type == 'edit',
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
      type: 'textArea',
      maxLength: 500,
      span: 2,
    },
    {
      label: '跟进标签',
      name: 'tags',
      type: 'formItem',
      rules: [{ required: true }],
      addRules: [
        {
          validator: () => {
            if (tagList.length == 0) {
              return Promise.reject('请选择跟进标签');
            }
            return Promise.resolve();
          },
        },
      ],
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
      type: 'textArea',
      maxLength: 200,
    },
    {
      label: '跟进人',
      name: 'follower',
      type: 'noForm',
      formItem: (
        <div style={{ marginLeft: 98, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
          跟进人: <div style={{ marginLeft: '5px' }}>{currentUser.username}</div>
        </div>
      ),
    },
    {
      label: '跟进时间',
      type: 'dataPicker',
      name: 'followTime',
      showTime: 'true',
      disabledDate: (current) => {
        console.log(moment().endOf('day'));
        return current && current > moment().endOf('day');
      },
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
      name: 'levelName',
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

  const modalProps = {
    title: { add: '新增', edit: '编辑' }[type],
    visible: show,
    onClose,
    closeCallBack: () => {
      setDetailInfo({});
      setTagList([]);
    },
    footer: (
      <Button type="primary" onClick={handleSave}>
        确定
      </Button>
    ),
  };
  return (
    <>
      <DrawerCondition {...modalProps}>
        {/* 选择用户 */}
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
          <Button
            style={{ float: 'right', marginTop: 5 }}
            disabled={Object.keys(detailInfo).length === 1}
            type="link"
            onClick={handleOpenRecord}
          >
            历史跟进情况
          </Button>
          {/* 下方的表单 */}
          <FormCondition
            formItems={followwItem}
            form={form}
            initialValues={{ followTime: moment(), ...detailInfo }}
          ></FormCondition>
        </div>
      </DrawerCondition>

      {/* 历史跟进详情 */}
      <HistoryFollow
        visible={visibleHistory}
        onClose={() => setVisibleHistory(false)}
        userId={detailInfo.userIdString}
      ></HistoryFollow>
      {/* 标签Modal */}
      <TagModal visible={visibleTag} onClose={() => setVisibleTag(false)}></TagModal>
    </>
  );
};

export default connect(({ userInfo, loading }) => ({
  currentUser: userInfo.currentUser,
  loading,
}))(UserFollowSet);
