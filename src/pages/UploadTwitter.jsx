import {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate} from "react-router-dom";
import queryString from 'query-string';
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;


function Movie() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
   
    useEffect(()=>{
        (async() => {
            sessionStorage.setItem("background",localStorage.background);
            sessionStorage.setItem("outline_data",localStorage.outline_data);
            sessionStorage.setItem("outline_id",localStorage.outline_id);
            sessionStorage.setItem("register_id",localStorage.register_id);
            sessionStorage.setItem("user_list",localStorage.user_list);
            localStorage.removeItem("background");
            localStorage.removeItem("outline_data");
            localStorage.removeItem("outline_id");
            localStorage.removeItem("register_id");
            localStorage.removeItem("user_list");
            const {oauth_token, oauth_verifier} = queryString.parse(window.location.search);  
            if (oauth_token && oauth_verifier) {
                let register_id =  sessionStorage.register_id || null; 
                let data = JSON.stringify({
                    "user_id":register_id,
                    "oauth_token":oauth_token,
                    "oauth_verifier":oauth_verifier
                });
                let config = {
                    method: 'post',
                    url: `${baseurl}/tweet_movie`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                        data : data,
                };
                axios(config)
                .then((response) => {
                    sessionStorage.removeItem("outline_id");
                    sessionStorage.removeItem("background");
                    sessionStorage.removeItem("user_list");
                    let message = localStorage.message;
                    let movie_url = localStorage.movie_url;
                    if(response.data.error)
                    {
                        alert("Twitterへの投稿に失敗しました。")
                       
                    }
                    else{
                        alert("Twitterに投稿しました。")
                    }
                    navigate("/movie",{
                        state: {
                            message: message,
                            movie_url:movie_url
                        }
                    })
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
            }
        })();
    },[])

    return(
       <>
            {
                loading && 
                    <div className="container" id="loading_adventure">
                        <div className="container-wrap">
                            <div className="la-wrap">
                                <img src="/assets/image/black-loading.gif" alt=""/>
                                <span>準備中</span>
                            </div>
                        </div>
                    </div>
            }
     </>
    )
}
export default Movie;