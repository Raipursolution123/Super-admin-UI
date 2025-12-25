import React, { useState } from 'react';
import { Row, Col, Card, Table, Tag, Button, Space, Modal, Form, Select, Descriptions, Image } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  PaperClipOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import StatCard from '../components/dashboard/StatCard';
import { useTickets } from '../hooks/useTickets';

const SupportTickets = () => {
  const { tickets, loading, stats, updateStatus } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [form] = Form.useForm();

  const handleUpdateClick = (record) => {
    setSelectedTicket(record);
    form.setFieldsValue({ status: record.status });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const success = await updateStatus(selectedTicket.id, values.status);
    if (success) {
      handleModalCancel();
    }
  };

  const statusCards = [
    {
      title: 'Total Tickets Raised',
      value: stats.total,
      icon: <FileTextOutlined />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      delay: 0,
    },
    {
      title: 'Total Request Solved',
      value: stats.solved,
      icon: <CheckCircleOutlined />,
      gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
      delay: 0.1,
    },
    {
      title: 'Total Requests Pending',
      value: stats.pending,
      icon: <ClockCircleOutlined />,
      gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
      delay: 0.2,
    },
  ];

  const columns = [
    {
      title: 'S/L',
      key: 'serial',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Raised Date',
      dataIndex: 'raised_date',
      key: 'raised_date',
      width: 120,
    },
    {
      title: 'Issue Title',
      dataIndex: 'problem_title',
      key: 'problem_title',
      width: 180,
    },
    {
      title: 'Description',
      dataIndex: 'problem_description',
      key: 'problem_description',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Query',
      dataIndex: 'problem_query',
      key: 'problem_query',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Attachments',
      dataIndex: 'attachments',
      key: 'attachments',
      width: 120,
      render: (attachments) => (
        <Space>
          {attachments?.length > 0 ? (
            attachments.map((file, index) => (
              <Image
                key={index}
                width={30}
                src={file.url || file}
                placeholder={true}
                fallback="https://via.placeholder.com/30?text=File"
              />
            ))
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>No files</span>
          )}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => (
        <Tag color={status === 'Solved' ? 'success' : 'processing'} style={{ borderRadius: '4px', fontWeight: 500 }}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleUpdateClick(record)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          View & Update
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '0px' }}>
      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statusCards.map((card, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <StatCard {...card} />
          </Col>
        ))}
      </Row>

      {/* Tickets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card
          title={
            <span style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
              Support Ticket Management
            </span>
          }
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }}
        >
          <Table
            columns={columns}
            dataSource={tickets}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} tickets`,
              showSizeChanger: true,
            }}
            scroll={{ x: 1500 }}
            bordered
          />
        </Card>
      </motion.div>

      {/* Update Status Modal */}
      <Modal
        title="Update Ticket Status"
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={700}
        centered
        style={{ borderRadius: '12px' }}
      >
        {selectedTicket && (
          <div style={{ padding: '10px' }}>
            <Descriptions title="Ticket Details" bordered column={1} size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="Requested By">{selectedTicket.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedTicket.email}</Descriptions.Item>
              <Descriptions.Item label="Raised Date">{selectedTicket.raised_date}</Descriptions.Item>
              <Descriptions.Item label="Problem Title">{selectedTicket.problem_title}</Descriptions.Item>
              <Descriptions.Item label="Problem Description">{selectedTicket.problem_description}</Descriptions.Item>
              <Descriptions.Item label="Problem Query">{selectedTicket.problem_query}</Descriptions.Item>
              <Descriptions.Item label="Attachments">
                {selectedTicket.attachments?.length > 0 ? (
                  <Space wrap>
                    {selectedTicket.attachments.map((file, index) => (
                      <Image
                        key={index}
                        width={100}
                        src={file.url || file}
                        fallback="https://via.placeholder.com/100?text=Attachment"
                      />
                    ))}
                  </Space>
                ) : 'No Attachments'}
              </Descriptions.Item>
            </Descriptions>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ status: selectedTicket.status }}
            >
              <Form.Item
                name="status"
                label={<span style={{ fontWeight: 600 }}>Update Status</span>}
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select size="large">
                  <Select.Option value="In Progress">In Progress</Select.Option>
                  <Select.Option value="Solved">Solved</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button onClick={handleModalCancel} size="large">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      padding: '0 40px',
                      borderRadius: '8px'
                    }}
                  >
                    Save Changes
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportTickets;