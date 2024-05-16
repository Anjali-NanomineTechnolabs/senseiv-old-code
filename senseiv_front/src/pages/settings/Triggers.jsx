import React, {useState} from 'react';
import axios from "axios";
import toast from "react-hot-toast";

const Triggers = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const triggerHighSwap = async (type) => {
        if (isProcessing || !window.confirm(`Are your sure you want to trigger ${type} high swap?`)) return

        setIsProcessing(true)
        const response = await axios.post('trigger-high-swap', {type})
        if (response.data.success) {
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
        }
        setIsProcessing(false)
    }

    return (
        <>
            <section className='dashboard_section'>
                <div className="container-fluid">

                    <div className="row">
                        <div className="col-sm-6 col-md-4 col-lg-3">
                            <div className="triggers_dashboard dashboard_area text-center" onClick={() => triggerHighSwap('weekly')}>
                                <div className="top_text_area">
                                    <h5>Trigger weekly high swap</h5>
                                    <p className="mb-0">Weekly high value of all stocks, indexes, and options would be
                                        updated after comparing with last day's (friday) high value.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-md-4 col-lg-3">
                            <div className="triggers_dashboard dashboard_area text-center" onClick={() => triggerHighSwap('monthly')}>
                                <div className="top_text_area">
                                    <h5>Trigger monthly high swap</h5>
                                    <p className="mb-0">Monthly high value of all stocks, indexes, and options would be
                                        updated after comparing with last month's high value.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-md-4 col-lg-3">
                            <div className="triggers_dashboard dashboard_area text-center" onClick={() => triggerHighSwap('three monthly')}>
                                <div className="top_text_area">
                                    <h5>Three months high swap</h5>
                                    <p className="mb-0">Three month's high value of all stocks, indexes, and options
                                        would be
                                        updated after comparing with previous month's high value.</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section>
        </>
    );
}

export default Triggers;