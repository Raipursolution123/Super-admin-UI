import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col, Tag } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const { TextArea } = Input;
const { Option } = Select;

const statusOptions = [
  { label: "Published", value: "PUBLISHED", color: "#10b981" },
  { label: "Unpublished", value: "UNPUBLISHED", color: "#6b7280" },
];

const publishedByOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Super Admin", value: "Super Admin" },
];

const departmentOptions = [
  { label: "Engineering", value: "Engineering" },
  { label: "Design", value: "Design" },
  { label: "Marketing", value: "Marketing" },
  { label: "Sales", value: "Sales" },
  { label: "HR", value: "HR" },
  { label: "Operations", value: "Operations" },
];

const employmentTypeOptions = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
];

const locationOptions = [
  { label: "Remote", value: "Remote" },
  { label: "New York, NY", value: "New York, NY" },
  { label: "San Francisco, CA", value: "San Francisco, CA" },
  { label: "London, UK", value: "London, UK" },
  { label: "Bangalore, India", value: "Bangalore, India" },
];

const JobRequirementsModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        job_title: initialData.job_title,
        job_post: initialData.job_post,
        description: initialData.description,
        status: initialData.status,
        published_by: initialData.published_by,
        department: initialData.department,
        location: initialData.location,
        employment_type: initialData.employment_type,
        experience_required: initialData.experience_required,
        salary_range: initialData.salary_range,
        skills_required: initialData.skills_required,
        job_publish_date: initialData.job_publish_date
          ? dayjs(initialData.job_publish_date)
          : null,
        application_end_date: initialData.application_end_date
          ? dayjs(initialData.application_end_date)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        job_title: values.job_title,
        job_post: values.job_post,
        description: values.description,
        status: values.status,
        published_by: values.published_by,
        department: values.department,
        location: values.location,
        employment_type: values.employment_type,
        experience_required: values.experience_required,
        salary_range: values.salary_range,
        skills_required: values.skills_required || [],
        job_publish_date: values.job_publish_date
          ? dayjs(values.job_publish_date).format("YYYY-MM-DD")
          : null,
        application_end_date: values.application_end_date
          ? dayjs(values.application_end_date).format("YYYY-MM-DD")
          : null,
      };
      setSaving(true);
      await onSubmit(payload);
      onClose();
      form.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'Poppins, sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {initialData ? "Edit Job Requirement" : "Create Job Requirement"}
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleFinish}
      okText="Save"
      confirmLoading={saving}
      destroyOnClose
      width={800}
      styles={{
        body: { maxHeight: '70vh', overflowY: 'auto' }
      }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="job_title"
              label={<span style={{ fontWeight: 500 }}>Job Title</span>}
              rules={[{ required: true, message: "Enter job title" }]}
            >
              <Input placeholder="e.g. Senior Frontend Developer" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="job_post"
              label={<span style={{ fontWeight: 500 }}>Job Post</span>}
              rules={[{ required: true, message: "Enter job post" }]}
            >
              <Input placeholder="e.g. Frontend Development" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={<span style={{ fontWeight: 500 }}>Description</span>}
          rules={[{ required: true, message: "Enter description" }]}
        >
          <TextArea rows={4} placeholder="Enter detailed job description..." />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="department"
              label={<span style={{ fontWeight: 500 }}>Department</span>}
              rules={[{ required: true, message: "Select department" }]}
            >
              <Select placeholder="Select department" size="large">
                {departmentOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="location"
              label={<span style={{ fontWeight: 500 }}>Location</span>}
              rules={[{ required: true, message: "Select location" }]}
            >
              <Select placeholder="Select location" size="large">
                {locationOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="employment_type"
              label={<span style={{ fontWeight: 500 }}>Employment Type</span>}
              rules={[{ required: true, message: "Select employment type" }]}
            >
              <Select placeholder="Select employment type" size="large">
                {employmentTypeOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="experience_required"
              label={<span style={{ fontWeight: 500 }}>Experience Required</span>}
              rules={[{ required: true, message: "Enter experience required" }]}
            >
              <Input placeholder="e.g. 3+ years" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="salary_range"
              label={<span style={{ fontWeight: 500 }}>Salary Range</span>}
            >
              <Input placeholder="e.g. $80,000 - $120,000" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="skills_required"
              label={<span style={{ fontWeight: 500 }}>Skills Required</span>}
            >
              <Select
                mode="tags"
                placeholder="Add skills (press Enter)"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="published_by"
              label={<span style={{ fontWeight: 500 }}>Published By</span>}
              rules={[{ required: true, message: "Select publisher" }]}
            >
              <Select placeholder="Select publisher" size="large">
                {publishedByOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={<span style={{ fontWeight: 500 }}>Status</span>}
              rules={[{ required: true, message: "Select status" }]}
            >
              <Select placeholder="Select status" size="large">
                {statusOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    <Tag color={opt.color}>{opt.label}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="job_publish_date"
              label={<span style={{ fontWeight: 500 }}>Publish Date</span>}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="application_end_date"
              label={<span style={{ fontWeight: 500 }}>Application End Date</span>}
              rules={[{ required: true, message: "Select end date" }]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default JobRequirementsModal;
