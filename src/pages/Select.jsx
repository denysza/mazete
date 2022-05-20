import {useState, useEffect, useLayoutEffect} from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { v4 as uuidv4 } from 'uuid'
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;
const filter = createFilterOptions({
    stringify: (option) => option.kana + option.label
});

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

const placeholder = [
    "キャラ名または作品名でさがす",
    "場面名または作品名でさがす"
]

function Top() {
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState(1);
    const [selectedAvatars, setSelectedAvatas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [active, setActive] = useState(false);
    const [characterList, setCharacterList] = useState([1,2,3]);
    const [worldList, setWorldList] = useState([1,2,3,4,5]);
    const [width, height] = useWindowSize();
    

    useEffect(async() => {
        let register_id =  sessionStorage.register_id || null;
        let background = sessionStorage.background || null;
        let user_list = sessionStorage.user_list || null; 
        sessionStorage.removeItem("outline_data");
        if(user_list)
        {
            setSelectedAvatas(JSON.parse(user_list));
        } 
        if(background)
        {
            setSelectedArea(JSON.parse(background));
        }
        
        if(!register_id)
        {
            register_id =  uuidv4();
            sessionStorage.setItem("register_id",register_id);
            var postdata = JSON.stringify({
                "register_id":register_id
            });
            
            var config = {
                method: 'post',
                url: `${baseurl}/register_id`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                    data : postdata,
            };

            const res = await axios(config);
        }
    },[]);

    useEffect(()=>{
        if(selectedArea && selectedAvatars.length>0)
        {
            setActive(true);
        }
        else{
            setActive(false);
        }
    },[selectedAvatars,selectedArea])


    const handleClickAvatar= (index)=>{
        let arvatars = selectedAvatars
        let indexavatar = characterList.filter(item=>(item==index))[0]
        if(arvatars?.map(item=>(item)).includes(index)){
            for( let i = 0; i < arvatars.length; i++){ 
                                   
                if ( arvatars[i] === index) { 
                    arvatars.splice(i, 1); 
                    i--;
                }
            }
            setSelectedAvatas([...arvatars]);
        }
        else{
            setSelectedAvatas([index]);
        }
    }

    const handleOutline = () => {
        let register_id =  sessionStorage.register_id || null;
        let data = JSON.stringify({
            "user_id":register_id,
            "chosen_chara_ids":selectedAvatars.map(item=>(item)).toString(),
            "chosen_world_ids":[selectedArea].toString()

        });
        let config = {
            method: 'post',
            url: `${baseurl}/generate_outline`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : data,
        };
        axios(config)
        .then((response) => {
            sessionStorage.setItem("outline_id", response.data.outline_id);
            sessionStorage.setItem("background", JSON.stringify(selectedArea));
            sessionStorage.setItem("user_list", JSON.stringify(selectedAvatars));
            sessionStorage.removeItem("outline_data")
            navigate(`/synopsis`,{state: {}})
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

 

    const handleUnselectAvartar = (index) =>(e)=>{
        e.stopPropagation();
        let arvatars = selectedAvatars
        for( let i = 0; i < arvatars.length; i++){
            if (arvatars[i] === index) { 
                arvatars.splice(i, 1); 
                i--;
            }
        }
        setSelectedAvatas([...arvatars]);
    }




    return(
        <div className="container" id="character_select" style={{height:`${height}px`}}>
            <div className="container-wrap">
                <div className="common-header">
                    <div className="common-header-title01">
                        -作品リミックス-
                    </div>
                    <div className="common-header-title02">
                        マぜて
                    </div>
                </div>
                <div className="preview">
                    <div className="preview-part" onClick={()=>{setTab(1)}}>
                        <div className="preview-img-part">
                            {selectedAvatars?.map((avatar)=>(<div key={avatar} style={{backgroundImage:`url(/assets/image/charas/${avatar}.png)`}} className="avatar-preview"><div className="avatar-preview-close" onClick={handleUnselectAvartar(avatar)}><span></span><span></span></div></div>))}
                            {selectedAvatars.length==0 && <div className="avatar-preview" style={{backgroundImage:`url(/assets/image/default-avatar.png)`}}></div>}
                        </div>
                        <div className={tab===1 ? "preview-title-part active" : "preview-title-part"}>
                            キャラ
                        </div>
                    </div>
                    <div className="preview-part" onClick={()=>{setTab(2)}}>
                        <div className="preview-img-part">
                            <div style={{backgroundImage:`url(${selectedArea!=null ? `/assets/image/worlds/${selectedArea}.png`: "/assets/image/point-bg.png"})`}} className={selectedArea!=null ? "world-preview":"world-none-preview"}/>
                        </div>
                        <div className={tab===2 ? "preview-title-part active" : "preview-title-part"}>
                        シチュエーション
                        </div>
                    </div>
                </div>
                <div className="point-select">
                   
                    <div className="point-body" style={{height: `calc(${height}px - 305px)`}}>
                        {
                            tab===1
                            && <div className="point-body-wrap">
                                {
                                    characterList?.map((image, index)=>(
                                       
                                        <div style={{backgroundImage:`url(/assets/image/charas/${image}.png)`}} onClick={()=>handleClickAvatar(image)} key={index} className={`${selectedAvatars.map(item=>(item)).includes(image) ? "active" : ""} character-item`}>
                                            <span></span>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                        {
                            tab==2 &&
                            <div className="point-body-wrap">
                                {
                                    worldList?.map((area, index)=>(
                                        <div style={{backgroundImage:`url(/assets/image/worlds/${area}.png)`}} key={index} className={`${selectedArea==area? "active" : ""} location-item`} onClick={(e)=>{setSelectedArea(area)}}>
                                            <span></span>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <button onClick={handleOutline} className={`character-add-btn ${active ? "active" : ""}`} disabled={!active}>組み合わせ決定</button>
        </div>
    )
}

export default Top;