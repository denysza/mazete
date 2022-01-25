

function Top() {

    return(
        <div className="container">
            <div className="container-wrap">
                <div className="top-header">
                    <h1>マぜて</h1>
                </div>
                <div className="top-banner">
                    <img src="/assets/image/top-banner-img01.png" alt="" className="top-banner01"/>
                    <img src="/assets/image/top-banner-img02.png" alt="" className="top-banner02"/>
                    <img src="/assets/image/top-banner-img03.png" alt="" className="top-banner03"/>
                    <img src="/assets/image/top-banner-img04.png" alt="" className="top-banner04"/>
                    <div className="top-banner-text">
                        ※サービス内容伝わるイラスト外注
                    </div>
                </div>
                <a href="/select" className="start-btn">スタート</a>
                <div className="top-banner-border"></div>
                <div className="top-delusion">
                    <div className="top-delusion-title">
                        みんなの妄想
                    </div>
                    <div className="top-delusion-body">
                        <img src="/assets/image/top-delusion-img01.png" alt="" className="top-delusion-img"/>
                        <img src="/assets/image/top-delusion-img02.png" alt="" className="top-delusion-img"/>
                        <img src="/assets/image/top-delusion-img03.png" alt="" className="top-delusion-img"/>
                        <img src="/assets/image/top-delusion-img04.png" alt="" className="top-delusion-img"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Top;