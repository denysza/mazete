
import {useLocation} from 'react-router-dom';

function Error() {
    const location = useLocation();
    console.log(location)
    return(
        <div className="flex-center position-ref full-height full-width bg-white">
            <div className="message" style={{padding: "10px"}} dangerouslySetInnerHTML={{ __html: location.state.message }}>
            </div>
        </div>
    )
}

export default Error;