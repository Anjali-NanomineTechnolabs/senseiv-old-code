import axios from 'axios'
import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate()

    // Token Validation
    const token = localStorage.getItem("token");

    // State
    const [formData, setFormData] = useState({email: "", password: ""})

    useEffect(() => {
        if (token !== null) {
            navigate("/live-analysis");
        }
    }, [token])

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("login", formData);

            if (response.data.success) {
                const token = response.data.data.token;
                const user = response.data.data.user
                localStorage.setItem("token", token);
                localStorage.setItem('user', JSON.stringify(user));

                if (user.isAdmin) {
                    navigate("/dashboard");
                } else {
                    navigate("/live-analysis");
                }

                setFormData({
                    email: "",
                    password: ""
                });
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <>
            <section className="login_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="logo text-center mb-4">
                                <Link>SenseIV</Link>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card border-0 rounded-0">
                                <div className="card-body">
                                    <div className="top_text text-center">
                                        <h5>Welcome Back !</h5>
                                        <p>Sign in to continue to SenseIV.</p>
                                    </div>
                                    <div className="p-2 mt-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group mb-3">
                                                <label htmlFor="email" className="mb-2">Email</label>
                                                <input type="email" autoComplete='email' required className="form-control" id="email" placeholder="Enter email" name='email' value={formData.email} onChange={handleChange}/>
                                            </div>
                                            <div className="form-group mb-3">
                                                {/* <div className="float-end forgot_text">
                                                  <Link className="text-muted">Forgot password?</Link>
                                                </div> */}
                                                <label htmlFor="userpassword" className="mb-2">Password</label>
                                                <input type="password" autoComplete='password' required className="form-control" id="userpassword" placeholder="Enter password" name='password' value={formData.password} onChange={handleChange}/>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault"/>
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    Remember me
                                                </label>
                                            </div>
                                            <div className="mt-3 text-right">
                                                <button className="btn w-100" type="submit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                                                        <polyline points="10 17 15 12 10 7"/>
                                                        <line x1={15} y1={12} x2={3} y2={12}/>
                                                    </svg>
                                                    Log In
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="copyright mt-5 text-center">
                                <p>© 2023 SenseIV.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login