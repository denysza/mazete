import {useState, useEffect} from 'react'
import axios from 'axios'
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;


function Top() {
    const [tab, setTab] = useState(1);
    const [selectedAvatars, setSelectedAvatas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [characterList, setCharacterList] = useState([]);
    const [worldList, setWorldList] = useState([]);

    useEffect(() => {
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


    },[]);



    const handleClickAvatar= (index)=>{
        let arvatars = selectedAvatars
        if(arvatars.includes(index)){
            for( let i = 0; i < arvatars.length; i++){ 
                                   
                if ( arvatars[i] === index) { 
                    arvatars.splice(i, 1); 
                    i--;
                }
            }
            setSelectedAvatas([...arvatars]);
        }
        else{
            if(arvatars.length<3)
            {
                arvatars.push(index);
                setSelectedAvatas([...arvatars]);
            }
        }
    }

    const handleOutline = () =>{
        let register_id =  localStorage.register_id || null;
        let data = JSON.stringify({
            "user_id":register_id,
            "chosen_chara_ids":selectedAvatars.toString(),
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
            localStorage.setItem("outline_id", response.data.outline_id);
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


    return(
        <div className="container" id="character_select">
            <div className="container-wrap">
                <div className="preview">
                    <div className="preview-part" onClick={()=>setTab(1)}>
                        <div className="preview-img-part">
                            {selectedAvatars.map((avatar_id)=>(<img key={avatar_id} src={characterList.filter(item=>(item.chara_id==avatar_id))[0].img_url} alt=""/>))}
                            {selectedAvatars.length==0 && <img src='/assets/image/default-avatar.png'/>}
                        </div>
                        <div className={tab===1 ? "preview-title-part active" : "preview-title-part"}>
                            キャラ
                        </div>
                    </div>
                    <div className="preview-part" onClick={()=>{setTab(2)}}>
                        <div className="preview-img-part">
                            <img src={selectedArea!=null ? worldList.filter((item)=>(item.world_id==selectedArea))[0].img_url: "/assets/image/point-bg.png"} alt=""/>
                        </div>
                        <div className={tab===2 ? "preview-title-part active" : "preview-title-part"}>
                            世界
                        </div>
                    </div>
                </div>
                <div className="point-select">
                    <div className="point-search">
                        <input type="text"/>
                        <button type="button" className="search-btn">
                            <img src="/assets/image/point-search.png" alt=""/>
                        </button>
                    </div>
                    <div className="point-body">
                        {
                            tab===1
                            && <div className="point-body-wrap">
                                {
                                    characterList.map((image, index)=>(
                                        <div onClick={()=>handleClickAvatar(image.chara_id)} key={index} className={`${selectedAvatars.includes(image.chara_id) ? "active" : ""} character-item`}>
                                            <img src={image.img_url} alt=""/>
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
                                        <div key={index} className={`${selectedArea==area.world_id? "active" : ""} location-item`} onClick={(e)=>{setSelectedArea(area.world_id)}}>
                                            <img src={area.img_url} alt=""/>
                                            <span></span>
                                        </div>
                                    ))
                                }
                                
                            </div>
                        }
                        <button onClick={handleOutline} className="character-add-btn">マぜる</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Top;