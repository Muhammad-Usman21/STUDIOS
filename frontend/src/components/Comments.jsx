import { useEffect } from 'react';

const Comments = () => {
  useEffect(() => {
    // Load the Google Calendar Scheduling script
    const script = document.createElement('script');
    script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
    script.async = true;

    const link = document.createElement('link');
    link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
    link.rel = 'stylesheet';

    document.head.appendChild(link);
    document.head.appendChild(script);

    // Add the scheduling button after the script loads
    script.onload = () => {
      if (window.calendar && window.calendar.schedulingButton) {
        window.calendar.schedulingButton.load({
          url: 'https://calendar.app.google/1pWttyWb462xnBpL8',
          color: '#039BE5',
          label: 'Book an appointment',
          target: document.getElementById('appointment-button'),
        });
      }
    };

    // Cleanup the script and link on component unmount
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div className="flex p-5 md:p-10 max-w-2xl mx-5 sm:mx-10 md:mx-20 lg:mx-auto flex-col md:items-center gap-10
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
        <p>Comments</p>
        {/* This is where the Google Calendar appointment button will appear */}
        <div id="appointment-button"></div>
      </div>
    </div>
  );
};

export default Comments;
