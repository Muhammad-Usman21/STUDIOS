import LocationPicker from "../components/LocationPicker";
import FreeTimeSlots from "../components/FreeTime";
import DisplayMap from "../components/DisplayMap";


const Home = () => {

    return (
        <div className="h-[500vh]">
            <h1>Home</h1>
            <FreeTimeSlots />
            <LocationPicker />
            <DisplayMap />
        </div>
    )
}


export default Home;