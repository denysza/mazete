import { useState, useEffect} from 'react'


function Talk() {
    
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false)
        }, 1000)
        return () => clearTimeout(timeout)
      }, [loading])

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
                        <div className="as-thumb">
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