import {useState, useEffect, useLayoutEffect} from 'react'
import axios from 'axios'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { saveAs } from 'file-saver';
import { useNavigate, useLocation } from "react-router-dom";
const baseurl = import.meta.env.REACT_APP_API_BASE_URL;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius:"10px",
    p: 4,
  };
function Movie() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [twittermessage, setTwitterMessage] = useState(location.state.message)
    const handleClose = ()=>{
        setOpen(false)
    }
    
    const handleTop = (e) =>{
        e.preventDefault();
        sessionStorage.removeItem("outline_id");
        sessionStorage.removeItem("background");
        sessionStorage.removeItem("user_list");
        navigate("/",{state: {}})
    }

    const handleDownload = () =>{
        saveAs(
                location.state.movie_url,
                "video"
            )
    }

    const handleShareTwitter = (envet) =>{
        let register_id =  sessionStorage.register_id || null;
        let data = JSON.stringify({
            "user_id":register_id,
            "message":twittermessage,
            "movie_url":location.state.movie_url
        });
        let config = {
            method: 'post',
            url: `${baseurl}/get_twitter_authenticate_url`,
            headers: { 
                'Content-Type': 'application/json'
            },
                data : data,
        };
        axios(config)
        .then((response) => {
            localStorage.setItem("background",sessionStorage.background);
            localStorage.setItem("outline_data",sessionStorage.outline_data);
            localStorage.setItem("outline_id",sessionStorage.outline_id);
            localStorage.setItem("register_id",sessionStorage.register_id);
            localStorage.setItem("user_list",sessionStorage.user_list);
            window.location.href = response.data.authenticate_url;
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
        <div className="container" id="movie">
            <div className="container-wrap">
                <div className="movie-header">
                    <div className="movie-header-title">
                       シェア
                    </div>
                </div>
                <div className="movie_area">        
                <div className="movie_box">
                    <span>動画</span>
                    <div className="movie_box_video">
                        <video id="talk_movie" src={location.state.movie_url} autoPlay muted controls></video>
                    </div>
                    <div className="flex_box">
                        <div className="share_box">
                            <a onClick={()=>{setOpen(true)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16">
                                    <path fill="#FFF" d="M20 1.896c-.737.32-1.526.537-2.356.637.847-.5 1.5-1.291 1.805-2.233-.793.462-1.67.8-2.606.98C16.093.491 15.024 0 13.846 0 11.58 0 9.744 1.808 9.744 4.037c0 .317.033.625.106.921-3.412-.166-6.438-1.775-8.46-4.22-.352.595-.555 1.291-.555 2.029 0 1.4.729 2.637 1.83 3.362-.677-.016-1.313-.2-1.864-.504v.05c0 1.958 1.416 3.587 3.293 3.958-.343.092-.708.142-1.08.142-.263 0-.522-.025-.772-.075.521 1.604 2.039 2.77 3.836 2.804-1.403 1.084-3.175 1.73-5.099 1.73-.33 0-.657-.021-.979-.059C1.81 15.333 3.967 16 6.281 16c7.557 0 11.685-6.154 11.685-11.492 0-.175-.005-.35-.013-.52.801-.571 1.496-1.28 2.047-2.092z"/>
                                </svg>
                                <span>ツイート</span>
                            </a>
                        </div>
                        <div className="download_box">
                            <a onClick={handleDownload}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22">
                                    <path fill="#FFF" d="M9.484 15.139c.264 0 .528-.098.791-.362l3.262-3.134c.176-.176.283-.372.283-.635 0-.508-.42-.86-.898-.86-.254 0-.498.098-.674.293l-1.27 1.348-.605.752.127-1.445v-9.98c0-.538-.45-1.007-1.016-1.007-.566 0-1.025.47-1.025 1.006v9.98l.127 1.446-.606-.752-1.27-1.348c-.175-.195-.419-.293-.673-.293-.488 0-.898.352-.898.86 0 .263.107.459.283.635l3.262 3.134c.263.264.527.362.8.362zm5.616 6.23c2.177 0 3.33-1.152 3.33-3.31V8.576c0-2.158-1.153-3.31-3.33-3.31H12.53v2.236h2.364c.84 0 1.308.43 1.308 1.318v9.004c0 .88-.469 1.309-1.308 1.309H4.025c-.85 0-1.298-.43-1.298-1.309V8.82c0-.888.449-1.318 1.298-1.318h2.403V5.266H3.82c-2.168 0-3.33 1.152-3.33 3.31v9.483c0 2.158 1.162 3.31 3.33 3.31H15.1z"/>
                                </svg>
                                <span>保存</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer_box">
                    <div className="recreate_box">
                        <div id="back_button_footer_talk" onClick={handleTop}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                <path fill="#999" fillRule="evenodd" d="M10 0c.828 0 1.5.672 1.5 1.5v7h7c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-7.001l.001 7c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5l-.001-7H1.5C.672 11.5 0 10.828 0 10s.672-1.5 1.5-1.5h7v-7C8.5.672 9.172 0 10 0z"/>
                            </svg>
                            <span>もう一度作る</span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <button className="back-to-btn" onClick={()=>{let user_list = sessionStorage.user_list || null; navigate("/",{state: {user_list:user_list}})}}><img src="/assets/image/back-to-img.png" alt="" /></button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box>
                        <textarea className='twitter-message' value={twittermessage} onChange={(e)=>{setTwitterMessage(e.target.value)}}></textarea>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        {/* <TwitterShareButton
                            title={"マゼて"}
                            url={twittermessage?.split("\n")[1]}
                        >                       
                            <div className="share-btn" on>
                                    <span>Twitterに投稿</span>
                            </div> 
                        </TwitterShareButton> */}
                         <div className="share-btn" onClick={handleShareTwitter}>
                            <span>Twitterに投稿</span>
                        </div> 
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}
export default Movie;