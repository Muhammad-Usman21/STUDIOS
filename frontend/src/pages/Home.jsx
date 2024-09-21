import LocationPicker from "../components/LocationPicker";
import FreeTimeSlots from "../components/FreeTime";
import DisplayMap from "../components/DisplayMap";
import ImageThumbnails from "../components/ImageThumnails";


const Home = () => {

    return (
        <div className="h-[500vh]">
            <h1>Home</h1>
            <FreeTimeSlots />
            <LocationPicker />
            <DisplayMap />
            <ImageThumbnails />
        </div>
    )
}


export default Home;