import { Button, Modal, Tag } from 'antd';
import { ACCOUNT_STATUS } from '@/common/constant';

const UserDetailShow = (props) => {
  const { dispatch, childRef, initialValues } = props;

  const { status, userIdString } = initialValues;

  const statusNum = Number(status);
  const statusText = !statusNum ? '启用' : '禁用';

  const handleUserStatus = () => {
    Modal.confirm({
      title: `确认${statusText}该账户`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'userList/fetchUserStatus',
          payload: { userId: userIdString, status: Number(!statusNum) },
          callback: () => childRef.current.fetchGetData(),
        });
      },
    });
  };

  return {
    type: 'Drawer',
    showType: 'info',
    title: '用户详情',
    width: 700,
    loadingModels: 'userList',
    formItems: [
      { label: '用户头像', name: 'profile', type: 'upload' },
      { label: '用户手机号', name: 'mobile' },
      { label: '豆号', name: 'beanCode' },
      { label: '用户昵称', name: 'username' },
      { label: '个性签名', name: 'introduction', render: (val) => val || '--' },
      { label: '真实姓名', name: 'realName', render: (val) => val || '无' },
      { label: '性别', name: 'gender', render: (val) => ({ M: '男', F: '女', '': '--' }[val]) },
      // { label: '身份证号', name: 'cardNumber', render: (val) => val || '无' },
      { label: '生日', name: 'birthday', render: (val) => val || '--' },
      { label: '家主手机号', name: 'parentUserMobile', render: (val) => val || '无' },
      { label: '常驻地', name: 'residentAddress', render: (val) => val || '--' },
      { label: '学校', name: 'school', render: (val) => val || '--' },
      { label: '学历', name: 'education', render: (val) => val || '--' },
      { label: '注册时间', name: 'createTime' },
      { label: '常用IP', name: 'lastLoginTime' },
      { label: '账号状态', name: 'status', render: (val) => ACCOUNT_STATUS[val] },
      {
        label: '兴趣标签',
        name: 'tag',
        render: (val) =>
          val &&
          val.split(',').map((item, i) => (
            <Tag color="green" key={i}>
              {item}
            </Tag>
          )),
      },
    ],
    footerBtn: (loading) => [
      <Button key="2" type="primary" onClick={handleUserStatus} loading={loading}>
        {statusText}
      </Button>,
    ],
    ...props,
  };
};

export default UserDetailShow;
