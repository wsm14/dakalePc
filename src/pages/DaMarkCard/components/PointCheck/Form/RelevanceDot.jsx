import React, { useState } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { Button, Form, Select, Space } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import CommonList from '../components/CommonList';
import PointManageDrawer from '../../PointManage/PointManageDrawer';
import PointDrawer from '../../PointManage/Detail/Point/PointDrawer';
import '../components/index.less';
import { fetchHandleDetail } from '@/services/PublicServices';

const { Option } = Select;

const RelevanceDot = (props) => {
  const { bodyList = [], pointList = [], dispatch, visible = {}, onClose, cRef } = props;
  const { show = false } = visible;
  const [bodySelect, setBodySelect] = useState([]);//选中的主体
  const [pointSelect, setPointSelect] = useState([]);//选中的点位
  const [showPoint, setShowPoint] = useState(false);
  const [visibleBody, setVisibleBody] = useState(false);//新增主体
  const [visiblePoint, setVisiblePoint] = useState(false);//新增点位
  const [mainId, setMainId] = useState('');
  const [form] = Form.useForm();

  const modalProps = {
    title: '关联点位',
    visible: show,
  };

  // 搜索主体
  const handleSearch = debounce((activityName) => {
    if (!activityName.replace(/'/g, '')) return;
    dispatch({
      type: 'baseData/fetchGetGoodsSearch',
      payload: {
        activityName: activityName.replace(/'/g, ''),
      },
    });
  }, 500);

  // 搜索打卡点位
  const fetchGetMre = debounce((name) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchListHitting',
      payload: {
        mainId: '1498190607441383425',
        name,
      },
    });
  }, 500);

  //选中 option,替换
  const onChangeBody = (val, option) => {
    console.log(val, option, 'ooo');
    setMainId(val);
    setBodySelect(option);
  };
  const onChangePoint = (val) => {
    setMainId(val);
    const selectPoints = pointList.filter((item) => val.includes(item.value));
    console.log(selectPoints, 'selectPoints');

    setPointSelect(selectPoints);
  };

  //新增主体/点位
  const handleAdd = (type) => {
    const setVisibleAdd = {
      body: setVisibleBody,
      point: setVisiblePoint,
    }[type];
    setVisibleAdd({
      type: 'add',
      show: true,
    });
  };

  const formItems = [
    {
      label: `关联主体`,
      type: 'formItem',
      name: 'body',
      formItem: bodySelect?.length ? (
        bodySelect.map((mItem, mIndex) => (
          <div key={mItem.hittingMainId}>
            <CommonList
              item={{ name: mItem.name, address: mItem.address, id: mItem.hittingMainId }}
              onDel={() => bodySelect.splice(mIndex, 1)}
            ></CommonList>
          </div>
        ))
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            showSearch
            placeholder="输入主体名称/ID"
            optionFilterProp="children"
            onSearch={handleSearch}
            onChange={onChangeBody}
            maxTagTextLength={5}
          >
            {bodyList.map((item) => (
              <Option value={item.hittingMainId} key={item.hittingMainId}>
                <CommonList
                  item={{ name: item.name, address: item.address, id: item.hittingMainId }}
                ></CommonList>
              </Option>
            ))}
          </Select>
          <Button type="link" onClick={() => handleAdd('body')}>
            +新增
          </Button>
        </div>
      ),
    },
    {
      label: `关联点位`,
      type: 'formItem',
      name: 'dot',
      // visible: bodySelect.length > 0,
      formItem: (
        <>
          <Space>
            <Button onClick={() => setShowPoint(true)}>请选择点位</Button>
            <Button type="link" onClick={() => handleAdd('point')}>
              +新增
            </Button>
          </Space>
          {pointSelect?.length
            ? pointSelect.map((item1, index1) => (
                <div key={item1.value}>
                  <CommonList
                    item={{ name: item1.name, address: item1.otherData, id: item1.value }}
                    onDel={() =>
                      setPointSelect(pointSelect.filter((ids) => ids.value != item1.value))
                    }
                  ></CommonList>
                  <div className="bottomCon">
                    <span>每人每天打卡次数</span>
                    <span>1次</span>
                  </div>
                </div>
              ))
            : showPoint && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Select
                    showSearch
                    mode="multiple" //多选
                    placeholder="输入点位名称/ID"
                    optionFilterProp="children"
                    onSearch={fetchGetMre}
                    onChange={onChangePoint}
                    maxTagTextLength={5}
                    dropdownMatchSelectWidth={false}
                  >
                    {pointList.map((item2, index2) => (
                      <Option value={item2.value} key={item2.value} className="formSelect">
                        {/* <CommonList
                    item={{ name: item2.name, address: item2.otherData, id: item2.value }}
                  ></CommonList> */}
                        {`${item2.name}-${item2.value}\n${item2.otherData}`}
                      </Option>
                    ))}
                  </Select>
                  {/* <Button type="link">+新增</Button> */}
                </div>
              )}
        </>
      ),
    },
  ];

  return (
    <>
      <DrawerCondition {...modalProps}>
        <FormCondition formItems={formItems} form={form}></FormCondition>
      </DrawerCondition>
      {/* 主体 */}
      <PointManageDrawer
        childRef={cRef}
        visible={visibleBody}
        onClose={() => setVisibleBody(false)}
      ></PointManageDrawer>
      {/* 新增 点位*/}
      <PointDrawer
        childRef={cRef}
        visible={visiblePoint}
        onClose={() => setVisiblePoint(false)}
      ></PointDrawer>
    </>
  );
};
export default connect(({ baseData, loading }) => ({
  selectList: baseData.goodsList,
  pointList: baseData.pointList.list,
  loading: loading.effects['baseData/fetchGetGoodsSearch'],
}))(RelevanceDot);
