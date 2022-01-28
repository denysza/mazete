import { useState, useEffect} from 'react'
import axios from 'axios';
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

function Synopsis() {
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState("ビルの屋上にあつめられたゴン達。\n\n利根川から鉄骨の上を渡って、向こうのビルへ行けたものに賞金がもらえると説明を受ける。\n\nゴン達はいかにしてこの危機を乗り越えるのか？")
    
    useEffect(() => {
        let register_id =  localStorage.register_id || null;
        let outline_id = localStorage.outline_id || null;
        let data = JSON.stringify({
            "user_id":register_id,
            "outline_id":outline_id
        });
        let config = {
            method: 'post',
            url: `${baseurl}/get_outline`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : data,
        };
        axios(config)
        .then((response) => {
            if(response.data.generated && response.data.outline && !response.data.error){
                setLoading(false);
                setData(response.data.outline);
            }
            else{
                navigate("/error",
                {
                    state: {
                        message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                }
            });
            }
        })
        .catch((error)=>{
            navigate("/error",
            {
                state: {
                    message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
            }
        });
        })
    }, [])

    const handleTalk = () => {
        let register_id =  localStorage.register_id || null;
        let outline_id = localStorage.outline_id || null;
        let postdata = JSON.stringify({
            "user_id":register_id,
            "outline_id":outline_id,
            "outline":data
        });
        let config = {
            method: 'post',
            url: `${baseurl}/generate_story`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : postdata,
        };
        axios(config)
        .then((response) => {
            window.location.assign(`/talk/${response.data.story_id}`)
        })
        .catch((error)=>{
            navigate("/error",
                {
                    state: {
                        message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                }
            });
        })
    }

    return(
        <div className="container" id="loading_synposis">
            <div className="container-wrap">
                <div className="ls-top editing">
                    <div className="ls-top-wrap">
                        <div className="ls-top-body">
                            <div className="ls-top-item">
                                <img src="/assets/image/character01.png" alt=""/>
                            </div>
                            <div className="ls-top-item">
                                <img src="/assets/image/character02.png" alt=""/>
                            </div>
                            <div className="ls-top-item">
                                <img src="/assets/image/character03.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ls-main">
                    <div className="ls-main-title">
                        あらすじ
                    </div>
                    <div className="ls-main-loading-text">
                        {loading &&
                            <div className="ls-main-loading-part">
                                <img src="/assets/image/white-loading.gif" alt=""/>
                                <span>下書き準備中</span>
                            </div>
                        }
                        {!loading &&
                            <textarea autoFocus className="ls-main-loading-wrap" value={data} disabled={!editable} onChange={(event)=>{setData(event.target.value)}} onBlur={()=>{setEditable(false)}}/>
                        }
                    </div>
                    {!editable && <div className="ls-main-edit-btn">
                        <a onClick={()=>{setEditable(true)}}><span>編集</span><img src="/assets/image/edit-icon.png" alt=""/></a>
                    </div>}
                    {!editable && <button onClick={handleTalk}  className={loading ? "ls-main-making-btn" : "ls-main-making-btn active"} disabled={loading}>この世界線に入る</button>}
                </div>
            </div>
        </div>
    )
}

export default Synopsis;