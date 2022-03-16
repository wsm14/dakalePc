import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { Button, Form, Space, Modal, notification } from 'antd';
import FormCondition from '@/components/FormCondition';
import { Select } from '@/components/FormCondition/formModule';
import DrawerCondition from '@/components/DrawerCondition';
import CommonList from '../components/CommonList';
import ExtraButton from '@/components/ExtraButton';
import PointManageDrawer from '../../PointManage/PointManageDrawer';
import PointDrawer from '../../PointManage/Detail/Point/PointDrawer';
import '../components/index.less';

const RelevanceDot = (props) => {
  const { bodyList = [], pointList = [], dispatch, visible = {}, onClose, onCloseF, cRef } = props;
  const { show = false, hittingAuditId = '' } = visible;
  const [bodySelect, setBodySelect] = useState([]); //选中的主体
  const [pointSelect, setPointSelect] = useState([]); //选中的点位
  const [showPoint, setShowPoint] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [visiblePoint, setVisiblePoint] = useState(false); //新增点位
  const [visibleSet, setVisibleSet] = useState(false); //主体奖励配置，首刷广告，新增
  const [bodyId, setBodyId] = useState(''); //单选 选中的主体id
  const [PointID, setPointID] = useState(''); //多选选中平的点位Id
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ body: bodySelect });
    const ids = bodySelect.map((itemid) => itemid.value);
    setBodyId(ids?.toString());
     //获取点位列表
     getPoint(ids?.toString());
    //切换主体清空点位选中内容
    setPointSelect([]);
    setPointID('');
    form.setFieldsValue({ hittingId: '' });
   
  }, [bodySelect]);

  useEffect(() => {
    const idH = pointSelect.map((itemH) => itemH.value);
    form.setFieldsValue({ hittingId: idH });
  }, [pointSelect]);

    // 搜索主体
    const handleSearch = debounce((name) => {
      if (!name.replace(/'/g, '')) return;
      dispatch({
        type: 'baseData/fetchListHittingMain',
        payload: {
          name: name?.replace(/'/g, ''),
        },
      });
    }, 500);

  // // 搜索主体
  // const handleSearch = debounce((name) => {
  //   if (!name.replace(/'/g, '')) return;
  //   dispatch({
  //     type: 'pointManage/fetchGetList',
  //     payload: {
  //       name: name.replace(/'/g, ''),
  //       page: 1,
  //       limit: 999,
  //     },
  //   });
  // }, 500);

  const getPoint = debounce((mainId, name) => {
    dispatch({
      type: 'baseData/fetchListHitting',
      payload: {
        mainId,
        name,
      },
    });
  }, 500);

  // 搜索打卡点位根据选中的主体获取点位列表
  const fetchGetMre = debounce((name) => {
    if (!name) return;
    getPoint(bodyId, name);
  }, 500);

  //选中 option,替换
  const onChangeBody = (val) => {
    const selectBodys = bodyList.filter((item) => val === item.value);
    setBodyId(val);
    setBodySelect(selectBodys);
    form.setFieldsValue({ body: selectBodys });
    //切换后点位列表清空
    setPointSelect([]);
    form.setFieldsValue({ hittingId: '' });
    setPointID('');
    setShowBody(false);
    getPoint(val);
  };
  const onChangePoint = (val) => {
    const selectPoints = pointList.filter((item) => val === item.value);
    setPointSelect(selectPoints);
    form.setFieldsValue({ hittingId: val });
    setPointID(val);
    setShowPoint(false);
  };

  // 获取主体详情
  const fetchCouponDetail = (hittingMainId, type) => {
    if (type === 'award') {
      //点击奖励按钮，判断是否该主体是否已关联点位，
      dispatch({
        type: 'pointManage/fetchGetHasHitting',
        payload: {
          hittingMainId,
        },
        callback: (hasHitting) => {
          if (hasHitting === '1') {
            dispatch({
              type: 'pointManage/fetchGetHittingRewardByMainId',
              payload: {
                hittingMainId,
              },
              callback: (detail) => {
                setVisibleSet({ type, show: true, detail, hittingMainId });
              },
            });
          } else {
            notification.warning({
              message: '温馨提示',
              description: '请先关联点位',
            });
            return;
          }
        },
      });
    } else {
      dispatch({
        type:
          type === 'advert'
            ? 'pointManage/fetchGetStrapContent'
            : 'pointManage/fetchGetHittingMainById',
        payload: {
          hittingMainId,
        },
        callback: (detail) => {
          setVisibleSet({ type, show: true, detail, hittingMainId });
        },
      });
    }
  };

  const formItems = [
    {
      label: `关联主体`,
      type: 'formItem',
      name: 'body',
      rules: [{ required: true }],
      formItem: (
        <>
          <Space>
            <Button
              onClick={() => {
                setShowBody(true);
              }}
            >
              请选择主体
            </Button>
            <Button
              type="link"
              onClick={() => setVisibleSet({ type: 'add', show: true, setBodySelect })}
            >
              +新增
            </Button>
          </Space>
          {showBody && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
              <Select
                placeholder="输入主体名称/ID"
                onSearch={handleSearch}
                onChange={onChangeBody}
                maxTagTextLength={5}
                value={bodyId}
                // fieldNames={{ label: 'name', value: 'hittingMainId', tip: 'address' }}
                select={bodyList}
              ></Select>
            </div>
          )}
          {bodySelect.map((mItem) => (
            <div key={mItem.value} style={{ marginTop: 10 }}>
              <CommonList
                item={{ name: mItem.name, address: mItem.otherData, id: mItem.value }}
                onDel={() => {
                  setBodySelect([]);
                  form.setFieldsValue({ body: '' });
                  setBodyId('');
                }}
              ></CommonList>
              <Space className="bottomCon">
                <Button type="link" onClick={() => fetchCouponDetail(mItem.value, 'award')}>
                  +奖励配置
                </Button>
                <Button
                  type="link"
                  onClick={() => fetchCouponDetail(mItem.value, 'advert')}
                >
                  +首刷广告
                </Button>
              </Space>
            </div>
          ))}
        </>
      ),
    },
    {
      label: `关联点位`,
      type: 'formItem',
      name: 'hittingId',
      visible: bodyId?.length > 0,
      rules: [{ required: true }],
      formItem: (
        <>
          <Space>
            <Button
              onClick={() => {
                setShowPoint(true);
              }}
            >
              请选择点位
            </Button>
            <Button
              type="link"
              onClick={() =>
                setVisiblePoint({
                  type: 'add',
                  show: true,
                  setPointSelect,
                  detail: { mainId: bodyId },
                })
              }
            >
              +新增
            </Button>
          </Space>
          {showPoint && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
              <Select
                placeholder="输入点位名称/ID"
                onSearch={fetchGetMre}
                onChange={onChangePoint}
                maxTagTextLength={5}
                value={PointID}
                select={pointList}
              ></Select>
            </div>
          )}
          {pointSelect.map((item1, index1) => (
            <div key={item1.value} style={{ marginTop: 10 }}>
              <CommonList
                item={{ name: item1.name, address: item1.otherData, id: item1.value }}
                onDel={() => {
                  setPointSelect([]);
                  setPointID('');
                  form.setFieldsValue({ hittingId: '' });
                }}
              ></CommonList>
              <div className="bottomCon">
                <span>每人每天打卡次数</span>
                <span>{item1.dayCount == '999' ? '不限' : item1.dayCount}次</span>
              </div>
            </div>
          ))}
        </>
      ),
    },
  ];

  //审核通过
  const handleCheck = () => {
    form.validateFields().then((values) => {
      Modal.confirm({
        okText: '确定',
        cancelText: '取消',
        content: '审核通过后主体和点位则绑定成功且不可更改，确定审核通过吗?',
        onOk: () => {
          dispatch({
            type: 'pointCheck/fetchGetVerifyAudit',
            payload: { hittingAuditId, hittingId: values.hittingId[0], verifyStatus: 1 },
            callback: () => {
              onClose();
              onCloseF();
              cRef.current.fetchGetData();
            },
          });
        },
      });
    });
  };

  const btnList = [
    {
      auth: 'check',
      onClick: handleCheck,
      text: '审核通过',
    },
  ];

  const modalProps = {
    title: '关联点位',
    visible: show,
    onClose,
    destroyOnClose: true,
    afterCallBack: () => {
      setBodyId('');
      setBodySelect([]);
    },
    footer: <ExtraButton list={btnList}></ExtraButton>,
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <FormCondition formItems={formItems} form={form}></FormCondition>
      </DrawerCondition>
      {/* 新增 编辑 详情 广告 奖励*/}
      <PointManageDrawer
        childRef={cRef}
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
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
export default connect(({ baseData, loading, pointManage }) => ({
  selectList: baseData.goodsList,
  pointList: baseData.pointList.list,
  // bodyList: pointManage.list.list,
  bodyList: baseData.bodyList.list,
  loading: loading.effects['baseData/fetchGetGoodsSearch'],
}))(RelevanceDot);
