import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { AMAP_KEY } from '@/common/constant';
import debounce from 'lodash/debounce';
import { Map, Marker } from 'react-amap';
import { Select, Button, Space, Spin, Empty, message } from 'antd';
import {
  MARK_CARD_MAIN_TYPE,
  MARK_CARD_OPEN_STATE,
  MARK_CARD_PARENT_TYPE,
} from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const PlatformSet = (props) => {
  const { groupMreList = [], loading, dispatch, form, initialValues, type = 'add' } = props;

  const [radioData, setRadioData] = useState({
    distanceFlagType: '0', //  打卡范围
    parentUserTypes: '', // 家主
  });
  const [ampShow, setAmpShow] = useState(false); // 地图是否显示
  const [location, setLocation] = useState([120, 30]); // 地图显示 [经度, 纬度]
  const [fetching, setFetching] = useState(false); // 查找地址等待状态
  const [localList, setLocalList] = useState([]); // 可选地址列表
  const [selectLocal, setSelectLocal] = useState(''); // 已选地址
  const [userList, setUserList] = useState(false); // 搜索的用户列表

  const { distanceFlag, parentUserType, parentUserId } = initialValues;
  useEffect(() => {
    if (initialValues.hittingMainId) {
      setRadioData({
        distanceFlagType: distanceFlag,
        parentUserTypes: parentUserType,
      });
      // parentUserType === 'merchant' ? fetchGetMre(parentUserId) : fetchGetUser(parentUserId);
    }
  }, []);

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 获取城市code
  const handleGetDistrictCode = (lnglat) => {
    fetch(`https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_KEY}&location=${lnglat}`).then(
      (res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log('高德搜索到的data', data);
            form.setFieldsValue({
              districtCode: data.regeocode.addressComponent.adcode,
            });
          });
        }
      },
    );
  };

  // 获取城市定位
  const onSearchAddress = debounce((address = '') => {
    if (!address) return;
    setFetching(true);
    fetch(`https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&keywords=${address}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            // console.log('高德搜索到的data', data);
            const list = data.pois;
            if (list.length === 0) message.warn('未查询到地址信息', 1.5);
            else if (address) {
              // console.log('高德搜索到的list', list);
              setLocalList(list);
            }
          });
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, 500);

  // 浮标事件
  const handleMarkerEvents = {
    dragend: (event) => {
      const { lnglat } = event;
      const latitude = parseFloat(lnglat.lat); // 维度
      const longitude = parseFloat(lnglat.lng); // 经度
      setLocation([longitude, latitude]);
    },
  };

  // 地图组件
  const amap = (
    <div key="map" style={{ height: 350, marginBottom: 24, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          zIndex: 11111,
          width: 400,
          left: '50%',
          top: 20,
          marginLeft: -200,
        }}
      >
        <Space>
          <Select
            showSearch
            dropdownMatchSelectWidth={false}
            placeholder="输入搜索"
            notFoundContent={
              fetching ? (
                <Spin size="small" />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
              )
            }
            onSearch={onSearchAddress}
            onChange={(val, option) => {
              console.log('onChange的val', val.split('+')[0].split(','));
              console.log('onChange的option', option);
              setLocation(val.split('+')[0].split(','));
              setSelectLocal(option.children[1].props.children);
            }}
            filterOption={false}
            style={{ width: 300 }}
          >
            {localList.map((d, i) => (
              <Select.Option key={i} value={`${d.location}+${i}`}>
                {i + 1 + '、' + ' ' + d.name}
                <div>{d.adname + d.address}</div>
              </Select.Option>
            ))}
          </Select>
          <Button onClick={() => setAmpShow(false)}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              if (!selectLocal && location.length === 0) {
                form.validateFields(['address']);
                return;
              }
              form.setFieldsValue({
                address: selectLocal,
                lat: location[1],
                lnt: location[0],
              });
              handleGetDistrictCode(location.join(','));
              setAmpShow(false);
            }}
          >
            确定
          </Button>
        </Space>
      </div>
      <Map
        amapkey={AMAP_KEY}
        zoom={19}
        center={location}
        doubleClickZoom={false}
        keyboardEnable={false}
        touchZoom={false}
      >
        <Marker clickable draggable position={location} events={handleMarkerEvents} />
      </Map>
    </div>
  );

  // 搜索店铺
  const fetchGetMre = debounce((content) => {
    if (!content.replace(/'/g, '') || content.replace(/'/g, '').length < 2) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        name: content.replace(/'/g, ''),
      },
    });
  }, 500);

  // 获取用户搜索
  const fetchGetUser = debounce((content) => {
    if (!content) return;
    dispatch({
      type: 'baseData/fetchGetUsersSearch',
      payload: {
        content,
      },
      callback: (useList) => {
        const list = useList.map((item) => ({
          name: `${item.username}`,
          value: item.userIdString,
          otherData: `${item.mobile} ${item.beanCode}`,
        }));
        setUserList(list);
      },
    });
  }, 500);

  // 信息
  const formItems = [
    {
      label: '主体名称',
      name: 'name',
      disabled: type === 'info',
    },
    {
      label: '主体类型',
      name: 'hittingMainType',
      type: 'select',
      select: MARK_CARD_MAIN_TYPE,
      rules: [{ required: false }],
      disabled: type === 'info',
    },
    {
      label: '主体说明',
      name: 'remark',
      type: 'textArea',
      maxLength: 50,
      rules: [{ required: false }],
      disabled: type === 'info',
    },
    {
      label: '主体地址',
      name: 'address',
      addonAfter: <a onClick={() => (type === 'info' ? '#' : setAmpShow(true))}>选地址</a>,
      placeholder: '请选择主体地址',
      disabled: type === 'info',
    },
    {
      type: 'noForm',
      visible: ampShow,
      formItem: amap,
      disabled: type === 'info',
    },
    {
      label: '纬度',
      name: 'lat',
      hidden: true,
      disabled: type === 'info',
    },
    {
      label: '经度',
      name: 'lnt',
      hidden: true,
      disabled: type === 'info',
    },
    {
      label: '区县',
      name: 'districtCode',
      hidden: true,
      disabled: type === 'info',
    },
    {
      label: '打卡范围',
      name: 'distanceFlag',
      type: 'radio',
      select: ['不限', '周围米数'],
      onChange: (e) => {
        saveSelectData({
          distanceFlagType: e.target.value,
        });
      },
      disabled: type === 'info',
    },
    {
      label: '打卡范围周围米数',
      name: 'range',
      type: 'number',
      min: 0,
      visible: radioData.distanceFlagType === '1',
      disabled: type === 'info',
    },
    {
      label: '家主',
      name: 'parentUserType',
      type: 'radio',
      select: MARK_CARD_PARENT_TYPE,
      rules: [{ required: false }],
      onChange: (e) => {
        saveSelectData({
          parentUserTypes: e.target.value,
        });
      },
      disabled: type === 'info',
    },
    {
      name: 'parentUserId',
      type: 'select',
      loading: loading.effects['baseData/fetchGetGroupMreList'],
      placeholder: '请输入店铺名称搜索',
      onSearch: fetchGetMre,
      style: { marginLeft: 150 },
      // onChange: (val, op) => {
      //   console.log(val, op);
      // },
      select: groupMreList,
      visible: radioData.parentUserTypes === 'merchant',
      disabled: type === 'info',
    },
    {
      name: 'parentUserId',
      type: 'select',
      loading: loading.effects['baseData/fetchGetGroupMreList'],
      placeholder: '请输入昵称、手机号或豆号',
      onSearch: fetchGetUser,
      style: { marginLeft: 150 },
      // onChange: (val, op) => {
      //   console.log(val, op);
      // },
      select: userList,
      visible: radioData.parentUserTypes === 'user',
      disabled: type === 'info',
    },
    {
      label: '启用状态',
      name: 'status',
      type: 'radio',
      select: MARK_CARD_OPEN_STATE,
      disabled: type === 'info',
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </>
  );
};

export default connect(({ baseData, loading }) => ({
  groupMreList: baseData.groupMreList,
  loading,
}))(PlatformSet);
