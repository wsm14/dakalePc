import { SearchOutlined } from '@ant-design/icons';
import aliOssUpload from '@/utils/aliOssUpload';

const AllocationSet = (props) => {
  const { dispatch, childRef, initialValues = {}, setVisibleSearch } = props;
  // 提交表单
  const fetchDataEdit = (values) => {
    const { domainImage = '' } = values;
    const editType = !initialValues.domainId;
    aliOssUpload(domainImage).then((res) => {
      dispatch({
        type: { true: 'expertSet/fetchExpertAdd', false: 'expertSet/fetchClassifyEdit' }[editType],
        payload: { ...initialValues, ...values, domainImage: res.toString() },
        callback: () => childRef.current.fetchGetData(),
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `${!initialValues.domainId ? '新增' : '修改'}`,
    loadingModels: 'expertSet',
    initialValues,
    formItems: [
      {
        label: `封面图片`,
        type: 'upload',
        name: 'domainImage',
        maxFile: 1,
      },
      {
        label: '跳转类型',
        name: 'domainName',
        type: 'select',
        select: [
          { value: 'h5', name: 'H5活动' },
          { value: 'navite', name: 'APP页面' },
        ],
      },
      {
        label: '跳转连接',
        name: 'domainNameShow',
        addonAfter: (
          <SearchOutlined
            onClick={() => setVisibleSearch({ visible: true, valueName: 'path', type: 'url' })}
          />
        ),
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default AllocationSet;
