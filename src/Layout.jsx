
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Select from './pages/Select.jsx';
import Synopsis from './pages/Synopsis.jsx';
import Talk from './pages/Talk.jsx';
import Error from './pages/Error.jsx';
import Movie from './pages/Movie.jsx';
import UploadTwitter from './pages/UploadTwitter.jsx';

function Layout() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Select/>} />
                <Route path="/synopsis" element={<Synopsis/>} />
                <Route path="/talk/:id" element={<Talk />} />
                <Route path="/movie" element={<Movie/>}/>
                <Route path="/movie/upload_twitter" element={<UploadTwitter/>}/>
                <Route path="/error" element={<Error/>}/>
            </Routes>
        </Router>
    )
}
export default Layout;