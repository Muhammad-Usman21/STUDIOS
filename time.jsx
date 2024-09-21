import React, { useEffect, useState } from "react";

const FreeTimeSlots = () => {
    const [freeSlots, setFreeSlots] = useState({});
    const [selectedDate, setSelectedDate] = useState("");
    const [filteredSlots, setFilteredSlots] = useState([]);

    useEffect(() => {
        const fetchFreeBusy = async () => {
            const response = await fetch("/api/calendar/freebusy");
            const data = await response.json();
            const busyTimes = data.calendars.primary.busy;
            const slots = getFreeTimeSlots(busyTimes);
            setFreeSlots(slots);
        };
        fetchFreeBusy();
    }, []);

    // Helper function to calculate free time slots for the next 7 days
    const getFreeTimeSlots = (busyTimes) => {
        const freeSlots = {};
        const startOfDay = new Date();
        startOfDay.setHours(8, 0, 0, 0); // Set start time to 8 AM

        const endOfDay = new Date();
        endOfDay.setHours(18, 0, 0, 0); // Set end time to 6 PM

        const timeSlots = generateTimeSlots(startOfDay, endOfDay);

        for (let day = 0; day < 14; day++) {
            const dateKey = new Date(
                startOfDay.getTime() + day * 24 * 60 * 60 * 1000
            ).toISOString().split("T")[0]; // Format date as YYYY-MM-DD


            const todaySlots = timeSlots.map((slot) => ({
                start: new Date(slot.start.getTime() + day * 24 * 60 * 60 * 1000),
                end: new Date(slot.end.getTime() + day * 24 * 60 * 60 * 1000),
            }));


            // Filter out slots that overlap with busy times
            const freeTime = todaySlots.filter((slot) => {
                return !busyTimes.some((busySlot) => {
                    const busyStart = new Date(busySlot.start);
                    const busyEnd = new Date(busySlot.end);

                    return busyStart < slot.end && busyEnd > slot.start;
                });
            });

            freeSlots[dateKey] = freeTime;
        }

        return freeSlots;
    };

    // Helper function to generate time slots for a day (8 AM to 6 PM)
    const generateTimeSlots = (start, end) => {
        const slots = [];
        let currentTime = new Date(start);
        const slotDuration = 30 * 60 * 1000; // 30 minutes per slot

        while (currentTime < end) {
            const nextTime = new Date(currentTime.getTime() + slotDuration);
            slots.push({ start: new Date(currentTime), end: new Date(nextTime) });
            currentTime = nextTime;
        }
        return slots;
    };

    // Handle date selection
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setSelectedDate(selectedDate);

        const today = new Date().toISOString().split("T")[0]; // Format today as YYYY-MM-DD

        let slots = freeSlots[selectedDate] || [];

        // If the selected date is today, filter out slots before the current time
        if (selectedDate === today) {
            const currentTime = new Date();
            slots = slots.filter((slot) => slot.start > currentTime);
        }

        setFilteredSlots(slots);
    };

    return (
        <div>
            <h2>Select a Date and Time</h2>

            {/* Date Dropdown */}
            <label>Date: </label>
            <select value={selectedDate} onChange={handleDateChange}>
                <option value="">Select a date</option>
                {Object.keys(freeSlots).map((date, index) => (
                    <option key={index} value={date}>
                        {new Date(date).toLocaleDateString()}
                    </option>
                ))}
            </select>

            {/* Time Slots Dropdown */}
            {selectedDate && filteredSlots.length > 0 ? (
                <>
                    <label>Time: </label>
                    <select>
                        {filteredSlots.map((slot, index) => (
                            <option key={index} value={slot.start}>
                                {slot.start.toLocaleTimeString()} - {slot.end.toLocaleTimeString()}
                            </option>
                        ))}
                    </select>
                </>
            ) : (
                selectedDate && <p>No free time slots available for this date.</p>
            )}
        </div>
    );
};

export default FreeTimeSlots;
