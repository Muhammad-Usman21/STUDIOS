import LocationPicker from "../components/LocationPicker";
import FreeTimeSlots from "../components/FreeTime";
import DisplayMap from "../components/DisplayMap";
import ImageThumbnails from "../components/ImageThumnails";


const Home = () => {

    return (
        <div>
            <h1>Home</h1>
            <FreeTimeSlots />
            <LocationPicker />
            <DisplayMap />
            <ImageThumbnails />
        </div>
    )
}


export default Home;