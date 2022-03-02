import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
import React, { useState } from 'react';
import { addUser, saveUser, removeUser, setEditingKey, searchUser, clearSearch } from './userSlice'
import store from '../../app/store';
import '../../css/EditableTable.css'

const { Search } = Input;

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
    const {beEdited} = store.getState().users;
    const editingKey = beEdited;
    console.log("beEdited:"+beEdited)

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
      store.dispatch(setEditingKey(record.key));
    };
  
    const remove = (record) => {
      store.dispatch(removeUser(record))
    };
  
    const cancel = () => {
      store.dispatch(setEditingKey(''));
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
          store.dispatch(setEditingKey(''));
        } else {
          newData.push(row);
          store.dispatch(saveUser(newData));
          store.dispatch(setEditingKey(''));
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

export class UserManager extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    

    onSearch = (value) => {
        store.dispatch(searchUser(value))
    }
    

    

    
    render() {
        const columns = [
            {
                title: 'id',
                dataIndex: 'id',
                width: '25%',
                key: 'id',
                editable: false
            },
            {
                title: 'username',
                dataIndex: 'username',
                width: '25%',
                key: 'username',
                editable: true
            },
            {
                title: 'password',
                dataIndex: 'password',
                width: '25%',
                key: 'password',
                editable: true
            },
            
            // {
            //     title: 'edit',
            //     dataIndex: 'edit',
            //     key: 'edit',
            // },
            // {
            //     title: 'remove',
            //     dataIndex: 'remove',
            //     key: 'remove',
            // },
            
        ]

        

        
        // let users = users = useSelector(state => state.users.users);
        let state = store.getState();
        console.log(state)
        let users = state.users.users;
        let searchUsers = state.users.searchUsers;
        let {searchValue} = this.state;
        
        // return (
        //     <div>
        //         <button onClick={() => store.dispatch(addUser({id:"id",username:"username",password: "password"}))}>添加用户</button>
        //         <Table columns={columns} dataSource={users}></Table>
        //     </div>
        // )

        return (
            <div>
                <div>
                    <Search width="60%" placeholder="用户名" onSearch={this.onSearch} enterButton />
                    {/* <input value={searchValue} defaultValue="用户名" placeholder="用户名"/> */}
                    <button onClick={() => {store.dispatch(clearSearch())}}>清空检索</button>
                </div>
                <div>
                    <button onClick={() => store.dispatch(addUser({username:"username",password: "password"}))}>添加用户</button>
                </div>
                <EditableTable data={searchUsers === null ? users: searchUsers} columns={columns} />
            </div>
        )
    }
}