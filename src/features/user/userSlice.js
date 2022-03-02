import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "userAction",
    initialState: {
        users: [
            
        ],
        searchUsers: null,
        beEdited: ''
    },
    reducers: {
        remove: (state, action) => {
            let {removeId} = action;
            state.users = state.users.filter((user) => {
                if(user.id === removeId) {
                    return false;
                }
                return true;
            });
        },
        addUser: (state, action) => {
            let user = action.payload;
            let {users} = state;
            console.log(user)
            let len = users.length;
            user.id = len;
            user.username += len;
            user.password += len;
            user.key = len;
            
            users.push(user)
            state.beEdited = user.key
            state.users = users;
        },
        searchUser: (state, action) => {
            let username = action.payload;
            let {users} = state;

            console.log(action)

            let searchUsers = users.filter((user) => {
                return username === user.username ? true: false;
            })

            console.log(searchUsers)
            state.searchUsers = searchUsers;
            if('' === username) {
                state.searchUsers = null;
            }
        },
        saveUser: (state, action) => {
            state.users = action.payload;
        },
        removeUser: (state, action) => {
            let {users} = state;
            let removed = action.payload;
            let newUsers = users.filter((user) => {
                return removed.key === user.key ? false: true;
            })
            newUsers = newUsers.map( (user, index) => {
                user.id = index;
                user.key = index;
                return user;
            })
            state.users = newUsers;
        },
        setEditingKey: (state, action) => {
            let key = action.payload;

            state.beEdited = key;
        },
        clearSearch: (state) => {
            state.searchUsers = null;
        }
    }
})

export const {editUser, addButton, addUser, saveUser, searchUser, removeUser, setEditingKey, clearSearch} = userSlice.actions;


export default userSlice.reducer;