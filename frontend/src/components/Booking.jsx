import { useEffect } from "react";

const Booking = ({ calendarUrl, price }) => {
	// Get the current theme from the Redux store
	useEffect(() => {
		// Load the Google Calendar Scheduling script
		const script = document.createElement("script");
		script.src =
			"https://calendar.google.com/calendar/scheduling-button-script.js";
		script.async = true;

		const link = document.createElement("link");
		link.href =
			"https://calendar.google.com/calendar/scheduling-button-script.css";
		link.rel = "stylesheet";

		document.head.appendChild(link);
		document.head.appendChild(script);

		// Add the scheduling button after the script loads
		script.onload = () => {
			if (window.calendar && window.calendar.schedulingButton) {
				window.calendar.schedulingButton.load({
					url: calendarUrl,
					color: "#039BE5",
					label: `Reservar una cita ($${price}/hora)`,
					target: document.getElementById("appointment-button"),
				});
			}
		};

		// Cleanup the script and link on component unmount
		return () => {
			document.head.removeChild(script);
			document.head.removeChild(link);
		};
	}, []);

	return <div id="appointment-button"></div>;
};

export default Booking;
