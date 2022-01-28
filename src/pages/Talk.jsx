import { useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { render } from 'react-dom';
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

function sleep(ms) {
    return new Promise(resolve => (setTimeout(resolve, ms)));
}

function Talk() {
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [renderIndex, setIndex] = useState(0);
    const [position, setPosition] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [renderText, setRenderText] = useState([]);
    const [multiple, setMultiple] = useState(false);
    const [end, setEnd] = useState(false);
    const [rendering, setRendering] = useState(false)

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
            if(response.data.generated && !response.data.error){
                setLoading(false);
                setData(response.data);
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

    useEffect(() => {
        if(data){
            setTalk()
        }
    }, [data, renderIndex])

    const setTalk=()=>{
        let stroyData = data.story;
        setAvatar(stroyData[renderIndex].chara_img_url);
        setPosition(stroyData[renderIndex].position)
        if(stroyData[renderIndex].multiple){
            setMultiple(true);
            setRenderText(stroyData[renderIndex].content);
        }
        else{
            setMultiple(false);
            renderingText(stroyData[renderIndex].content);
        }
    }

    const  renderingText = async (text) =>{
        setRendering(true)
        var typeindex = 0;
        while(typeindex<text.length){
            setRenderText([text.substring(0, typeindex+1)])
            typeindex++;
            await sleep(75); 
        }
        setRendering(false)
        if(data.story.length - 1 == renderIndex)
        {
            setEnd(true)
        }
    }

    const selectText = (text) =>{
        if(multiple)
        {
            setMultiple(false)
            renderingText(text)
        }
    }
    
    const handleNext = ()=>{
        if(!rendering){
            if(data.story.length - 1 > renderIndex){
                setIndex(renderIndex + 1)
            }
        }
    }

    return(
        <>
            {loading && 
                <div className="container" id="loading_adventure">
                    <div className="container-wrap">
                        <div className="la-wrap">
                            <img src="/assets/image/black-loading.gif" alt=""/>
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
                            {avatar && <img src={avatar} alt="" className={`as-thumb-character ${position==0 ? 'lb': position==1 ? 'mb' : 'rb'}`}/>}
                        </div>
                        <div className="as-text">
                            {renderText.map((item,index)=>(
                                <div key={index} className="as-text-wrap" onClick={()=>{selectText(item)}}>
                                    {item}
                                </div>
                            ))}
                            
                        </div>
                        {!end && <div className="text-select-btn-group">
                            {!multiple && <a onClick={handleNext} className="next-btn">タップして次へ&nbsp;&nbsp;▶</a>}
                            {multiple && <a className="next-btn active">選択して下さい&nbsp;&nbsp;▶</a>}
                        </div>}
                        {end && <div className="text-select-btn-group">
                            <a href="" className="final-btn">もう一度見る</a>
                            <a href="" className="final-btn">この物語をシェアする</a>
                        </div>}
                    </div>
                </div>
            }
        </>
    )
}

export default Talk;