import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [jobtitle, setJobtitle] = useState("");
    const [location, setLocation] = useState("");

    const navigate = useNavigate();

    const toggleLogin = () => {
        setIsLoginOpen(!isLoginOpen);
        setIsRegisterOpen(false);
    };

    const toggleRegister = () => {
        setIsRegisterOpen(!isRegisterOpen);
        setIsLoginOpen(false);
    };

    const handleSearch = () => {
        if (jobtitle.trim() || location.trim()) { // Ensures at least one field is filled
            navigate(`/searchJobs?jobtitle=${encodeURIComponent(jobtitle)}&location=${encodeURIComponent(location)}`);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">JobFinder</h1>
                    <div>
                        <button onClick={toggleLogin} className="text-gray-700 px-4">Login</button>
                        <button onClick={toggleRegister} className="bg-blue-600 text-white px-4 py-2 rounded">
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search Section */}
            <section className="text-center py-20 bg-blue-50">
                <h2 className="text-4xl font-bold text-gray-800">Find Your Dream Job</h2>
                <p className="text-gray-600 mt-4">Thousands of jobs at top companies, just for you.</p>

                <div className="mt-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Job title, keyword..."
                        className="p-3 border rounded-l-md w-1/3"
                        value={jobtitle}
                        onChange={(e) => setJobtitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="City, state, or zip"
                        className="p-3 border w-1/3"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-r-md" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 container mx-auto text-center">
                <h3 className="text-3xl font-semibold text-gray-800">How It Works</h3>
                <div className="mt-8 flex justify-center space-x-8">
                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <h4 className="text-lg font-semibold">1. Create an Account</h4>
                        <p className="text-gray-600">Sign up for free and create your profile.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <h4 className="text-lg font-semibold">2. Apply for Jobs</h4>
                        <p className="text-gray-600">Search and apply for jobs that fit your skills.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <h4 className="text-lg font-semibold">3. Get Hired</h4>
                        <p className="text-gray-600">Connect with top recruiters and land your dream job.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gray-200 py-16 text-center">
                <h3 className="text-3xl font-semibold text-gray-800">What People Say</h3>
                <p className="text-gray-600 mt-4">Success stories from our users</p>
                <div className="mt-6 flex justify-center space-x-8">
                    <div className="p-6 bg-white shadow-lg rounded-lg w-1/3">
                        <p className="text-gray-600">"I found my dream job in just two weeks!"</p>
                        <h5 className="text-blue-600 font-semibold mt-2">- Sarah L.</h5>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg w-1/3">
                        <p className="text-gray-600">"Best platform for job seekers!"</p>
                        <h5 className="text-blue-600 font-semibold mt-2">- Mark T.</h5>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-6">
                <p>© 2025 JobFinder. All Rights Reserved.</p>
            </footer>

            {/* Modals */}
            {isLoginOpen && <Login onClose={toggleLogin} />}
            {isRegisterOpen && <Register onClose={toggleRegister} />}
        </div>
    );
};

export default Home;
