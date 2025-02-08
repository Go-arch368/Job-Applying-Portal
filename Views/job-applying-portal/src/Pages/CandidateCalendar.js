import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCalendarInterviews } from "../redux/slices/jobapplySlice";

export default function CandidateCalendar() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCalendarInterviews());
    }, [dispatch]);

    const { interviews } = useSelector((state) => state.jobapplying);
    
    console.log("Fetched Interviews:", interviews); 

    
    const events = (interviews || []).map((interview, index) => ({
        id: index,
        title: "Interview",
        start: new Date(interview.date),
        extendedProps:{
            jobtitle:interview?.jobId?.jobtitle,
            companyname:interview?.jobId?.companyname,
            time:interview?.time,
            location:interview?.location,
        },
        allDay: true,
    }));

    console.log("Formatted Events for Calendar:", events); 

   
    const renderEventContent = (eventInfo) => {
        return (
            <div>
                <b className="font-medium">Interview Date:</b>
                <p>{eventInfo.event.start.toDateString()}</p>
                <p>{eventInfo.event.extendedProps.companyname}</p> 
            </div>
        );
    };


    const handleDateClick = (info) => {
         console.log(info)
        alert(`Schedule Interview on: ${info.dateStr,info?.companyname,info?.jobtitle,info.time,info.location}`);
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col  mt-6">
                <h2 className="text-xl font-semibold mb-4">Interview Schedule</h2>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={(info) => {
                        const { jobtitle, companyname , time,location} = info.event.extendedProps;  // ✅ Extract properties
                        alert(`Interview Date: ${info.event.start.toDateString()}
                        Job Title: ${jobtitle || "N/A"}
                        Company Name: ${companyname || "N/A"}
                        Time :${time||"N/A"}
                        Locatoin:${location||"N/A"}
                        `);
                    }}
                                      
                    eventContent={renderEventContent}
                    height="600px"
                />
            </div>
        </div>
    );
}
