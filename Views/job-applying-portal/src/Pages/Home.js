import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaUserCheck, FaHandshake, FaStar, FaRocket, FaShieldAlt } from "react-icons/fa";

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
        if (!jobtitle.trim() && !location.trim()) {
            alert("Please fill at least one field");
            return;
        }
        if (jobtitle.trim() || location.trim()) {
            navigate(`/searchJobs?jobtitle=${encodeURIComponent(jobtitle)}&location=${encodeURIComponent(location)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold gradient-text cursor-pointer" onClick={() => navigate("/")}>
                        ✦ JobFinder
                    </h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleLogin}
                            className="px-5 py-2.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                        >
                            Login
                        </button>
                        <button
                            onClick={toggleRegister}
                            className="btn-primary-gradient px-5 py-2.5 text-sm font-semibold rounded-xl"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

                <div className="relative max-w-5xl mx-auto px-6 text-center">
                    <div className="animate-fadeInUp">
                        <span className="inline-block badge badge-indigo mb-6 text-sm px-4 py-2">
                            <FaRocket className="inline mr-2" /> #1 Job Portal for Top Talent
                        </span>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            Find Your <span className="gradient-text">Dream Job</span><br />Today
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
                            Discover thousands of opportunities at leading companies. Connect with top recruiters and land the career you've always wanted.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="animate-fadeInUp max-w-3xl mx-auto" style={{animationDelay: '0.2s'}}>
                        <div className="glass-card rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Job title, keyword, or company"
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all"
                                    value={jobtitle}
                                    onChange={(e) => setJobtitle(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                            </div>
                            <div className="relative flex-1">
                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="City, state, or remote"
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                            </div>
                            <button
                                className="btn-primary-gradient px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
                                onClick={handleSearch}
                            >
                                <FaSearch /> Search
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">
                            Popular: <span className="text-indigo-500 cursor-pointer hover:underline" onClick={() => { setJobtitle("Developer"); }}>Developer</span>,{" "}
                            <span className="text-indigo-500 cursor-pointer hover:underline" onClick={() => { setJobtitle("MERN"); }}>MERN</span>,{" "}
                            <span className="text-indigo-500 cursor-pointer hover:underline" onClick={() => { setJobtitle("Full Stack"); }}>Full Stack</span>,{" "}
                            <span className="text-indigo-500 cursor-pointer hover:underline" onClick={() => { setJobtitle("Python"); }}>Python</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-6">
                <div className="glass-card rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { num: "10K+", label: "Active Jobs", color: "text-indigo-600" },
                        { num: "500+", label: "Companies", color: "text-purple-600" },
                        { num: "50K+", label: "Candidates", color: "text-pink-600" },
                        { num: "98%", label: "Satisfaction", color: "text-emerald-600" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.num}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="badge badge-indigo mb-4">How It Works</span>
                    <h3 className="text-3xl font-bold text-gray-900 mt-4">Get Hired in 3 Simple Steps</h3>
                    <p className="text-gray-500 mt-3 max-w-lg mx-auto">Our streamlined process makes job searching effortless and efficient.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: <FaUserCheck size={28} />, title: "Create Profile", desc: "Sign up and build your professional profile with skills and experience.", color: "from-indigo-500 to-indigo-600", num: "01" },
                        { icon: <FaSearch size={28} />, title: "Search & Apply", desc: "Browse through thousands of jobs and apply with just one click.", color: "from-purple-500 to-purple-600", num: "02" },
                        { icon: <FaHandshake size={28} />, title: "Get Hired", desc: "Connect with recruiters, ace your interview, and land your dream job.", color: "from-pink-500 to-pink-600", num: "03" },
                    ].map((step, i) => (
                        <div key={i} className="relative group card-hover bg-white rounded-2xl p-8 border border-gray-100">
                            <span className="absolute top-6 right-6 text-5xl font-bold text-gray-100 group-hover:text-indigo-100 transition-colors">{step.num}</span>
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center mb-6`}>
                                {step.icon}
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                            <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge bg-white/10 text-indigo-300 mb-4">Testimonials</span>
                        <h3 className="text-3xl font-bold text-white mt-4">What People Say</h3>
                        <p className="text-gray-400 mt-3">Success stories from our community</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { quote: "Found my dream job at Google within two weeks! The search features are incredibly powerful.", name: "Sarah L.", role: "Software Engineer", stars: 5 },
                            { quote: "Best platform for tech job seekers. The UI is clean and the job matching is spot-on.", name: "Mark T.", role: "Product Manager", stars: 5 },
                            { quote: "As a recruiter, I love how easy it is to find qualified candidates. Highly recommend!", name: "Jessica R.", role: "HR Manager", stars: 5 },
                        ].map((t, i) => (
                            <div key={i} className="card-hover bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(t.stars)].map((_, j) => <FaStar key={j} className="text-yellow-400" size={14} />)}
                                </div>
                                <p className="text-gray-300 leading-relaxed mb-6">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{t.name}</p>
                                        <p className="text-gray-400 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="badge badge-indigo mb-4">Why Choose Us</span>
                    <h3 className="text-3xl font-bold text-gray-900 mt-4">Built for Modern Job Seekers</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <FaSearch />, title: "Smart Search", desc: "AI-powered job matching" },
                        { icon: <FaShieldAlt />, title: "Verified Jobs", desc: "All listings are verified" },
                        { icon: <FaRocket />, title: "Fast Apply", desc: "One-click applications" },
                        { icon: <FaStar />, title: "Top Companies", desc: "500+ trusted employers" },
                    ].map((f, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl hover:bg-indigo-50 transition-all duration-300 group cursor-default">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                {f.icon}
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">{f.title}</h4>
                            <p className="text-sm text-gray-500">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                    <div className="relative">
                        <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
                        <p className="text-white/80 mb-8 max-w-lg mx-auto">Join thousands of professionals who found their perfect career through JobFinder.</p>
                        <button onClick={toggleRegister} className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:shadow-xl hover:-translate-y-1">
                            Create Free Account
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h1 className="text-xl font-bold text-white">✦ <span className="text-indigo-400">JobFinder</span></h1>
                        <p className="text-gray-500 text-sm">© 2026 JobFinder. All Rights Reserved. Built with ❤️</p>
                    </div>
                </div>
            </footer>

            {isLoginOpen && <Login onClose={toggleLogin} />}
            {isRegisterOpen && <Register onClose={toggleRegister} />}
        </div>
    );
};

export default Home;
