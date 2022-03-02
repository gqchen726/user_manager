import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
import './../css/EditableTable.css'
import {saveUser, removeUser} from './../features/user/userSlice'
import store from '../app/store';


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = (props) => {
  const [form] = Form.useForm();
  const {data} = props;
  const [editingKey, setEditingKey] = useState('');

  const {beEdited} = store.getState();

  const isEditing = (record) => record.key === beEdited;


  const columns = [
    {
        title: '编号',
        dataIndex: 'id',
        width: '25%',
        key: 'id',
        editable: false
    },
    {
        title: '用户名',
        dataIndex: 'username',
        width: '25%',
        key: 'username',
        editable: true
    },
    {
        title: '密码',
        dataIndex: 'password',
        width: '25%',
        key: 'password',
        editable: true
    },
    {
      title: '编辑',
      dataIndex: 'edit',
      render: (_, record) => {
        const editable = isEditing(record);
        console.log(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Typography.Link>
        );
      },
    },
    {
      title: '删除',
      dataIndex: 'delete',
      render: (_, record) => {
        const editable = isEditing(record);
        console.log(record)
        return (
          <Typography.Link disabled={editingKey !== ''} onClick={() => remove(record)}>
            删除
          </Typography.Link>
        )
      },
    },
    
  ]



  const edit = (record) => {
    form.setFieldsValue({
      username: '',
      password: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const remove = (record) => {
    store.dispatch(removeUser(record))
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        store.dispatch(saveUser(newData));
        setEditingKey('');
      } else {
        newData.push(row);
        store.dispatch(saveUser(newData));
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableTable;