/*import React, { useState } from "react";
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
  Badge,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import JobRequirementsModal from "../components/common/JobRequirementsModal";
import { useJobRequirements } from "../hooks/useJobRequirements";
import { jobRequirementsAPI } from "../services/jobRequirementsService";

const { Search } = Input;

const JobRequirements = () => {
  const {
    jobRequirements,
    loading,
    pagination,
    fetchJobRequirements,
    createJobRequirement,
    deleteJobRequirement,
    updateJobRequirement,
    search,
    setSearch,
  } = useJobRequirements();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSearch = (value) => {
    setSearch(value);
    fetchJobRequirements(1, pagination.pageSize, value);
  };

  const handleView = async (id) => {
    const res = await jobRequirementsAPI.getById(id);
    setSelected(res.data);
    setViewModal(true);
  };

  const handleEdit = async (id) => {
    const res = await jobRequirementsAPI.getById(id);
    setEditData(res.data);
    setIsModalOpen(true);
  };

  // Calculate statistics
  const publishedCount = jobRequirements.filter(
    (job) => job.status === "PUBLISHED"
  ).length;
  const unpublishedCount = jobRequirements.filter(
    (job) => job.status === "UNPUBLISHED"
  ).length;

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
      title: "Job Details",
      dataIndex: "job_title",
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
            {record.job_title}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            {record.job_post}
          </div>
          <Space size={4} style={{ marginTop: '6px' }}>
            <Tag color="blue">{record.department}</Tag>
            <Tag color="purple">{record.employment_type}</Tag>
          </Space>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 150,
      render: (location) => (
        <Tag color="cyan" style={{ fontSize: '12px' }}>
          {location}
        </Tag>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience_required",
      width: 120,
      align: "center",
    },
    {
      title: "Published By",
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.published_by || "—"}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {record.job_publish_date
              ? dayjs(record.job_publish_date).format("MMM DD, YYYY")
              : "—"}
          </div>
        </div>
      ),
    },
    {
      title: "Application Deadline",
      dataIndex: "application_end_date",
      width: 150,
      align: "center",
      render: (val) => (
        <div>
          {val ? (
            <>
              <div style={{ fontWeight: 500 }}>
                {dayjs(val).format("MMM DD, YYYY")}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                {dayjs(val).diff(dayjs(), 'day')} days left
              </div>
            </>
          ) : (
            "—"
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <Tag
          color={status === "PUBLISHED" ? "success" : "default"}
          style={{ fontWeight: 500 }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      align: "center",
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
            title="Delete Job Requirement"
            description="Are you sure you want to delete this job requirement?"
            onConfirm={() => deleteJobRequirement(record.id)}
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
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Total Requirements</span>}
                value={pagination.total}
                prefix={<FileTextOutlined />}
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
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Published</span>}
                value={publishedCount}
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
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Unpublished</span>}
                value={unpublishedCount}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      
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
              Job Requirements
            </span>
          }
          extra={
            <Space>
              <Search
                placeholder="Search jobs..."
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
                Create Requirement
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
            dataSource={jobRequirements}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) =>
                fetchJobRequirements(page, pageSize, search),
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} requirements`,
            }}
            bordered
            scroll={{ x: 1200 }}
          />
        </Card>
      </motion.div>

      
      <JobRequirementsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) =>
          editData
            ? updateJobRequirement(editData.id, data)
            : createJobRequirement(data)
        }
        initialData={editData}
      />

      
      <Modal
        open={viewModal}
        title={
          <div style={{
            fontSize: '20px',
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif',
          }}>
            Job Requirement Details
          </div>
        }
        onCancel={() => setViewModal(false)}
        footer={null}
        width={800}
      >
        {selected && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Job Title" span={2}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>
                {selected.job_title}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Job Post" span={2}>
              {selected.job_post}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selected.description}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              <Tag color="blue">{selected.department}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              <Tag color="cyan">{selected.location}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Employment Type">
              <Tag color="purple">{selected.employment_type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Experience Required">
              {selected.experience_required}
            </Descriptions.Item>
            <Descriptions.Item label="Salary Range" span={2}>
              {selected.salary_range || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Skills Required" span={2}>
              <Space wrap>
                {selected.skills_required?.map((skill, index) => (
                  <Tag key={index} color="geekblue">
                    {skill}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Published By">
              {selected.published_by}
            </Descriptions.Item>
            <Descriptions.Item label="Publish Date">
              {selected.job_publish_date
                ? dayjs(selected.job_publish_date).format("MMMM DD, YYYY")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Application End Date">
              {selected.application_end_date
                ? dayjs(selected.application_end_date).format("MMMM DD, YYYY")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={selected.status === "PUBLISHED" ? "success" : "default"}
                style={{ fontWeight: 500 }}
              >
                {selected.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default JobRequirements;
*/
import React from 'react'

const JobRequirements = () => {
  return (
    <div>Coming Soon....</div>
  )
}

export default JobRequirements