import { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

function Top() {
    const navigate = useNavigate();
    useEffect(() => {
        let register_id =  uuidv4();
      
        var data = JSON.stringify({
            "register_id":register_id
        });
        var config = {
            method: 'post',
            url: `${baseurl}/register_id`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : data,
        };
        axios(config)
        .then((response) => {
            localStorage.setItem("register_id", register_id)
        })
        .catch((error)=>{
            if (error.response) {
                if(error.response.status===500){
                    navigate("/error",
                        {
                            state: {
                                message: "サービスに不具合が生じております。<br/>時間をおいてお試しください。"
                        }
                    });
                }
                else if(error.response.status===504){
                    navigate("/error",
                        {
                            state: {
                                message: "アクセスが集中しております。<br/>時間をおいてお試しください。"
                        }
                    });
                }
                else{
                    navigate("/error",
                        {
                            state: {
                                message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                        }
                    });
                }
            }
        })
    });

    return(
        <div className="container">
            <div className="container-wrap">
                <div className="top-header">
                    <h1>マぜて</h1>
                </div>
                <div className="top-banner">
                    <img src="/assets/image/top-banner-img01.png" alt="" className="top-banner01"/>
                    <img src="/assets/image/top-banner-img02.png" alt="" className="top-banner02"/>
                    <img src="/assets/image/top-banner-img03.png" alt="" className="top-banner03"/>
                    <img src="/assets/image/top-banner-img04.png" alt="" className="top-banner04"/>
                    <div className="top-banner-text">
                        ※サービス内容伝わるイラスト外注
                    </div>
                </div>
                <a href="/select" className="start-btn">スタート</a>
                <div className="top-banner-border"></div>
                <div className="top-delusion">
                    <div className="top-delusion-title">
                        みんなの妄想
                    </div>
                    <div className="top-delusion-body">
                        <div className="top-delusion-part">
                            <img src="/assets/image/top-delusion-img01.png" alt="" className="top-delusion-img"/>
                        </div>
                        <div className="top-delusion-part">
                            <img src="/assets/image/top-delusion-img02.png" alt="" className="top-delusion-img"/>
                        </div>
                        <div className="top-delusion-part">
                            <img src="/assets/image/top-delusion-img03.png" alt="" className="top-delusion-img"/>
                        </div>
                        <div className="top-delusion-part">
                            <img src="/assets/image/top-delusion-img04.png" alt="" className="top-delusion-img"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Top;