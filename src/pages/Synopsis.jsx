import { useState, useEffect} from 'react'


function Synopsis() {
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState("ビルの屋上にあつめられたゴン達。\n\n利根川から鉄骨の上を渡って、向こうのビルへ行けたものに賞金がもらえると説明を受ける。\n\nゴン達はいかにしてこの危機を乗り越えるのか？")
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false)
        }, 1000)
        return () => clearTimeout(timeout)
      }, [loading])
    return(
        <div className="container" id="loading_synposis">
            <div className="container-wrap">
                <div className="ls-top editing">
                    <div className="ls-top-wrap">
                        <div className="ls-top-body">
                            <div className="ls-top-item">
                                <img src="./assets/image/character01.png" alt=""/>
                            </div>
                            <div className="ls-top-item">
                                <img src="./assets/image/character02.png" alt=""/>
                            </div>
                            <div className="ls-top-item">
                                <img src="./assets/image/character03.png" alt=""/>
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
                                <img src="./assets/image/white-loading.gif" alt=""/>
                                <span>下書き準備中</span>
                            </div>
                        }
                        {!loading &&
                            <textarea autoFocus className="ls-main-loading-wrap" value={data} disabled={!editable} onChange={(event)=>{setData(event.target.value)}} onBlur={()=>{setEditable(false)}}/>
                        }
                    </div>
                    {!editable && <div className="ls-main-edit-btn">
                        <a onClick={()=>{setEditable(true)}}><span>編集</span><img src="./assets/image/edit-icon.png" alt=""/></a>
                    </div>}
                    {!editable && <button onClick={()=>{console.log("asd")}}  className={loading ? "ls-main-making-btn" : "ls-main-making-btn active"} disabled={loading}>この世界線に入る</button>}
                </div>
            </div>
        </div>
    )
}

export default Synopsis;