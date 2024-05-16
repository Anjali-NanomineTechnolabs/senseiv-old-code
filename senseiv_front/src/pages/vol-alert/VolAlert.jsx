import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const VolAlert = () => {

    // Token Validation
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token === null) {
            navigate("/")
        }
    }, [])

    return (
        <>
            <section className='vol_alert_section'>
                <div className="container-fluid">
                    <div className="vol_alert_area">
                        <div className="top_area">
                            <div className="top_text text-center">
                                <p>Vol ALerts</p>
                            </div>
                            <div className="top_box">
                                <div className="row">
                                    <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
                                        <div className="top_box_area">
                                            <h6>LalpathLab-i</h6>
                                            <h5>112.2</h5>
                                            <p>pe today high</p>
                                            <p>2023-02-23 16:36:32</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover m-0">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Vol</th>
                                        <th>Period</th>
                                        <th>Alert Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                    <tr>
                                        <td>Lalpathlab-i</td>
                                        <td>112.2</td>
                                        <td>Pe Today High</td>
                                        <td>2023-02-23T16:36:32Z</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default VolAlert