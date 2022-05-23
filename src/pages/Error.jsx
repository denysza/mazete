import {useState, useLayoutEffect} from 'react'
import {useLocation,useNavigate} from 'react-router-dom';
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
function Error() {
    const location = useLocation();
    const navigate = useNavigate();
    const [width, height] = useWindowSize();
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
                <div className="ls-main" style={{padding:"0px"}}>
                    <div className="flex-center position-ref full-width bg-white" style={{flexDirection:"column", height:"calc(100vh - 50px)"}}>
                        <div className="message" dangerouslySetInnerHTML={{ __html: location.state.message }}>
                        </div>
                        <div style={{marginTop:"30px"}}>
                            <button className="ls-main-making-btn active" onClick={()=>{let user_list = sessionStorage.user_list || null; navigate("/",{state: {user_list:user_list}})}} >トップに戻る</button>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
            <button className="back-to-btn" onClick={()=>{navigate(-1)}}><img src="/assets/image/back-to-img.png" alt="" /></button>
        </div>
    )
}

export default Error;