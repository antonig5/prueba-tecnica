"use client";
import React, { useState, useEffect, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Table, Space, Button, message, Modal, Form, Input } from "antd";
import "./page.module.css";

export default function Home() {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModaEdit, setIsModalEdit] = useState(false);
  const [selectedProyect, setSelectedProyect] = useState(null);
  const [editedProyect, setEditedProyect] = useState(null);
  const [dataEdit, setdataEdit] = useState(null);
  const [isNewProyectModalOpen, setIsNewProyectModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const showModal = () => {
    setIsModalEdit(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalEdit(false);
    setIsNewProyectModalOpen(false);
  };

  const showNewProyectModal = () => {
    setIsNewProyectModalOpen(true);
  };

  const handleCreateProyect = (values) => {
    fetch("http://localhost:8080/api/poyects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        message.success("Proyecto creado correctamente");
        setIsNewProyectModalOpen(false);
        GetProyects();
      })
      .catch((error) => {
        console.error("Error al crear proyecto:", error);
        message.error("Error al crear proyecto");
      });
  };

  const GetProyects = () => {
    fetch("http://localhost:8080/api/poyects")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error al obtener datos:", error));
  };

  useEffect(() => {
    GetProyects();
  }, []);
  const DeleteProyect = (id) => {
    fetch(`http://localhost:8080/api/poyects/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((r) => {
        if (r) {
          message.success("Eliminado correctamente");
        }
        GetProyects();
      });
  };
  const handleEdit = (values) => {
    console.log(values);
    fetch(`http://localhost:8080/api/poyects/${dataEdit._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        message.success("Proyecto editado correctamente");
        setSelectedProyect(null);
        setEditedProyect(null);
        GetProyects();
      })
      .catch((error) => {
        console.error("Error al editar proyecto:", error);
        message.error("Error al editar proyecto");
      });
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "system_id",
      key: "system_id",
    },
    {
      title: "Nombre",
      dataIndex: "system_name",
      key: "system_name",
      ...getColumnSearchProps("system_name"),
    },
    {
      title: "Generacion Actual",
      dataIndex: "current_generation",
      key: "current_generation",
    },
    {
      title: "Total",
      dataIndex: "total_generation",
      key: "total_generation",
    },
    {
      title: "Potencia Instalada",
      dataIndex: "installed_power",
      key: "installed_power",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setSelectedProyect(record);
              setIsModalOpen(true);
            }}
          >
            Ver
          </Button>
          <Button
            onClick={() => {
              setdataEdit(record);
              setIsModalEdit(true);
              form.setFieldsValue({ system_name: record.system_name });
              form.setFieldsValue({ location: record.location });
              form.setFieldsValue({ inverter_brand: record.inverter_brand });
              form.setFieldsValue({ panel_brand: record.panel_brand });
              form.setFieldsValue({ panel_power: record.panel_power });
              form.setFieldsValue({ panel_quantity: record.panel_quantity });
              form.setFieldsValue({ installed_power: record.installed_power });
              form.setFieldsValue({
                current_generation: record.current_generation,
              });
              form.setFieldsValue({
                total_generation: record.total_generation,
              });
            }}
          >
            Editar
          </Button>
          <Button onClick={() => DeleteProyect(record._id)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={showNewProyectModal}>
        Nuevo Proyecto
      </Button>

      <Modal
        title="Nuevo Proyecto"
        open={isNewProyectModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          onFinish={handleCreateProyect}
        >
          <Form.Item
            name="system_name"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="inverter_brand"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="panel_brand"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="panel_power"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="panel_quantity"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="installed_power"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="current_generation"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="total_generation"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Detalles del Proyecto"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedProyect && (
          <div>
            <p>ID: {selectedProyect.system_id}</p>
            <p>Nombre: {selectedProyect.system_name}</p>
            <p>Generación Actual: {selectedProyect.current_generation}</p>
            <p>Total: {selectedProyect.total_generation}</p>
            <p>Potencia Instalada: {selectedProyect.installed_power}</p>
          </div>
        )}
      </Modal>
      <Modal title="Editar Proyecto" open={isModaEdit} onCancel={handleCancel}>
        <Form form={form} name="edit" onFinish={handleEdit}>
          <Form.Item
            name="system_name"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="inverter_brand"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="panel_brand"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="panel_power"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="panel_quantity"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="installed_power"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="current_generation"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="total_generation"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la ubicación del proyecto",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </div>
    </>
  );
}
