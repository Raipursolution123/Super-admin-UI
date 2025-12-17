import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Row, Col, InputNumber } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const subscriptionPlanOptions = [
  { label: "Free", value: "Free" },
  { label: "Basic", value: "Basic" },
  { label: "Premium", value: "Premium" },
  { label: "Enterprise", value: "Enterprise" },
];

const industryOptions = [
  { label: "Technology", value: "Technology" },
  { label: "Finance", value: "Finance" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Retail", value: "Retail" },
  { label: "E-commerce", value: "E-commerce" },
  { label: "Marketing", value: "Marketing" },
  { label: "Education", value: "Education" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Other", value: "Other" },
];

const CompanyModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        company_name: initialData.company_name,
        contact_person: initialData.contact_person,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
        employee_count: initialData.employee_count,
        subscription_plan: initialData.subscription_plan,
        monthly_fee: initialData.monthly_fee,
        industry: initialData.industry,
        website: initialData.website,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await onSubmit(values);
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
          {initialData ? "Edit Company" : "Add New Company"}
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleFinish}
      okText="Save"
      confirmLoading={saving}
      destroyOnClose
      width={600}
      styles={{
        body: { maxHeight: '70vh', overflowY: 'auto' }
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="company_name"
          label={<span style={{ fontWeight: 500 }}>Company Name</span>}
          rules={[{ required: true, message: "Enter company name" }]}
        >
          <Input placeholder="e.g. Tech Innovators Inc." size="large" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="first_name"
              label={<span style={{ fontWeight: 500 }}>First Name</span>}
              rules={[{ required: true, message: "Enter first name" }]}
            >
              <Input placeholder="e.g. John" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="last_name"
              label={<span style={{ fontWeight: 500 }}>Last Name</span>}
              rules={[{ required: true, message: "Enter last name" }]}
            >
              <Input placeholder="e.g. Smith" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label={<span style={{ fontWeight: 500 }}>Email</span>}
          rules={[
            { required: true, message: "Enter email" },
            { type: "email", message: "Enter valid email" }
          ]}
        >
          <Input placeholder="admin@company.com" size="large" />
        </Form.Item>

        {!initialData && (
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 500 }}>Temporary Password</span>}
            rules={[{ required: true, message: "Enter temporary password" }]}
          >
            <Input.Password placeholder="Enter password" size="large" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CompanyModal;
