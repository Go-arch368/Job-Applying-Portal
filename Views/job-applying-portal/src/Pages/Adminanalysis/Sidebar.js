// Sidebar.jsx
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-800 text-white p-5 h-screen fixed left-0 top-0">
            <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
            <ul>
                <li className="mb-3"><Link to="/admin/total-candidates" className="block p-2 hover:bg-gray-700">Total Candidates</Link></li>
                <li className='mb-3'><Link  to="/admin/total-recruiters" className='block p-2 hover:bg-gray-700'>Total Recruiters</Link></li>
                <li className='mb-3'><Link to="/admin/application-status" className='block p-2 hover:bg-gray-700'>Application Status</Link></li>
                <li className="mb-3"><Link to="/admin/active-recruiters" className="block p-2 hover:bg-gray-700">Active Recruiters</Link></li>
                <li className="mb-3"><Link to="/admin/total-jobs" className="block p-2 hover:bg-gray-700">Total Jobs</Link></li>
                <li className="mb-3"><Link to="/admin/top-applicants" className="block p-2 hover:bg-gray-700">Top Applicants</Link></li>
            </ul>
        </div>
    );
}
