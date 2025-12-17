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
  List,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import PlanModal from "../components/common/PlanModal";
import { usePlans } from "../hooks/usePlans";
import { plansAPI } from "../services/plansService";

const { Search } = Input;

const PlanManagement = () => {
  const {
    plans,
    loading,
    pagination,
    fetchPlans,
    createPlan,
    deletePlan,
    updatePlan,
    search,
    setSearch,
  } = usePlans();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSearch = (value) => {
    setSearch(value);
    fetchPlans(1, pagination.pageSize, value);
  };

  const handleView = async (id) => {
    const res = await plansAPI.getById(id);
    setSelected(res.data);
    setViewModal(true);
  };

  const handleEdit = async (id) => {
    const res = await plansAPI.getById(id);
    setEditData(res.data);
    setIsModalOpen(true);
  };

  // Calculate statistics
  const activePlans = plans.filter((plan) => plan.is_active).length;
  const totalRevenue = plans.reduce((sum, plan) => sum + plan.price, 0);

  // Plan colors
  const getPlanColor = (planName) => {
    const colors = {
      'Enterprise': 'purple',
      'Premium': 'blue',
      'Basic': 'orange',
      'Free': 'default',
    };
    return colors[planName] || 'default';
  };

  const columns = [
    {
      title: 'S/N',
      dataIndex: 'id',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Plan Details',
      dataIndex: 'plan_name',
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CrownOutlined style={{ color: '#667eea', fontSize: '16px' }} />
            <span style={{ fontWeight: 600, fontSize: '15px' }}>{record.plan_name}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: 130,
      align: 'center',
      render: (price, record) => (
        <div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#10b981' }}>
            ${price}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            /{record.billing_cycle.toLowerCase()}
          </div>
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Max Employees',
      dataIndex: 'max_employees',
      width: 130,
      align: 'center',
      render: (max) => (
        <Tag color={max === -1 ? 'purple' : 'blue'} style={{ fontWeight: 500 }}>
          {max === -1 ? 'Unlimited' : max}
        </Tag>
      ),
    },
    {
      title: 'Features',
      dataIndex: 'features',
      width: 100,
      align: 'center',
      render: (features) => (
        <Tag color="geekblue" style={{ fontWeight: 500 }}>
          {features?.length || 0} features
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      width: 100,
      align: 'center',
      render: (isActive) => (
        <Tag
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isActive ? 'success' : 'default'}
          style={{ fontWeight: 500 }}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
    },
    {
      title: 'Action',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
            style={{ borderRadius: '6px' }}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            type="primary"
            ghost
            style={{ borderRadius: '6px' }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Plan"
            description="Are you sure you want to delete this plan?"
            onConfirm={() => deletePlan(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              danger
              style={{ borderRadius: '6px' }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Total Plans</span>}
                value={plans.length}
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}
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
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
                border: 'none',
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Active Plans</span>}
                value={activePlans}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}
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
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
                border: 'none',
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Total Value</span>}
                value={totalRevenue}
                prefix="$"
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}
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
            <span style={{
              fontSize: '18px',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
            }}>
              Subscription Plans
            </span>
          }
          extra={
            <Space>
              <Search
                placeholder="Search plans..."
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
                size="large"
              >
                Create Plan
              </Button>
            </Space>
          }
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Table
            columns={columns}
            dataSource={plans}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) => fetchPlans(page, pageSize, search),
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} plans`,
            }}
            bordered
            scroll={{ x: 1000 }}
          />
        </Card>
      </motion.div>

      {/* Create/Edit Modal */}
      <PlanModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) =>
          editData ? updatePlan(editData.id, data) : createPlan(data)
        }
        initialData={editData}
      />

      {/* View Modal */}
      <Modal
        open={viewModal}
        title={
          <div style={{
            fontSize: '20px',
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif',
          }}>
            Plan Details
          </div>
        }
        onCancel={() => setViewModal(false)}
        footer={null}
        width={700}
      >
        {selected && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Plan Name" span={2}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CrownOutlined style={{ color: '#667eea', fontSize: '18px' }} />
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>
                    {selected.plan_name}
                  </span>
                  <Tag color={getPlanColor(selected.plan_name)}>
                    {selected.plan_name}
                  </Tag>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {selected.description}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                <span style={{ fontWeight: 600, fontSize: '18px', color: '#10b981' }}>
                  ${selected.price}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Billing Cycle">
                {selected.billing_cycle}
              </Descriptions.Item>
              <Descriptions.Item label="Max Employees">
                <Tag color={selected.max_employees === -1 ? 'purple' : 'blue'}>
                  {selected.max_employees === -1 ? 'Unlimited' : selected.max_employees}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  icon={selected.is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  color={selected.is_active ? 'success' : 'default'}
                >
                  {selected.is_active ? 'Active' : 'Inactive'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Features" span={2}>
                <List
                  size="small"
                  dataSource={selected.features}
                  renderItem={(item) => (
                    <List.Item>
                      <CheckCircleOutlined style={{ color: '#10b981', marginRight: '8px' }} />
                      {item}
                    </List.Item>
                  )}
                />
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PlanManagement;
