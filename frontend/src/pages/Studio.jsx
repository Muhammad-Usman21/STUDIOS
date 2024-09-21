import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import Booking from "../components/Booking";
import StudioDetails from "../components/StudioDetails";

const Studio = () => {
    const { id } = useParams();
    const [studio, setStudio] = useState(null);
    const [activeTab, setActiveTab] = useState("details"); // Track active tab

    useEffect(() => {
        const fetchStudio = async () => {
            const response = await fetch(`/api/studio/${id}`);
            const data = await response.json();
            setStudio(data);
        };
        fetchStudio();
    }, [id]);

    return (
        <div className="min-h-screen w-full">
            <div className="max-w-7xl mx-3 sm:mx-5 lg:mx-auto items-center justify-center flex flex-col gap-12 lg:gap-24 my-10 lg:my-24">
                {studio ? (
                    <>
                        {/* Studio Header */}
                        <div className="flex flex-col gap-5">
                            <img
                                src={studio.images[0].url}
                                alt={studio.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                            <h1 className="text-2xl lg:text-4xl font-bold text-center">{studio.title}</h1>
                            <p className="text-lg lg:text-xl">{studio.description}</p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="w-full flex justify-center mt-10">
                            <div className="border-b-2 border-gray-300 flex">
                                <button
                                    className={`px-5 py-2 text-lg font-semibold transition-colors duration-200 ${
                                        activeTab === "details" ? "border-b-4 border-blue-500" : "text-gray-500"
                                    }`}
                                    onClick={() => setActiveTab("details")}
                                >
                                    Details
                                </button>
                                <button
                                    className={`px-5 py-2 text-lg font-semibold transition-colors duration-200 ${
                                        activeTab === "booking" ? "border-b-4 border-blue-500" : "text-gray-500"
                                    }`}
                                    onClick={() => setActiveTab("booking")}
                                >
                                    Booking
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="w-full">
                            {activeTab === "details" && <StudioDetails studio={studio} />}
                            {activeTab === "booking" && <Booking userId={studio.userId._id} title={studio.title} />}
                        </div>
                    </>
                ) : (
                    <div className="self-center">
                        <Spinner size="lg" />
                        <span className="pl-3">Cargando...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Studio;
