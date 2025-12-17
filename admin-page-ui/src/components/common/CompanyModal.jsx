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
      width={800}
      styles={{
        body: { maxHeight: '70vh', overflowY: 'auto' }
      }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="company_name"
              label={<span style={{ fontWeight: 500 }}>Company Name</span>}
              rules={[{ required: true, message: "Enter company name" }]}
            >
              <Input placeholder="e.g. Tech Innovators Inc." size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="contact_person"
              label={<span style={{ fontWeight: 500 }}>Contact Person</span>}
              rules={[{ required: true, message: "Enter contact person" }]}
            >
              <Input placeholder="e.g. John Smith" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
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
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label={<span style={{ fontWeight: 500 }}>Phone</span>}
              rules={[{ required: true, message: "Enter phone number" }]}
            >
              <Input placeholder="+1 (555) 123-4567" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label={<span style={{ fontWeight: 500 }}>Address</span>}
          rules={[{ required: true, message: "Enter address" }]}
        >
          <TextArea rows={2} placeholder="Company address..." />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="industry"
              label={<span style={{ fontWeight: 500 }}>Industry</span>}
              rules={[{ required: true, message: "Select industry" }]}
            >
              <Select placeholder="Select industry" size="large">
                {industryOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="website"
              label={<span style={{ fontWeight: 500 }}>Website</span>}
            >
              <Input placeholder="www.company.com" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="employee_count"
              label={<span style={{ fontWeight: 500 }}>Employee Count</span>}
              rules={[{ required: true, message: "Enter employee count" }]}
            >
              <InputNumber
                placeholder="0"
                size="large"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="subscription_plan"
              label={<span style={{ fontWeight: 500 }}>Subscription Plan</span>}
              rules={[{ required: true, message: "Select plan" }]}
            >
              <Select placeholder="Select plan" size="large">
                {subscriptionPlanOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="monthly_fee"
              label={<span style={{ fontWeight: 500 }}>Monthly Fee ($)</span>}
              rules={[{ required: true, message: "Enter monthly fee" }]}
            >
              <InputNumber
                placeholder="0"
                size="large"
                style={{ width: '100%' }}
                min={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CompanyModal;
