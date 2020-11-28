import React, {useImperativeHandle, useState} from "react";
import {connect} from 'umi'
import {message, Button} from "antd";
import FormCondition from "@/components/FormCondition";
import {AMAP_KEY} from "@/common/constant";
import {Map, Marker} from "react-amap";

const BaseForm = (props) => {
  const {
    tradeList,
    form,
    initialValues,
    cRef,
    groupDetails
  } = props

  const [map, setMap] = useState(false);
  const [location, setLocation] = useState([120, 30]); // [经度, 纬度]
  const [address, setAddress] = useState({
    disable: true,
    city: [],
    latlnt:[]
  }); // [经度, 纬度]
  const [categoryObj,setCategoryObj] = useState({})
  // 设置类目
  const onSearchAddress = () => {
    const addressData = form.getFieldValue('address');
    if(!addressData){
      message.info('请输入地址')
      return;
    }
    const city = address.city;
    let cityname = '';
      city.map((item) => {
        cityname += item.label;
        return true;
      });
    fetch(
      `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&city=${city[1].label}&keywords=${
        cityname + addressData
      }`,
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            const list = data.pois;
            if (list.length === 0) message.warn('未查询到地址信息', 1.5);
            else {
              const geocodes = list[0].location.split(',');
              const longitude = parseFloat(geocodes[0]); // 经度
              const latitude = parseFloat(geocodes[1]); // 纬度
              setLocation([longitude, latitude]);
              setAddress({
                ...address,
                latlnt: [longitude, latitude]
              })
              setMap(true)
            }
          });
        }
      })
      .finally(() => {
      });
  };
  useImperativeHandle(cRef, () => ({
    fetchAllData: () => {
      let cityList = address.city
      let cityObj = {}
      if(cityList.length > 0){
        cityObj = {
          provinceCode: cityList[0].value,
          provinceName: cityList[0].label,
          cityCode: cityList[1].value,
          cityName: cityList[1].label,
          districtCode: cityList[2].value,
          districtName: cityList[2].label,
        }
      }
      return {
        ...categoryObj,
        ...cityObj,
        lat:address.latlnt[0],
        lnt:address.latlnt[1],
      }
    },
  }));
  // 地图浮标移动定位
  const handleMarkerEvents = {
    dragend: (event) => {
      const {lnglat} = event;
      const latitude = parseFloat(lnglat.lat); // 维度
      const longitude = parseFloat(lnglat.lng); // 经度
      setLocation([longitude, latitude]);
    },
  };

  const amap = (
    <div style={{height: 240, marginBottom: 24, position: 'relative'}}>
      <Map
        amapkey={AMAP_KEY}
        zoom={19}
        center={location}
        doubleClickZoom={false}
        keyboardEnable={false}
        touchZoom={false}
      >
        <Marker clickable draggable position={location} events={handleMarkerEvents}/>
      </Map>
      <Button onClick={() =>{setAddress({
        ...address,
        disable: true,
        latlnt:location
      }),message.success('保存新地址成功', 1.5),setMap(false)}} style={{position: 'absolute', top: 20, right: 20}}>确定</Button>
    </div>
  );
  console.log(initialValues)
  const formItems = [
    {
      label: '集团名称',
      name: 'groupName',
    },
    {
      label: '经营类目',
      type: 'cascader',
      name: 'topCategSelect',
      select: tradeList.filter((i) => i.categoryDTOList),
      fieldNames: {label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList'},
      onChange: (val) => {
        const {categoryDTOList,categoryIdString,categoryName,parentId} = val[0]
        setCategoryObj(
          {
            categoryId: categoryIdString,
            categoryName,
            topCategoryId: val[1].categoryIdString,
            topCategoryName: val[1].categoryName,
            categoryNode: categoryIdString + '.' + val[1].categoryIdString
          }
        )
        // form.setFieldsValue({
        //   categoryName: val,
        //   businessArea: undefined,
        //   commissionRatio: undefined,
        // });
      }
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'provinceCode',
      visible: Object.keys(groupDetails).length !== 0 ? false : true,
      onChange: (val) => {setAddress({...address, disable: false, city:val})}
    },
    {
      label: '详细地址',
      name: 'address',
      addonAfter: <a onClick={onSearchAddress}>查询</a>
    },
    {
      type: 'noForm',
      visible: map,
      childrenOwn: amap,
    },
    {
      label: '服务费比例',
      name: 'commissionRatio',
      disabled: Object.keys(groupDetails).length === 0 ? false : true,
    },
  ];


  return (
    <FormCondition formItems={formItems} form={form} initialValues={initialValues}/>
  )
}

export default connect(({sysTradeList,groupSet}) => ({
  tradeList: sysTradeList.list.list,
  ...groupSet
}))(BaseForm)
