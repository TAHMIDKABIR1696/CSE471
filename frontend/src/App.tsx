import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './views/components/Navbar'
import Footer from './views/components/Footer'
import HomePageView from './views/pages/HomePageView'
import ConsultPageView from './views/pages/ConsultPageView'

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePageView />} />
                        <Route path="/consult" element={<ConsultPageView />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
