import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { AMAP_KEY } from '@/common/constant';
import { Map, Marker } from 'react-amap';
import { Form, Button, Space, Select, Spin, Empty, message } from 'antd';
import FormComponents from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const TradeAreaSet = (props) => {
  const { info = {}, onSubmit, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const [ampShow, setAmpShow] = useState(false); // 地图是否显示
  const [location, setLocation] = useState([120, 30]); // 地图显示 [经度, 纬度]
  const [fetching, setFetching] = useState(false); // 查找地址等待状态
  const [localList, setLocalList] = useState([]); // 可选地址列表
  const [selectLocal, setSelectLocal] = useState(''); // 已选地址

  const { provinceName, cityName, districtName, lat, lnt } = info;

  // 修改时保存经纬度 地图回显使用
  useEffect(() => {
    lat && setLocation([lnt, lat]);
  }, [info]);

  // 新增 / 修改
  const handleUpdata = () => {
    form.validateFields().then((values) => {
      delete values.provinceCode;
      onSubmit({ ...info, ...values });
    });
  };

  // 获取城市定位
  const onSearchAddress = debounce((address = '') => {
    setFetching(true);
    fetch(
      `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&citylimit=true&city=${cityName}&keywords=${
        cityName + address
      }`,
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            const list = data.pois;
            if (list.length === 0) message.warn('未查询到地址信息', 1.5);
            else if (address) {
              setLocalList(list);
            } else {
              const geocodes = list[0].location.split(',');
              const longitude = parseFloat(geocodes[0]); // 经度
              const latitude = parseFloat(geocodes[1]); // 纬度
              setLocation([longitude, latitude]);
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
              setLocation(val.split(','));
              setSelectLocal(option.children[1].props.children);
            }}
            filterOption={false}
            style={{ width: 300 }}
          >
            {localList.map((d, i) => (
              <Select.Option key={d.location}>
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
                form.validateFields(['businessHubAddress']);
                return;
              }
              form.setFieldsValue({
                businessHubAddress: selectLocal,
                lat: location[1],
                lnt: location[0],
              });
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

  const formItems = [
    {
      label: '商圈所属',
      name: 'provinceCode',
      type: 'cascader',
      rules: [{ required: false }],
      disabled: true,
    },
    {
      label: '商圈名称',
      name: 'businessHubName',
    },
    {
      label: '商圈地址',
      name: 'businessHubAddress',
      addonAfter: <a onClick={() => setAmpShow(true)}>选地址</a>,
      placeholder: '请选择商圈地址',
    },
    {
      type: 'noForm',
      visible: ampShow,
      formItem: amap,
    },
    {
      label: '商圈经度',
      name: 'lat',
      placeholder: '请选择商圈地址',
      disabled: true,
    },
    {
      label: '商圈纬度',
      name: 'lnt',
      placeholder: '请选择商圈地址',
      disabled: true,
    },
    {
      label: '商圈半径',
      name: 'radius',
      suffix: '米',
      placeholder: '请输入商圈半径（米）',
      addRules: [{ pattern: /^\d+$/, message: '请输入数字' }],
    },
    {
      label: '启用状态',
      name: 'status',
      type: 'radio',
      select: ['停用', '启用'],
    },
  ];

  const modalProps = {
    title: `商圈设置 - ${provinceName} / ${cityName} / ${districtName}`,
    visible,
    onClose,
    afterCallBack: () => setAmpShow(false),
    footer: (
      <Button onClick={handleUpdata} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={info}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.tradeArea,
}))(TradeAreaSet);
