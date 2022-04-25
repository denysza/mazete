import React, { useState, useEffect, useLayoutEffect} from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 260,
    bgcolor: 'background.paper',
    borderRadius:"10px",
    p: 4,
  };
function sleep(ms) {
    return new Promise(resolve => (setTimeout(resolve, ms)));
}

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

function Talk() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [imagelist, setImagelist] = useState(true);
    const [data, setData] = useState(null);
    const [renderIndex, setIndex] = useState(0);
    const [position, setPosition] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [renderText, setRenderText] = useState([]);
    const [multiple, setMultiple] = useState(false);
    const [end, setEnd] = useState(false);
    const [rendering, setRendering] = useState(false);
    const [width, height] = useWindowSize();
    let {id} = useParams();
    const [open, setOpen] = useState(false);


    const handleOpen = () => 
    {
        setOpen(true);
        let register_id =  sessionStorage.register_id || null;
        let data = JSON.stringify({
            "user_id":register_id,
            "story_id":id
        });
        let config = {
            method: 'post',
            url: `${baseurl}/get_shared_message`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : data,
        };
        axios(config)
        .then((response) => {
            navigate("/movie",
            {
                state: {
                    message: response.data.message,
                    movie_url:response.data.movie_url
            }
        });
        })
        .catch((error)=>{
            navigate("/error",
                {
                    state: {
                        message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                }
            });
        });
    }
    

    useEffect(() => {
        // document.getElementById("adventure_state").style.height = vh + "px";
        let register_id =  sessionStorage.register_id || null;
        let talkdata =  sessionStorage.data || null;
        console.log(talkdata)
        if(talkdata){
            setLoading(false)
            setData(JSON.parse(talkdata));
        }
        else{        
            let data = JSON.stringify({
                "user_id":register_id,
                "story_id":id
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
                if(response.data.generated && !response.data.error){
                    setData(response.data);
                    sessionStorage.setItem("data", JSON.stringify(response.data));
                    let images= response.data.story.map(item=>{
                            const newimg = new Image();
                            newimg.src = item.chara_img_url;
                            return newimg;
                    })
                    setImagelist(images)
                    setLoading(false)
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
            });
        }

        // window.history.pushState(null, null, window.location.pathname);
        // window.addEventListener('popstate', onBackButtonEvent);
    }, []);


    useEffect(() => {
        if(data){
            setTalk()
        }
    }, [data, renderIndex])
    
    useEffect(async () => {
        if(data){
            let stroyData = data.story;
            await sleep(1);
            setPosition(stroyData[renderIndex].position)
        }
    }, [avatar])

    const setTalk=()=>{
        let stroyData = data.story;
        if(stroyData[renderIndex]){
            setAvatar(stroyData[renderIndex].chara_img_url);
           
            // setPosition(stroyData[renderIndex].position)
            if(stroyData[renderIndex].multiple){
                setMultiple(true);
                setRenderText(stroyData[renderIndex].content);
            }
            else{
                setMultiple(false);
                renderingText(stroyData[renderIndex].content);
            }
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
        
        if(!rendering && !multiple){
            if(data.story.length - 1 > renderIndex){
                setRenderText([]);
                setIndex(renderIndex + 1)
            }
        }
    }

    const handleGoback = () =>{
        if(renderIndex===0)
        {
            sessionStorage.removeItem("data");
            navigate("/synopsis",{state: {}})
        }
        if(renderIndex!=0 && !rendering){
            setIndex(renderIndex-1);
            setEnd(false)
        }
    }

    const handleTop = (e) =>{
        e.preventDefault();
        sessionStorage.removeItem("outline_id");
        sessionStorage.removeItem("background");
        sessionStorage.removeItem("user_list");
        sessionStorage.removeItem("data");
        navigate("/",{state: {}})
    }

    const handleRestStory = (text) => {
        if(!multiple) return
        let register_id =  sessionStorage.register_id || null;
        
        setLoading(true)
        let postdata = JSON.stringify({
            "user_id":register_id,
            "story_id":id,
            'chosen_content':text
        });
        let config = {
            method: 'post',
            url: `${baseurl}/generate_rest_story`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : postdata,
        };
        axios(config)
        .then((response) => {
            let rest_story_id = response.data.story_id;
              let postdata = JSON.stringify({
                "user_id":register_id,
                "story_id":rest_story_id,
            });
            let config = {
                method: 'post',
                url: `${baseurl}/get_rest_story`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                    data : postdata,
            };
            axios(config)
            .then((response) => {
                if(response.data.generated && !response.data.error){
                   
                    data.story.splice(renderIndex + 1, data.story.length - renderIndex - 1)
                    data.story =  data.story.concat(response.data.story)
                    setData(data)
                    sessionStorage.setItem("data", JSON.stringify(data));
                    selectText(text)
                    let images= response.data.story.map(item=>{
    
                            const newimg = new Image();
                            newimg.src = item.chara_img_url;
                            return newimg;
                    })
                    setImagelist(images)
                    setLoading(false);
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
            });
        })
        .catch((error)=>{
            navigate("/error",
                {
                    state: {
                        message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                }
            });
        });
    }
    return(
        <>
            {loading && 
                <div className="container" id="loading_adventure" >
                    <div className="container-wrap">
                        <div className="la-wrap">
                            <img src="/assets/image/black-loading.gif" alt=""/>
                            <span>準備中</span>
                        </div>
                    </div>
                    {/* <button className="back-to-btn" onClick={handleGoback}><img src="/assets/image/back-to-img.svg" alt="" /></button> */}
                </div>
            }
            {
                !loading &&
                <div className="container" id="adventure_state" style={{height:`${height}px`}}>
                    <div className="container-wrap" onClick={handleNext}>
                        <div className="as-thumb" style={{backgroundImage:`url(${data?.background_url})`}}>
                            {avatar && <img src={avatar} alt="" className={`as-thumb-character ${position==0 ? 'lb': position==1 ? 'mb' : 'rb'}`}/>}
                        </div>
                        <div className="as-text">
                            {renderText.map((item,index)=>(
                                <div key={index} className={`as-text-wrap ${rendering || multiple || end ? "" : "arrow"}`} style={{minHeight:`${multiple?"unset":"80px"}`}} onClick={()=>{handleRestStory(item)}}>
                                    {item}
                                </div>
                            ))}
                            
                        </div>
                    </div>
                    <button className="back-to-btn" onClick={handleGoback}><img src={renderIndex==0 ? "/assets/image/back-to-img.png" : "/assets/image/back.png"} alt="" /></button>
                    {/* {!end && <div className="text-select-btn-group">
                        {!multiple && <a className="next-btn">タップして次へ&nbsp;&nbsp;▶</a>}
                        {multiple && <a className="next-btn active">選択して下さい&nbsp;&nbsp;▶</a>}
                    </div>} */}
                    {end && <div className="text-select-btn-group">
                        <a onClick={handleTop} className="final-btn">トップへ</a>
                        <a className="final-btn" onClick={handleOpen}>シェア</a>
                    </div>}
                </div>
            }

        <Modal
            open={open}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box id="modal-modal-title" variant="h6" component="h2" style={{textAlign:"center"}}>
                    <img src="/assets/image/white-loading.gif" alt=""/>
                </Box>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    シェア用の動画を作成中...
                </Typography>
            </Box>
        </Modal>
        </>
    )
}

export default Talk;