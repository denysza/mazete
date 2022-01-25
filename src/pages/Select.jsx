import { useState} from 'react'

const images = [
    "/assets/image/character01.png",
    "/assets/image/character02.png",
    "/assets/image/character03.png",
    "/assets/image/character04.png",
    "/assets/image/character02.png",
    "/assets/image/character01.png",
    "/assets/image/character04.png",
    "/assets/image/character03.png",
    "/assets/image/character01.png",
    "/assets/image/character01.png",
    "/assets/image/character04.png",
    "/assets/image/character03.png",
    "/assets/image/character02.png",
    "/assets/image/character01.png",
    "/assets/image/character03.png",
    "/assets/image/character04.png",
    "/assets/image/character01.png",
    "/assets/image/character02.png",
    "/assets/image/character04.png",
    "/assets/image/character01.png"
]

const areas = [
    "/assets/image/location01.png",
    "/assets/image/location02.png",
    "/assets/image/location03.png",
    "/assets/image/location02.png",
    "/assets/image/location03.png",
    "/assets/image/location01.png",
    "/assets/image/location02.png",
    "/assets/image/location03.png",
    "/assets/image/location01.png",
    "/assets/image/location01.png",
    "/assets/image/location02.png",
    "/assets/image/location01.png",
    "/assets/image/location03.png",
    "/assets/image/location01.png",
    "/assets/image/location02.png",
    "/assets/image/location03.png",

]

function Top() {
    const [tab, setTab] = useState(1);
    const [selectedAvatars, setSelectedAvatas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);

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


    return(
        <div className="container" id="character_select">
            <div className="container-wrap">
                <div className="preview">
                    <div className="preview-part" onClick={()=>setTab(1)}>
                        <div className="preview-img-part">
                            {selectedAvatars.map((avatar)=>(<img key={avatar} src={images[avatar]} alt=""/>))}
                            {selectedAvatars.length==0 && <img src='/assets/image/default-avatar.png'/>}
                        </div>
                        <div className={tab===1 ? "preview-title-part active" : "preview-title-part"}>
                            キャラ
                        </div>
                    </div>
                    <div className="preview-part" onClick={()=>{setTab(2)}}>
                        <div className="preview-img-part">
                            <img src={selectedArea!=null ? areas[selectedArea] : "/assets/image/point-bg.png"} alt=""/>
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
                                    images.map((image, index)=>(
                                        <div onClick={()=>handleClickAvatar(index)} key={index} className={`${selectedAvatars.includes(index) ? "active" : ""} character-item`}>
                                            <img src={image} alt=""/>
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
                                    areas.map((area, index)=>(
                                        <div key={index} className={`${selectedArea==index? "active" : ""} location-item`} onClick={(e)=>{setSelectedArea(index)}}>
                                            <img src={area} alt=""/>
                                            <span></span>
                                        </div>
                                    ))
                                }
                                
                            </div>
                        }
                        <a href="/synopsis" className="character-add-btn">マぜる</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Top;