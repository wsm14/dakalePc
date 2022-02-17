import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { DownSquareOutlined } from '@ant-design/icons';
import { Button, InputNumber, Tooltip, Space } from 'antd';
import { SUBSIDY_ACTION_ROLES, SUBSIDY_ACTION_ROLE, SUBSIDY_TASK_ROLE } from '@/common/constant';
import {
  MreSelect,
  MreSelectShow,
  UserSelectShow,
  GroupSelectModal,
  GroupSelectShow,
  CitySelect,
  CitySelectShow,
  PartnerSelect,
  PartnerSelectShow,
} from '@/components/MerUserSelectTable';
import FormCondition from '@/components/FormCondition';
import ImportDataModal from './ImportDataModal';

const SubsidyDirectMoney = (props) => {
  const { form, detail, tab } = props;

  const [role, setRole] = useState(false); // 补贴角色
  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ keys: [], list: [] }); // 选择店铺后回显的数据
  const [visibleCity, setVisibleCity] = useState(false); // 选择市级代理弹窗
  const [cityList, setCityList] = useState({ keys: [], list: [] }); // 选择市级代理后回显的数据
  const [visiblePartner, setVisiblePartner] = useState(false); // 选择区县代理弹窗
  const [partnerList, setPartnerList] = useState({ keys: [], list: [] }); // 选择区县代理后回显的数据
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [], resultList: [] }); // 选择后回显的数据
  const [userNumber, setUserNumber] = useState({}); // 卡豆数 暂存输入值
  const [userTotal, setUserTotal] = useState(0); // 卡豆数总数
  const [visibleGroup, setVisibleGroup] = useState(false); // 选择店铺弹窗
  const [groupList, setGroupList] = useState({ keys: [], list: [] }); // 选择集团后回显的数据
  const [mreNumber, setMreNumber] = useState({}); // 店铺回收卡豆数 暂存输入值
  const [groupNumber, setGroupNumber] = useState({}); // 集团回收卡豆数 暂存输入值
  const [cityNumber, setCityNumber] = useState({}); // 市级代理回收卡豆数 暂存输入值
  const [partnerNumber, setPartnerNumber] = useState({}); // 区县代理回收卡豆数 暂存输入值
  const [visiblePort, setVisiblePort] = useState(false);

  // 设置form表单值 店铺id
  // useEffect(() => {
  //   const subsidyBeanObjects = mreList.keys.map((item) => ({
  //     ownerId: item,
  //     bean: rechargeBeans || 0,
  //   }));
  //   form.setFieldsValue({ subsidyBeanObjects });
  //   form.setFieldsValue({ merchantIds: mreList.keys.toString() });
  // }, [mreList, rechargeBeans]);

  // 监听用户卡豆数变化
  useEffect(() => {
    // user: '用户', merchant: '店铺', group: '集团', city: '市级代理', partner: '区县代理'
    const list = {
      user: userList,
      merchant: mreList,
      group: groupList,
      city: cityList,
      partner: partnerList,
    }[role];
    const number = {
      user: userNumber,
      merchant: mreNumber,
      group: groupNumber,
      city: cityNumber,
      partner: partnerNumber,
    }[role];
    const newData = lodash.pickBy(number, (value, key) => list.keys.includes(key));
    const subsidyBeanObjects = Object.keys(newData).map((item) => ({
      ownerId: item,
      bean: newData[item] || 0,
    }));
    setUserTotal(lodash.sumBy(subsidyBeanObjects, 'bean'));
    form.setFieldsValue({ subsidyBeanObjects });
  }, [
    userList,
    userNumber,
    mreList,
    mreNumber,
    groupList,
    groupNumber,
    cityList,
    cityNumber,
    partnerList,
    partnerNumber,
  ]);

  // 向下填充
  const downBean = (bean) => {
    if (!bean) return;
    const obj = {};
    const list = {
      user: userList,
      merchant: mreList,
      group: groupList,
      city: cityList,
      partner: partnerList,
    }[role];
    list.keys.map((item) => (obj[item] = bean));
    switch (role) {
      case 'user':
        setUserNumber(obj);
        break;
      case 'merchant':
        setMreNumber(obj);
        break;
      case 'group':
        setGroupNumber(obj);
        break;
      case 'city':
        setCityNumber(obj);
        break;
      case 'partner':
        setPartnerNumber(obj);
        break;
    }
  };
  //批量导入事件
  const handleImport = () => setVisiblePort({ show: true, role });

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '补贴角色',
      name: 'role',
      type: 'select',
      select:
        tab === 'direct'
          ? SUBSIDY_ACTION_ROLES
          : tab === 'task'
          ? SUBSIDY_TASK_ROLE
          : SUBSIDY_ACTION_ROLE,
      onChange: (val) => {
        form.setFieldsValue({ subsidyBeanObjects: undefined });
        setRole(val);
        setUserList({ keys: [], list: [] });
        setMreList({ keys: [], list: [] });
        setGroupList({ keys: [], list: [] });
        setCityList({ keys: [], list: [] });
        setPartnerList({ keys: [], list: [] });
      },
    },
    {
      label: '适用店铺',
      name: 'subsidyBeanObjects',
      // name: tab === 'direct' ? 'subsidyBeanObjects' : 'merchantIds', // 营销卡豆 merchantIds
      type: 'formItem',
      rules: [{ required: true, message: '请选择店铺/子门店' }],
      visible: role === 'merchant',
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisible(true)}>
            选择单店/子门店
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
      ),
    },
    {
      label: '适用店铺',
      type: 'noForm',
      visible: role === 'merchant',
      formItem: (
        <MreSelectShow
          key="MreTable"
          {...mreList}
          setMreList={setMreList}
          otherColumns={[
            {
              fixed: 'right',
              title: '充值卡豆数',
              dataIndex: 'bean',
              render: (val, record) => (
                <>
                  <InputNumber
                    value={mreNumber[record.userMerchantIdString]}
                    precision={0}
                    min={1}
                    onChange={(val) => {
                      setMreNumber(({ sum, ...other }) => {
                        return {
                          ...other,
                          [record.userMerchantIdString]: val,
                        };
                      });
                    }}
                  ></InputNumber>
                  {mreList.list[0].userMerchantIdString === record.userMerchantIdString && (
                    <Tooltip placement="top" title={'向下填充（已勾选数据）'}>
                      <DownSquareOutlined
                        onClick={() => downBean(mreNumber[record.userMerchantIdString])}
                        style={{ fontSize: 20, marginLeft: 5, cursor: 'pointer' }}
                      ></DownSquareOutlined>
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        ></MreSelectShow>
      ),
    },

    {
      label: '适用集团',
      name: 'subsidyBeanObjects',
      type: 'formItem',
      visible: role === 'group',
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisibleGroup(true)}>
            选择集团
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
      ),
    },
    {
      label: '适用集团',
      type: 'noForm',
      visible: role === 'group',
      formItem: (
        <GroupSelectShow
          key="MreTable"
          {...groupList}
          setGroupList={setGroupList}
          otherColumns={[
            {
              fixed: 'right',
              title: '充值卡豆数',
              dataIndex: 'bean',
              render: (val, record) => (
                <>
                  <InputNumber
                    value={groupNumber[record.merchantGroupIdString]}
                    precision={0}
                    min={1}
                    onChange={(val) =>
                      setGroupNumber(({ sum, ...other }) => ({
                        ...other,
                        [record.merchantGroupIdString]: val,
                      }))
                    }
                  ></InputNumber>
                  {groupList.list[0].merchantGroupIdString === record.merchantGroupIdString && (
                    <Tooltip placement="top" title={'向下填充（已勾选数据）'}>
                      <DownSquareOutlined
                        onClick={() => downBean(groupNumber[record.merchantGroupIdString])}
                        style={{ fontSize: 20, marginLeft: 5, cursor: 'pointer' }}
                      ></DownSquareOutlined>
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        ></GroupSelectShow>
      ),
    },

    {
      label: '适用用户',
      name: 'subsidyBeanObjects',
      type: 'formItem',
      extra: tab === 'direct' && (
        <div style={{ color: '#ff4d4f' }}>
          充值成功后在用户端将直接显示现金，哒人可直接提现，请慎重充值
        </div>
      ),
      visible: role === 'user',
      rules: [{ required: true, message: '请选择用户' }],
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
            {tab === 'direct' ? '选择哒人' : '选择用户'}
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
      ),
    },
    {
      label: '适用用户',
      type: 'noForm',
      visible: role === 'user',
      formItem: (
        <UserSelectShow
          maxLength={500}
          key="UserTable"
          {...userList}
          params={tab === 'direct' ? { isDaren: 1 } : {}}
          showSelect={visibleSelect}
          onCancelShowSelect={() => setVisibleSelect(false)}
          onOk={(val) => {
            setUserList(val);
            form.setFieldsValue({ userIdList: val });
          }}
          otherColumns={[
            {
              fixed: 'right',
              title: '充值卡豆数',
              dataIndex: 'bean',
              render: (val, record, index) => (
                <>
                  <InputNumber
                    value={userNumber[record.userIdString]}
                    precision={0}
                    min={0}
                    onChange={(val) =>
                      setUserNumber(({ sum, ...other }) => ({
                        ...other,
                        [record.userIdString]: val,
                      }))
                    }
                  ></InputNumber>
                  {userList.list[0].userIdString === record.userIdString && (
                    <Tooltip placement="top" title={'向下填充（已勾选数据）'}>
                      <DownSquareOutlined
                        onClick={() => downBean(userNumber[record.userIdString])}
                        style={{ fontSize: 20, marginLeft: 5, cursor: 'pointer' }}
                      ></DownSquareOutlined>
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        ></UserSelectShow>
      ),
    },

    {
      label: '适用市级代理',
      name: 'subsidyBeanObjects',
      type: 'formItem',
      rules: [{ required: true, message: '请选择市级代理' }],
      visible: role === 'city',
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisibleCity(true)}>
            选择市级代理
          </Button>
        </Space>
      ),
    },
    {
      label: '适用市级代理',
      type: 'noForm',
      visible: role === 'city',
      formItem: (
        <CitySelectShow
          key="CityTable"
          {...cityList}
          setCityList={setCityList}
          otherColumns={[
            {
              fixed: 'right',
              title: '充值卡豆数',
              dataIndex: 'bean',
              render: (val, record) => (
                <>
                  <InputNumber
                    value={cityNumber[record.cityId]}
                    precision={0}
                    min={1}
                    onChange={(val) => {
                      setCityNumber(({ sum, ...other }) => {
                        return {
                          ...other,
                          [record.cityId]: val,
                        };
                      });
                    }}
                  ></InputNumber>
                  {cityList.list[0].cityId === record.cityId && (
                    <Tooltip placement="top" title={'向下填充（已勾选数据）'}>
                      <DownSquareOutlined
                        onClick={() => downBean(cityNumber[record.cityId])}
                        style={{ fontSize: 20, marginLeft: 5, cursor: 'pointer' }}
                      ></DownSquareOutlined>
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        ></CitySelectShow>
      ),
    },

    {
      label: '适用区县代理',
      name: 'subsidyBeanObjects',
      type: 'formItem',
      rules: [{ required: true, message: '请选择区县代理' }],
      visible: role === 'partner',
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisiblePartner(true)}>
            选择区县代理
          </Button>
        </Space>
      ),
    },
    {
      label: '适用区县代理',
      type: 'noForm',
      visible: role === 'partner',
      formItem: (
        <PartnerSelectShow
          key="PartnerTable"
          {...partnerList}
          setPartnerList={setPartnerList}
          otherColumns={[
            {
              fixed: 'right',
              title: '充值卡豆数',
              dataIndex: 'bean',
              render: (val, record) => (
                <>
                  <InputNumber
                    value={partnerNumber[record.partnerId]}
                    precision={0}
                    min={1}
                    onChange={(val) => {
                      setPartnerNumber(({ sum, ...other }) => {
                        return {
                          ...other,
                          [record.partnerId]: val,
                        };
                      });
                    }}
                  ></InputNumber>
                  {partnerList.list[0].partnerId === record.partnerId && (
                    <Tooltip placement="top" title={'向下填充（已勾选数据）'}>
                      <DownSquareOutlined
                        onClick={() => downBean(partnerNumber[record.partnerId])}
                        style={{ fontSize: 20, marginLeft: 5, cursor: 'pointer' }}
                      ></DownSquareOutlined>
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        ></PartnerSelectShow>
      ),
    },
    {
      label: '充值卡豆数',
      type: 'formItem',
      formItem: <>{userTotal}</>,
    },
    {
      label: '充值凭证',
      name: 'certificate',
      type: 'upload',
      maxFile: 1,
    },
  ];

  return (
    <>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      {/* partner */}
      <PartnerSelect
        keys={partnerList.keys}
        visible={visiblePartner}
        partnerList={partnerList.list}
        onOk={(val) => setPartnerList(val)}
        onCancel={() => setVisiblePartner(false)}
      ></PartnerSelect>
      {/* city */}
      <CitySelect
        keys={cityList.keys}
        visible={visibleCity}
        cityList={cityList.list}
        onOk={(val) => setCityList(val)}
        onCancel={() => setVisibleCity(false)}
      ></CitySelect>
      {/* merchant */}
      <MreSelect
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        params={{ settlementFlag: 1 }}
        onOk={(val) => setMreList(val)}
        onCancel={() => setVisible(false)}
      ></MreSelect>
      {/* group */}
      <GroupSelectModal
        keys={groupList.keys}
        visible={visibleGroup}
        groupList={groupList.list}
        onOk={(val) => setGroupList(val)}
        onCancel={() => setVisibleGroup(false)}
      ></GroupSelectModal>
      {/* 批量导入 */}
      <ImportDataModal
        visible={visiblePort}
        onClose={() => setVisiblePort(false)}
        setMreList={(list) => {
          setMreList({ ...list });
          const merNumbers = {};
          list.list.map((item) => (merNumbers[item.userMerchantIdString] = item.subsidyBean));
          setMreNumber(merNumbers);
        }}
        setUserList={(list) => {
          setUserList({ ...list });
          const numbers = {};
          list.list.map((item) => (numbers[item.userIdString] = item.subsidyBean));
          setUserNumber(numbers);
        }}
        setGroupList={(list) => {
          setGroupList({ ...list });
          const groupNumbers = {};
          list.list.map((item) => (groupNumbers[item.merchantGroupIdString] = item.subsidyBean));
          setGroupNumber(groupNumbers);
        }}
      ></ImportDataModal>
    </>
  );
};

export default SubsidyDirectMoney;
