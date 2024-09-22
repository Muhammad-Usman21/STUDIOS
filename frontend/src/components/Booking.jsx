import { Alert, Button, Label, Select, Spinner, Textarea, TextInput } from "flowbite-react";
import { MdCancelPresentation } from "react-icons/md";
import { useEffect, useState } from "react";

const Booking = ({ userId, studio }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        note: "",
    });
    const [freeBusyData, setFreeBusyData] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableStartTimes, setAvailableStartTimes] = useState([]);
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [availableEndTimes, setAvailableEndTimes] = useState([]);
    const [selectedEndTime, setSelectedEndTime] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchFreeBusy = async () => {
        const date = new Date();
        console.log(userId);
        const response = await fetch(`/api/booking/freebusy?date=${date.toISOString()}&userId=${userId}`);
        const data = await response.json();
        const busyTimes = data.calendars.primary.busy;
        setFreeBusyData(busyTimes);
    };
    useEffect(() => {
        if (freeBusyData == null) {
            fetchFreeBusy();
        }
    }, [freeBusyData]);

    const getNext14Days = () => {
        const days = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
            const day = date.toLocaleDateString("en-US", { weekday: "long" });
            const workingDay = studio.week[day.toLowerCase()];
            if (!workingDay || !workingDay.working) {
                continue;
            }
            days.push(date.toISOString().split("T")[0]); // Format to yyyy-mm-dd
        }
        return days;
    };

    const handleDateChange = (e) => {
        const selected = e.target.value;
        setSelectedDate(selected);

        // Calculate available start times for the selected date
        const busyTimes = freeBusyData.filter((slot) => slot.start.startsWith(selected));
        const times = getAvailableTimesForDay(busyTimes, selected);
        setAvailableStartTimes(times);
        setSelectedStartTime(""); // Reset start time on date change
        setAvailableEndTimes([]); // Reset end time options
    };

    const handleStartTimeChange = (e) => {
        const selected = e.target.value;
        setSelectedStartTime(selected);

        // Calculate available end times based on start time
        const busyTimes = freeBusyData.filter((slot) => slot.start.startsWith(selectedDate));
        const times = getAvailableEndTimes(busyTimes, selected);
        setAvailableEndTimes(times);
        setSelectedEndTime(""); // Reset end time on start time change
    };

    const getAvailableTimesForDay = (busyTimes, selectedDate) => {
        const times = [];
        const startOfDay = new Date(`${selectedDate}T09:00:00`);
        const endOfDay = new Date(`${selectedDate}T17:00:00`);
        const now = new Date();

        for (let time = startOfDay; time <= endOfDay; time.setMinutes(time.getMinutes() + 30)) {
            if (time < now && selectedDate === now.toISOString().split("T")[0]) {
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

    // Helper function to get end times based on selected start time
    const getAvailableEndTimes = (busyTimes, startTime) => {


        const times = [];
        const start = new Date(`${selectedDate}T${convertTo24HourFormat(startTime)}`);
        const endOfDay = new Date(`${selectedDate}T17:00:00`);

        start.setMinutes(start.getMinutes() + 30); // Add 30 minutes to the start time

        for (let time = new Date(start); time <= endOfDay; time.setMinutes(time.getMinutes() + 30)) {
            const isBusy = busyTimes.some((slot) => {
                const busyStart = new Date(slot.start);
                const busyEnd = new Date(slot.end);
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


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedStartTime || !selectedEndTime || !formData.name || !formData.email) {
            setErrorMessage("Please fill in all the required fields");
            return;
        }

        if (!formData.email.includes("@") || !formData.email.includes(".")) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        // setLoading(true);
        // Convert selectedDate and times to UTC
        const startDateTime = new Date(`${selectedDate}T${convertTo24HourFormat(selectedStartTime)}`);
        const endDateTime = new Date(`${selectedDate}T${convertTo24HourFormat(selectedEndTime)}`);

        // Prepare the event details for booking
        const details = {
            userId,
            title: studio.title,
            address: studio.address + ", " + studio.city,
            image: studio.images[0].url,
            description: studio.description,
            name: formData.name,
            email: formData.email,
            note: formData.note,
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
        };

        console.log("Booking details:", details);

        try {
            const response = await fetch("/api/booking/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });

            if (!response.ok) {
                throw new Error("Failed to book the meeting");
            }

            const data = await response.json();
            console.log("Booking successful:", data);
        } catch (error) {
            console.error("Error during booking:", error);
            setErrorMessage("There was an issue booking the meeting. Please try again.");
        }
        finally {
            setFormData({
                name: "",
                email: "",
                description: "",
            });
            setSelectedDate("");
            setSelectedStartTime("");
            setSelectedEndTime("");
            // setLoading(false);
            setErrorMessage(null);
            setFreeBusyData(null);
        }
    };


    return (
        <div className="min-h-screen w-full">
            <div
                className="flex p-5 md:p-10 max-w-2xl mx-5 sm:mx-10 md:mx-20 lg:mx-auto flex-col md:flex-row md:items-center gap-10
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
                <div className="flex-1 md:px-5">
                    <form
                        className={`flex flex-col gap-3 justify-center`}
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-1">
                            <Label value="Your name" />
                            <TextInput
                                type="text"
                                placeholder="Nombre"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label value="Tu correo electrónico" />
                            <TextInput
                                type="email"
                                placeholder="name@company.com"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {freeBusyData != null ? (
                            <>
                                <div className="flex flex-col gap-1">
                                    <Label value="Select Date" />
                                    <Select id="date" value={selectedDate} onChange={handleDateChange} disabled={freeBusyData == null}>
                                        <option value="">--Select Date--</option>
                                        {getNext14Days().map((date) => (
                                            <option key={date} value={date}>
                                                {date}-{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label value="Select Start Time" />
                                    <Select id="startTime" value={selectedStartTime} onChange={handleStartTimeChange} disabled={freeBusyData == null}>
                                        <option value="">--Select Start Time--</option>
                                        {availableStartTimes.map((time, index) => (
                                            <option key={index} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label value="Select End Time" />
                                    <Select id="endTime" value={selectedEndTime} onChange={(e) => setSelectedEndTime(e.target.value)} disabled={freeBusyData == null}>
                                        <option value="">--Select End Time--</option>
                                        {availableEndTimes.map((time, index) => (
                                            <option key={index} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-1 w-full items-center">
                                <Spinner size="lg" />
                            </div>
                        )}


                        <div className="flex flex-col gap-1">
                            <Label value="Note (Optinal)" />
                            <Textarea
                                id="note"
                                className="mb-2"
                                rows="4"
                                placeholder="Write a note here..."
                                value={formData.note}
                                onChange={handleChange}
                            />
                        </div>
                        <Button
                            gradientDuoTone="purpleToBlue"
                            type="submit"
                            className="uppercase focus:ring-1 mt-1"
                            disabled={loading || errorMessage}>
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-3">Cargando...</span>
                                </>
                            ) : (
                                "Reservar"
                            )}
                        </Button>
                    </form>
                    {errorMessage && (
                        <div className="flex items-center gap-1 mt-4">
                            <Alert className="flex-auto" color="failure" withBorderAccent>
                                <div className="flex justify-between">
                                    <span>{errorMessage}</span>
                                    <span className="w-5 h-5">
                                        <MdCancelPresentation
                                            className="cursor-pointer w-6 h-6"
                                            onClick={() => setErrorMessage(null)}
                                        />
                                    </span>
                                </div>
                            </Alert>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Booking;