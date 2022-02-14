import {useState, useEffect, useLayoutEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;
const filter = createFilterOptions({
    stringify: (option) => option.kana + option.label
});

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

function Top() {
    const navigate = useNavigate();
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

    useEffect(() => {
        let vh = window.innerHeight;
        document.getElementById("character_select").style.height = vh + "px";
        let register_id =  localStorage.register_id || null;
        if(!register_id)
            window.location.assign("/");
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
                // navigate("/error",
                //     {
                //         state: {
                //             message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                //     }
                // });
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
                // navigate("/error",
                //     {
                //         state: {
                //             message: "ストーリーの生成に失敗しました。<br/>時間をおいてお試しください"
                //     }
                // });
            });
    },[]);

    useEffect(()=>{
        if(selectedArea && selectedAvatars.length>0)
        {
            setActive(true);
        }
    },[selectedAvatars,selectedArea])

    const handleClickAvatar= (index)=>{
        let arvatars = selectedAvatars
        let indexavatar = characterList.filter(item=>(item.chara_id==index))[0]
        if(arvatars.map(item=>(item.chara_id)).includes(index)){
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
        let register_id =  localStorage.register_id || null;
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
            localStorage.setItem("outline_id", response.data.outline_id);
            localStorage.setItem("background", selectedArea.img_url);
            localStorage.setItem("user_list",JSON.stringify(selectedAvatars.map((avatar)=>(avatar.img_url))));
            window.location.assign('/synopsis')
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
        let register_id =  localStorage.register_id || null;
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


    return(
        <div className="container" id="character_select">
            <div className="container-wrap">
                <div className="preview">
                    <div className="preview-part" onClick={()=>{setTab(1);setAutoList(charaAutoList); setValue(null)}}>
                        <div className="preview-img-part">
                            {selectedAvatars.map((avatar)=>(<img key={avatar.chara_id} src={avatar.img_url} alt=""/>))}
                            {selectedAvatars.length==0 && <img src='/assets/image/default-avatar.png'/>}
                        </div>
                        <div className={tab===1 ? "preview-title-part active" : "preview-title-part"}>
                            キャラ
                        </div>
                    </div>
                    <div className="preview-part" onClick={()=>{setTab(2); setAutoList(worldAutoList); setValue(null)}}>
                        <div className="preview-img-part">
                            <img src={selectedArea!=null ? selectedArea.img_url: "/assets/image/point-bg.png"} alt=""/>
                        </div>
                        <div className={tab===2 ? "preview-title-part active" : "preview-title-part"}>
                            世界
                        </div>
                    </div>
                </div>
                <div className="point-select">
                    <div className="point-search">
                    <form onSubmit={handleSubmit}>
                        <Autocomplete
                            value={value}
                            onChange={(event, newValue) => {
                                if (typeof newValue === "string") {
                                setValue({
                                    label: newValue
                                });
                                } else if (newValue && newValue.inputValue) {
                                setValue({
                                    label: newValue.inputValue
                                });
                                } else {
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
                            renderOption={(props, option) => <li {...props}>{option.label}</li>}
                            renderInput={(params) => <TextField {...params} label="" />}
                        />
                        <button className="search-btn">
                            <img src="/assets/image/point-search.png" alt=""/>
                        </button>
                    </form>
                    </div>
                    
                    <div className="point-body" style={{height: `calc(${height}px - 380px)`}}>
                        {
                            tab===1
                            && <div className="point-body-wrap">
                                {
                                    characterList.map((image, index)=>(
                                       
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
                                    worldList.map((area, index)=>(
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
            <div className="character-add-btn-part">
                <button onClick={handleOutline} className={`character-add-btn ${active ? "active" : ""}`} disabled={!active}>マぜる</button>
            </div>
        </div>
    )
}

export default Top;