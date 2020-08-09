import React, { useRef } from "react";
import { connect } from "dva";
import HandleSetTable from "@/components/HandleSetTable";
import DataTableBlock from "@/components/DataTableBlock";

const SysAppSet = (props) => {
  const { sysAppSet, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: "位置",
      name: "userMobile1",
      type: "select",
      select: { list: [1, 2] },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: "占位图",
      dataIndex: "userId",
    },
    {
      title: "图片说明",
      align: "center",
      dataIndex: "phoneNumber",
    },
    {
      title: "位置",
      align: "left",
      dataIndex: "orderCount",
    },
    {
      title: "跳转类型",
      align: "left",
      dataIndex: "orderTotal",
      render: (val) => `￥${val}`,
    },
    {
      title: "创建时间",
      align: "left",
      dataIndex: "orderTotal",
      render: (val) => `￥${val}`,
    },
    {
      title: "操作",
      dataIndex: "id",
      align: "center",
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: "edit",
              //   click: () => setShowCoach(record),
            },
            {
              type: "del",
              //   click: () => setShowCoach(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userId}`}
      dispatchType="sysAppSet/fetchAppUserList"
      {...sysAppSet}
    ></DataTableBlock>
  );
};

export default connect(({ sysAppSet, loading }) => ({
  sysAppSet,
  loading: loading.models.sysAppSet,
}))(SysAppSet);
