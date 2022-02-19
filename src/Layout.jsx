
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Top from './pages/Top.jsx';
import Select from './pages/Select.jsx';
import Synopsis from './pages/Synopsis.jsx';
import Talk from './pages/Talk.jsx';
import Error from './pages/Error.jsx';
function Layout() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Select/>} />
                {/* <Route path="/select" element={<Select/>} /> */}
                <Route path="/synopsis" element={<Synopsis/>} />
                <Route path="/talk/:id" element={<Talk />} />
                <Route path="/error" element={<Error/>}/>
            </Routes>
        </Router>
    )
}
export default Layout;