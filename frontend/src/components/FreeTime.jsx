import React, { useState, useEffect } from "react";

const CalendarComponent = () => {
    const [freeBusyData, setFreeBusyData] = useState({});
    const [selectedDate, setSelectedDate] = useState("");
    const [availableStartTimes, setAvailableStartTimes] = useState([]);
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [availableEndTimes, setAvailableEndTimes] = useState([]);

    // Function to get next 14 days
    const getNext14Days = () => {
        const days = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
            days.push(date.toISOString().split("T")[0]); // Format to yyyy-mm-dd
        }
        return days;
    };

    // Fetch free/busy data on component mount
    useEffect(() => {
        const fetchFreeBusy = async () => {
            const response = await fetch("/api/calendar/freebusy");
            const data = await response.json();
            console.log(data);
            const busyTimes = data.calendars.primary.busy;
            console.log(busyTimes);
            setFreeBusyData(busyTimes);
        };
        fetchFreeBusy();
    }, []);

    // Handle date selection
    const handleDateChange = (e) => {
        const selected = e.target.value;
        setSelectedDate(selected);

        // Calculate available start times for the selected date
        const busyTimes = freeBusyData.filter((slot) => {
            return slot.start.startsWith(selected);
        });


        const times = getAvailableTimesForDay(busyTimes, selected);
        setAvailableStartTimes(times);
        setSelectedStartTime(""); // Reset start time on date change
    };

    // Handle start time selection
    const handleStartTimeChange = (e) => {
        const selected = e.target.value;
        setSelectedStartTime(selected);

        // Calculate available end times based on start time
        const busyTimes = freeBusyData.filter((slot) => {
            return slot.start.startsWith(selectedDate);
        });

        console.log(busyTimes);
        const times = getAvailableEndTimes(busyTimes, selected);
        setAvailableEndTimes(times);
    };

    // Helper function to generate time slots (e.g., 9:00 AM to 5:00 PM)
    const getAvailableTimesForDay = (busyTimes, selectedDate) => {
        const times = [];
        const startOfDay = new Date(`${selectedDate}T09:00:00`);
        const endOfDay = new Date(`${selectedDate}T17:00:00`);
        const now = new Date();

        for (let time = startOfDay; time <= endOfDay; time.setMinutes(time.getMinutes() + 30)) {
            if(time < now && selectedDate === now.toISOString().split("T")[0]){
                continue;
            }
            const isBusy = busyTimes.some((slot) => {
                const busyStart = new Date(slot.start);
                const busyEnd = new Date(slot.end);

                return time >= busyStart && time < busyEnd;
            });

            if (!isBusy) {
                times.push(new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }
        }
        return times;
    };

    // Helper function to get end times based on selected start time
    const getAvailableEndTimes = (busyTimes, startTime) => {
        const convertTo24HourFormat = (time12h) => {
            const [time, modifier] = time12h.split(' '); // Split into "2:00" and "PM"
            let [hours, minutes] = time.split(':');      // Split "2:00" into hours and minutes

            if (hours === '12') {
                hours = modifier === 'AM' ? '00' : '12';   // Convert "12 AM" to "00" and "12 PM" stays "12"
            } else if (modifier === 'PM') {
                hours = String(+hours + 12);               // Convert PM hours to 24-hour format
            }

            return `${hours}:${minutes}`;                // Return the time in "HH:MM" format
        };

        const times = [];
        const start = new Date(`${selectedDate}T${convertTo24HourFormat(startTime)}`);
        const endOfDay = new Date(`${selectedDate}T17:00:00`);

        start.setMinutes(start.getMinutes() + 30); // Add 30 minutes to the start time

        for (let time = new Date(start); time <= endOfDay; time.setMinutes(time.getMinutes() + 30)) {
            const isBusy = busyTimes.some((slot) => {
                const busyStart = new Date(slot.start);
                const busyEnd = new Date(slot.end);
                console.log(busyStart);
                console.log(busyEnd);
                console.log(time);
                console.log(time > busyStart && time <= busyEnd);
                return time > busyStart && time <= busyEnd;
            });

            if (!isBusy) {
                times.push(new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }
            if (isBusy) {
                break;
            }
        }
        return times;
    };

    return (
        <div>
            <h2>Book a Meeting</h2>

            {/* Date Dropdown */}
            <label htmlFor="date">Select Date:</label>
            <select id="date" value={selectedDate} onChange={handleDateChange}>
                <option value="">--Select Date--</option>
                {getNext14Days().map((date) => (
                    <option key={date} value={date}>
                        {date}
                    </option>
                ))}
            </select>

            {/* Start Time Dropdown */}
            {selectedDate && (
                <>
                    <label htmlFor="startTime">Select Start Time:</label>
                    <select id="startTime" value={selectedStartTime} onChange={handleStartTimeChange}>
                        <option value="">--Select Start Time--</option>
                        {availableStartTimes.map((time, index) => (
                            <option key={index} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {/* End Time Dropdown */}
            {selectedStartTime && (
                <>
                    <label htmlFor="endTime">Select End Time:</label>
                    <select id="endTime">
                        <option value="">--Select End Time--</option>
                        {availableEndTimes.map((time, index) => (
                            <option key={index} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );
};

export default CalendarComponent;
