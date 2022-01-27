import { useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

function Talk() {
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    let {story_id} = useParams();
    useEffect(() => {
        let register_id =  localStorage.register_id || null;
        
        let data = JSON.stringify({
            "user_id":register_id,
            "story_id":story_id
        });
        let config = {
            method: 'post',
            url: `${baseurl}/get_story`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : data,
        };
        axios(config)
        .then((response) => {
            setLoading(false);
            console.log(response.data)
            if(response.data.generated && !response.data.error){
                setLoading(false);
                setData(response.data);
            }
            else{
                window.location.assign('/select')
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }, [])

    return(
        <>
            {loading && 
                <div className="container" id="loading_adventure">
                    <div className="container-wrap">
                        <div className="la-wrap">
                            <img src="./assets/image/black-loading.gif" alt=""/>
                            <span>準備中</span>
                        </div>
                    </div>
                </div>
            }
            {
                !loading &&
                <div className="container" id="adventure_state">
                    <div className="container-wrap">
                        <div className="as-thumb" style={{backgroundImage:`url(${data?.background_url})`}}>
                            <img src="./assets/image/character03.png" alt="" className="as-thumb-character lb"/>
                        </div>
                        <div className="as-text">
                            <div className="as-text-wrap">
                                今年の新人はつぶしがいがあるぜ
                            </div>
                            <div className="as-text-wrap">
                                今年の新人はつぶしがいがあるぜ
                            </div>
                            <div className="as-text-wrap">
                                今年の新人はつぶしがいがあるぜ
                            </div>
                        </div>
                        <div className="text-select-btn-group active">
                            <a href="" className="next-btn">タップして次へ&nbsp;&nbsp;▶</a>
                            <a href="" className="next-btn active">選択して下さい&nbsp;&nbsp;▶</a>
                        </div>
                        <div className="text-select-btn-group">
                            <a href="" className="final-btn">もう一度見る</a>
                            <a href="" className="final-btn">この物語をシェアする</a>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Talk;