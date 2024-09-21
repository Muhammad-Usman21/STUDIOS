import FreeTimeSlots from "../components/FreeTime";


const Home = () => {
    const getFreeBusy = async () => {
        const response = await fetch("/api/calendar/freebusy");
        const data = await response.json();
        console.log(data);
    }

    return (
        <div>
            <h1>Home</h1>
            <button onClick={getFreeBusy}>Get Free Busy</button>
            <FreeTimeSlots />
        </div>
    )
}


export default Home;