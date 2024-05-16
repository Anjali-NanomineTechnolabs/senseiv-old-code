import React, {useEffect, useState} from "react";
import axios from "axios";

const Settings = () => {
    const [settings, setSettings] = useState([]);
    const [settingToUpdate, setSettingToUpdate] = useState('');

    useEffect(() => {
        getAllSettings();
    }, [])

    const getAllSettings = async () => {
        const response = await axios.get("settings")
        if (response.data.success) {
            setSettings(response.data.data)
        }
    }

    const handleUpdateChange = (e) => {
        const {name, value} = e.target;

        setSettingToUpdate((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSettingUpdateSubmit = (e) => {
        e.preventDefault();

        axios.put(`settings/${settingToUpdate.id}`, settingToUpdate).then((response) => {
            if (response.data.success) {
                setSettings(response.data.data)
                setSettingToUpdate(null);
            }
        })
    }

    return (
        <>
            <section className='dashboard_section'>
                <div className="container-fluid">
                    {/* High value swap triggers */}
                    {/*<Triggers/>*/}


                    <div className="dashboard_area">

                        <div className="top_text_area d-flex align-items-center justify-content-between">
                            <h5>Settings</h5>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover m-0">
                                <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {settings.length === 0 ?
                                    <tr>
                                        <td colSpan={4} className='text-center'>No Data Found</td>
                                    </tr>
                                    :
                                    settings.map((setting, index) => (
                                        <tr key={setting.id}>
                                            <td>{index + 1}</td>
                                            <td>{setting.name}</td>
                                            <td>{setting.value}</td>
                                            <td>
                                                <button data-bs-toggle="modal" data-bs-target="#editUser" className='update_btn' onClick={() => setSettingToUpdate(setting)}>
                                                    <span className='me-1'><i className="fa-solid fa-edit"></i></span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

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
                                <h3>Edit Setting</h3>
                            </div>
                            {
                                settingToUpdate !== null ?
                                    <form onSubmit={handleSettingUpdateSubmit}>
                                        <div className="form-group mb-3">
                                            <label className='w-100'>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='name'
                                                value={settingToUpdate.name}
                                                readOnly={true}
                                                style={{backgroundColor: '#e9ecef'}}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className='w-100'>Value</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='value'
                                                value={settingToUpdate.value}
                                                onChange={handleUpdateChange}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <button type="button" data-bs-dismiss="modal">Cancel</button>
                                            <button type="submit" data-bs-dismiss="modal">Update</button>
                                        </div>
                                    </form>
                                    : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings