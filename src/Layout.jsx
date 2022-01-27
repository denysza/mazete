
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top.jsx';
import Select from './pages/Select.jsx';
import Synopsis from './pages/Synopsis.jsx';
import Talk from './pages/Talk.jsx';
function Layout() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Top/>} />
                <Route path="/select" element={<Select/>} />
                <Route path="/synopsis" element={<Synopsis/>} />
                <Route path="/talk/:id" element={<Talk />} />
            </Routes>
        </Router>
    )
}
export default Layout;