import axios from 'axios';
import React, {useEffect, useState} from 'react'
import toast from 'react-hot-toast';
import {formatDateTime} from "../../helpers/helpers";

const initialState = {name: "", email: "", password: "", isActive: "", expiresAt: "",};

const User = () => {
    // States
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState(initialState)
    const [userUpdate, setUserUpdate] = useState(initialState);
    const [userDelete, setUserDelete] = useState(null);

    useEffect(() => {
        getUserData();
    }, [])

    // User Add
    const handleChange = (e) => {
        const {name, value} = e.target;

        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleUserAdd = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('users', userData);

            if (response.data.success) {
                window.location.reload();
                // getUserData();
                // toast.success(response.data.message);
                //
                // // clear the value
                // document.getElementById("expiryAt").value = "";
                // document.getElementById("trueradio").checked = false;
                // document.getElementById("falseradio").checked = false;
                //
                // setUserData(initialState);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    // Get User Data
    const getUserData = () => {
        axios.get('users')
            .then((response) => {
                setUsers(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // User Update
    const setToUpdate = (value) => {
        setUserUpdate(value)
    }

    const handleUpdateChange = (e) => {
        const {name, value} = e.target;

        setUserUpdate((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleUserUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`users/${userUpdate.id}`, userUpdate)

            if (response.data.success) {
                getUserData();
                toast.success(response.data.message);
                setUserUpdate(initialState)
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error);
        }
    }

    // User Delete
    const handleDeleteUser = async () => {
        try {
            const response = await axios.delete(`users/${userDelete}`);

            if (response.data.success) {
                getUserData();
                toast.success(response.data.message)
                setUserDelete(null)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section className='dashboard_section'>
                <div className="container-fluid">
                    <div className="dashboard_area">
                        <div className="top_text_area d-flex align-items-center justify-content-between">
                            <h5>Users</h5>
                            <button data-bs-toggle="modal" data-bs-target="#addUser" className='add_btn'>
                                <span className='me-1'><i className="fa-solid fa-plus"></i></span> Add User
                            </button>
                        </div>
                        {
                            users.length === 0 ?
                                <div className="no_data_area text-center">
                                    <p className='m-0'>No Data found . Add users</p>
                                </div>
                                :
                                <div className="table-responsive">
                                    <table className="table table-hover m-0">
                                        <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>isActive</th>
                                            <th>ExpityAt</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            users.map((v, i) => {

                                                return (
                                                    <tr key={v.id}>
                                                        <td>{i + 1}</td>
                                                        <td>{v.name}</td>
                                                        <td>{v.email}</td>
                                                        <td>{
                                                            v.isActive ? "true" : "false"
                                                        }</td>
                                                        <td>{formatDateTime(v.expiresAt)}</td>
                                                        <td>
                                                            <button className='update_btn' data-bs-toggle="modal" data-bs-target="#editUser" onClick={() => setToUpdate(v)}>
                                                                <i className="fa-solid fa-pen"></i>
                                                            </button>
                                                            <button className='delete_btn' data-bs-toggle="modal" data-bs-target="#deleteUser" onClick={() => setUserDelete(v.id)}>
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                        }
                    </div>
                </div>
            </section>

            {/* Modals */}
            <div className="modal fade" id="addUser" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-0">
                        <div className="modal-header justify-content-end">
                            <button type="button" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-xmark fs-5"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="top_text text-center">
                                <h3>Add User</h3>
                            </div>
                            <form onSubmit={handleUserAdd}>
                                <div className="form-group mb-3">
                                    <label htmlFor="name" className='w-100'>Name :</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name='name'
                                        value={userData.name}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="email" className='w-100'>Email :</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name='email'
                                        value={userData.email}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password" className='w-100'>Password :</label>
                                    <input
                                        type="password"
                                        autoComplete='off'
                                        className="form-control"
                                        id="password"
                                        name='password'
                                        minLength={6}
                                        value={userData.password}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="isActive" className='w-100 mb-1'>IsActive :</label>
                                    <div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="trueradio"
                                                name="isActive"
                                                value="true"
                                                required
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="trueradio">True</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="falseradio"
                                                name="isActive"
                                                value="false"
                                                required
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="falseradio">False</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="expiryAt" className='w-100 mb-1'>ExpiryAt :</label>
                                    <input
                                        type="date"
                                        name='expiresAt'
                                        className='w-100 form-control'
                                        id='expiryAt'
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <button type="button" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="editUser" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-0">
                        <div className="modal-header justify-content-end">
                            <button type="button" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-xmark fs-5"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="top_text text-center">
                                <h3>Edit User</h3>
                            </div>
                            {
                                userUpdate !== null ?
                                    <form onSubmit={handleUserUpdate}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="editName" className='w-100'>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="editName"
                                                name='name'
                                                value={userUpdate.name}
                                                onChange={handleUpdateChange}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="editEmail" className='w-100'>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="editEmail"
                                                name='email'
                                                value={userUpdate.email}
                                                onChange={handleUpdateChange}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="editIsActive" className='w-100 mb-1'>IsActive</label>
                                            <div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="editTrueradio"
                                                        name="isActive"
                                                        checked={userUpdate.isActive === "true" || userUpdate.isActive === true}
                                                        value='true'
                                                        onChange={handleUpdateChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="editTrueradio">True</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="editFalseradio"
                                                        name="isActive"
                                                        checked={userUpdate.isActive === "false" || userUpdate.isActive === false}
                                                        value='false'
                                                        onChange={handleUpdateChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="editFalseradio">False</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="editExpiryAt" className='w-100 mb-1'>ExpiryAt</label>
                                            <input
                                                type="date"
                                                name='expiresAt'
                                                value={userUpdate.expiresAt.split('T')[0]}
                                                id='editExpiryAt'
                                                className='w-100 form-control'
                                                onChange={handleUpdateChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <button type="button" data-bs-dismiss="modal">Cancel</button>
                                            <button type="submit" data-bs-dismiss="modal">Update</button>
                                        </div>
                                    </form>
                                    : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="deleteUser" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-0">
                        <div className="modal-header justify-content-end">
                            <button type="button" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-xmark fs-5"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="top_text text-center">
                                <h3>Delete User</h3>
                                <p>Are you sure you want to delete these Records?</p>
                                <div className="button_area">
                                    <button type="button" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" data-bs-dismiss="modal" onClick={handleDeleteUser}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default User