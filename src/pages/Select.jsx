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
    const [characterList, setCharacterList] = useState([]);
    const [worldList, setWorldList] = useState([]);
    const [worldAutoList, setWorldAutoList] = useState([]);
    const [charaAutoList, setCharAutoList] = useState([]);
    const [autoList, setAutoList] = useState([]);
    const [value, setValue] = useState(null);
    const [width, height] = useWindowSize();

    useEffect(async() => {
        // let vh = window.innerHeight;
        // document.getElementById("character_select").style.height = vh + "px";
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
        let chardata = JSON.stringify({
            "user_id":register_id,
            "search_query":"",
            "chosen_chara_ids":"",
            "chosen_world_ids":""

        });
        let charconfig = {
            method: 'post',
            url: `${baseurl}/get_chara_list`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : chardata,
        };
        axios(charconfig)
        .then((response) => {
            setCharacterList(response.data.chara_list);
        })
        .catch((error)=>{
            navigate("/error",
                {
                    state: {
                        message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                }
            });
        })
        let worlddata = JSON.stringify({
            "user_id":register_id,
            "search_query":"",
            "chosen_chara_ids":"",
            "chosen_world_ids":""
        });
        let worldconfig = {
            method: 'post',
            url: `${baseurl}/get_world_list`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : worlddata,
        };
        axios(worldconfig)
        .then((response) => {
            setWorldList(response.data.world_list)
        })
        .catch((error)=>{
            navigate("/error",
            {
                state: {
                    message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
            }
        });
        })
        let autocomplete_chara_config = {
            method: 'post',
            url: `${baseurl}/get_autocomplete_chara`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : {},
        };
        axios(autocomplete_chara_config)
        .then((response) => {
            setCharAutoList(response.data.auto_complete);
            setAutoList(response.data.auto_complete)
        })
        .catch((error)=>{
        });
        
        let autocomplete_world_config = {
            method: 'post',
            url: `${baseurl}/get_autocomplete_world`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : {},
        };
        axios(autocomplete_world_config)
        .then((response) => {
            setWorldAutoList(response.data.auto_complete)
        })
        .catch((error)=>{
        });
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
        let indexavatar = characterList.filter(item=>(item.chara_id==index))[0]
        if(arvatars?.map(item=>(item.chara_id)).includes(index)){
            for( let i = 0; i < arvatars.length; i++){ 
                                   
                if ( arvatars[i].chara_id === index) { 
                    arvatars.splice(i, 1); 
                    i--;
                }
            }
            setSelectedAvatas([...arvatars]);
        }
        else{
            if(arvatars.length<3)
            {
                arvatars.push(indexavatar);
                setSelectedAvatas([...arvatars]);
            }
        }
    }

    const handleOutline = () => {
        let register_id =  sessionStorage.register_id || null;
        let data = JSON.stringify({
            "user_id":register_id,
            "chosen_chara_ids":selectedAvatars.map(item=>(item.chara_id)).toString(),
            "chosen_world_ids":[selectedArea.world_id].toString()

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
            navigate("/error",
                {
                    state: {
                        message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                }
            });
        })
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        let register_id =  sessionStorage.register_id || null;
        let search_query = value;
        let chosen_chara_ids = selectedAvatars.map(item=>(item.chara_id)).toString();
        let chosen_world_ids = "";
        if(selectedArea)
            chosen_world_ids =[selectedArea.world_id].toString();
        let data = JSON.stringify({
            "user_id":register_id,
            "search_query":search_query,
            "chosen_chara_ids":chosen_chara_ids,
            "chosen_world_ids":chosen_world_ids
        });
        if(tab==1)
        {
            let config = {
                method: 'post',
                url: `${baseurl}/get_chara_list`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                    data : data,
            };
            axios(config)
            .then((response) => {
                setCharacterList(response.data.chara_list)
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
        else{
            let config = {
                method: 'post',
                url: `${baseurl}/get_world_list`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                    data : data,
            };
            axios(config)
            .then((response) => {
                setWorldList(response.data.world_list)
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
    }

    const handleUnselectAvartar = (index) =>(e)=>{
        e.stopPropagation();
        let arvatars = selectedAvatars
        for( let i = 0; i < arvatars.length; i++){
            if ( arvatars[i].chara_id === index) { 
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
                    <div className="preview-part" onClick={()=>{setTab(1);setAutoList(charaAutoList); setValue(null)}}>
                        <div className="preview-img-part">
                            {selectedAvatars?.map((avatar)=>(<div key={avatar.chara_id} style={{backgroundImage:`url(${avatar.img_url})`}} className="avatar-preview"><div className="avatar-preview-close" onClick={handleUnselectAvartar(avatar.chara_id)}><span></span><span></span></div></div>))}
                            {selectedAvatars.length==0 && <div className="avatar-preview" style={{backgroundImage:`url(/assets/image/default-avatar.png)`}}></div>}
                        </div>
                        <div className={tab===1 ? "preview-title-part active" : "preview-title-part"}>
                            キャラ
                        </div>
                    </div>
                    <div className="preview-part" onClick={()=>{setTab(2); setAutoList(worldAutoList); setValue(null)}}>
                        <div className="preview-img-part">
                            <div style={{backgroundImage:`url(${selectedArea!=null ? selectedArea.img_url: "/assets/image/point-bg.png"})`}} className={selectedArea!=null ? "world-preview":"world-none-preview"}/>
                        </div>
                        <div className={tab===2 ? "preview-title-part active" : "preview-title-part"}>
                        シチュエーション
                        </div>
                    </div>
                </div>
                <div className="point-select">
                    <div className="point-search">
                    <form onSubmit={handleSubmit}>
                        <Autocomplete
                            value={value}
                            onChange={(event, newValue) => {
                                if (typeof newValue == "string") {
                                setValue(newValue);
                                } else if (newValue && newValue.inputValue) {
                                setValue(newValue.inputValue);
                                } else if(newValue && newValue.label){
                                    setValue(newValue.label);
                                }
                                else{
                                    setValue(newValue);
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                return filtered;
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            options={autoList}
                            getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                return option;
                                }
                                return option.label;
                            }}
                            renderOption={(props, option) => <li {...props} >{option.label}</li>}
                            renderInput={(params) => <TextField {...params} label="" placeholder={placeholder[tab - 1]} onChange={(event)=>{setValue(event.target.value)}}/>}
                        />
                        <button className="search-btn">
                            <img src="/assets/image/point-search.png" alt=""/>
                        </button>
                    </form>
                    </div>
                    <div className="point-intro">
                        画像はBingの検索結果をもとに表示しています
                    </div>
                    <div className="point-body" style={{height: `calc(${height}px - 305px)`}}>
                        {
                            tab===1
                            && <div className="point-body-wrap">
                                {
                                    characterList?.map((image, index)=>(
                                       
                                        <div style={{backgroundImage:`url(${image.img_url})`}} onClick={()=>handleClickAvatar(image.chara_id)} key={index} className={`${selectedAvatars.map(item=>(item.chara_id)).includes(image.chara_id) ? "active" : ""} character-item`}>
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
                                        <div style={{backgroundImage:`url(${area.img_url})`}} key={index} className={`${selectedArea?.img_url==area.img_url? "active" : ""} location-item`} onClick={(e)=>{setSelectedArea(area)}}>
                                            <span></span>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <button onClick={handleOutline} className={`character-add-btn ${active ? "active" : ""}`} disabled={!active}><img src="/assets/image/imgpsh_fullsize_anim.png" alt=""/>マぜる</button>
        </div>
    )
}

export default Top;