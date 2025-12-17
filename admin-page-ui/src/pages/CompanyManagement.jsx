import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Descriptions,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Dropdown,
  Menu,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import CompanyModal from "../components/common/CompanyModal";
import { useCompanies } from "../hooks/useCompanies";
import { companiesAPI } from "../services/companiesService";

const { Search } = Input;

const CompanyManagement = () => {
  const {
    companies,
    loading,
    pagination,
    fetchCompanies,
    createCompany,
    updateCompany,
    approveCompany,
    disapproveCompany,
    suspendCompany,
    deleteCompany,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = useCompanies();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSearch = (value) => {
    setSearch(value);
    fetchCompanies(1, pagination.pageSize, value, statusFilter);
  };

  const handleView = async (id) => {
    const res = await companiesAPI.getById(id);
    setSelected(res.data);
    setViewModal(true);
  };

  const handleEdit = async (id) => {
    const res = await companiesAPI.getById(id);
    setEditData(res.data);
    setIsModalOpen(true);
  };

  // Calculate statistics
  const activeCompanies = companies.filter((c) => c.status === "Active").length;
  const pendingCompanies = companies.filter((c) => c.status === "Pending").length;
  const totalRevenue = companies
    .filter((c) => c.status === "Active")
    .reduce((sum, c) => sum + c.monthly_fee, 0);

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      Active: "success",
      Pending: "warning",
      Suspended: "error",
    };
    return colors[status] || "default";
  };

  const getPlanColor = (plan) => {
    const colors = {
      Enterprise: "purple",
      Premium: "blue",
      Basic: "orange",
      Free: "default",
    };
    return colors[plan] || "default";
  };

  // Action menu for each row
  const getActionMenu = (record) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<EyeOutlined />}
        onClick={() => handleView(record.id)}
      >
        View Details
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(record.id)}
      >
        Edit
      </Menu.Item>
      <Menu.Divider />
      {record.status !== "Active" && (
        <Menu.Item
          key="approve"
          icon={<CheckCircleOutlined />}
          onClick={() => approveCompany(record.id)}
        >
          Approve
        </Menu.Item>
      )}
      {record.status === "Active" && (
        <Menu.Item
          key="disapprove"
          icon={<CloseCircleOutlined />}
          onClick={() => disapproveCompany(record.id)}
        >
          Disapprove
        </Menu.Item>
      )}
      {record.status !== "Suspended" && (
        <Menu.Item
          key="suspend"
          icon={<StopOutlined />}
          onClick={() => suspendCompany(record.id)}
          danger
        >
          Suspend
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => {
          Modal.confirm({
            title: "Delete Company",
            content: `Are you sure you want to delete ${record.company_name}?`,
            okText: "Yes, Delete",
            okType: "danger",
            onOk: () => deleteCompany(record.id),
          });
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "S/N",
      dataIndex: "id",
      width: 70,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Company Details",
      dataIndex: "company_name",
      width: 280,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>
            {record.company_name}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            {record.contact_person} • {record.email}
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
            {record.industry}
          </div>
        </div>
      ),
    },
    {
      title: "Employees",
      dataIndex: "employee_count",
      width: 100,
      align: "center",
      render: (count) => (
        <div style={{ fontWeight: 600, fontSize: "16px", color: "#667eea" }}>
          {count}
        </div>
      ),
      sorter: (a, b) => a.employee_count - b.employee_count,
    },
    {
      title: "Plan",
      dataIndex: "subscription_plan",
      width: 120,
      align: "center",
      render: (plan) => (
        <Tag color={getPlanColor(plan)} style={{ fontWeight: 500 }}>
          {plan}
        </Tag>
      ),
      filters: [
        { text: "Enterprise", value: "Enterprise" },
        { text: "Premium", value: "Premium" },
        { text: "Basic", value: "Basic" },
        { text: "Free", value: "Free" },
      ],
      onFilter: (value, record) => record.subscription_plan === value,
    },
    {
      title: "Monthly Fee",
      dataIndex: "monthly_fee",
      width: 120,
      align: "center",
      render: (fee) => (
        <span style={{ fontWeight: 600, color: "#10b981" }}>
          ${fee.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.monthly_fee - b.monthly_fee,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 500 }}>
          {status}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "Active" },
        { text: "Pending", value: "Pending" },
        { text: "Suspended", value: "Suspended" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Registered",
      dataIndex: "registration_date",
      width: 120,
      align: "center",
      render: (date) =>
        dayjs(date).format("MMM DD, YYYY"),
      sorter: (a, b) => new Date(a.registration_date) - new Date(b.registration_date),
    },
    {
      title: "Action",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Dropdown overlay={getActionMenu(record)} trigger={["click"]}>
          <Button
            icon={<MoreOutlined />}
            style={{ borderRadius: "6px" }}
          >
            Actions
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                    Total Companies
                  </span>
                }
                value={companies.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#fff", fontSize: "32px", fontWeight: 700 }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
                border: "none",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                    Active
                  </span>
                }
                value={activeCompanies}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#fff", fontSize: "32px", fontWeight: 700 }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
                border: "none",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                    Monthly Revenue
                  </span>
                }
                value={totalRevenue}
                prefix="$"
                valueStyle={{ color: "#fff", fontSize: "32px", fontWeight: 700 }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card
          title={
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Company Details (Customers)
            </span>
          }
          extra={
            <Space>
              <Search
                placeholder="Search companies..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 250 }}
                prefix={<SearchOutlined />}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditData(null);
                  setIsModalOpen(true);
                }}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                }}
                size="large"
              >
                Add Company
              </Button>
            </Space>
          }
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table
            columns={columns}
            dataSource={companies}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) =>
                fetchCompanies(page, pageSize, search, statusFilter),
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} companies`,
            }}
            bordered
            scroll={{ x: 1200 }}
          />
        </Card>
      </motion.div>

      {/* Add/Edit Modal */}
      <CompanyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) =>
          editData ? updateCompany(editData.id, data) : createCompany(data)
        }
        initialData={editData}
      />

      {/* View Details Modal */}
      <Modal
        open={viewModal}
        title={
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Company Details
          </div>
        }
        onCancel={() => setViewModal(false)}
        footer={null}
        width={800}
      >
        {selected && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Company Name" span={2}>
              <span style={{ fontWeight: 600, fontSize: "16px" }}>
                {selected.company_name}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Contact Person">
              {selected.contact_person}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selected.phone}</Descriptions.Item>
            <Descriptions.Item label="Industry">
              <Tag color="blue">{selected.industry}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {selected.address}
            </Descriptions.Item>
            <Descriptions.Item label="Website" span={2}>
              <a href={`https://${selected.website}`} target="_blank" rel="noopener noreferrer">
                {selected.website}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Employee Count">
              <span style={{ fontWeight: 600, color: "#667eea" }}>
                {selected.employee_count}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Subscription Plan">
              <Tag color={getPlanColor(selected.subscription_plan)}>
                {selected.subscription_plan}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Monthly Fee">
              <span style={{ fontWeight: 600, color: "#10b981" }}>
                ${selected.monthly_fee.toLocaleString()}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selected.status)} style={{ fontWeight: 500 }}>
                {selected.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Registration Date">
              {dayjs(selected.registration_date).format("MMMM DD, YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Last Login">
              {selected.last_login
                ? dayjs(selected.last_login).format("MMMM DD, YYYY")
                : "Never"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CompanyManagement;
