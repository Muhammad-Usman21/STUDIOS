import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import Booking from "../components/Booking";
import StudioDetails from "../components/StudioDetails";
import Portfolio from "../components/Portfolio";
import Comments from "../components/Comments";

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
    console.log(studio);

    return (
        <div className="min-h-screen w-full">
            <div className="max-w-7xl mx-3 sm:mx-5 lg:mx-auto items-center justify-center flex flex-col gap-4 lg:gap-24 my-10 lg:my-24">
                {studio ? (
                    <>
                        <div className="flex flex-col gap-5">
                            <img
                                src={studio.images[0].url}
                                alt={studio.name}
                                className="w-full h-96 object-cover rounded-lg min-w-[300px] mx-auto"
                            />
                            <h1 className="text-2xl lg:text-4xl font-bold text-center">{studio.title}</h1>
                            <p className="text-lg lg:text-xl">{studio.description}</p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="w-full flex justify-center mt-4">
                            <div className="flex gap-12">
                                <button
                                    className={`px-5 py-2 text-lg font-semibold transition-colors duration-200 bg-slate-400 rounded-3xl ${activeTab === "booking" ? "border-b-4 border-blue-500" : "text-gray-500"
                                        }`}
                                    onClick={() => setActiveTab("booking")}
                                >
                                    Booking
                                </button>
                                <button
                                    className={`px-5 py-2 text-lg font-semibold transition-colors duration-200 bg-slate-400 rounded-3xl ${activeTab === "portfolio" ? "border-b-4 border-blue-500" : "text-gray-500"
                                        }`}
                                    onClick={() => setActiveTab("comments")}
                                >
                                    Comments
                                </button>
                                <button
                                    className={`px-5 py-2 text-lg font-semibold transition-colors duration-200 bg-slate-400 rounded-3xl ${activeTab === "portfolio" ? "border-b-4 border-blue-500" : "text-gray-500"
                                        }`}
                                    onClick={() => setActiveTab("portfolio")}
                                >
                                    Portfolio
                                </button>
                                <button
                                    className={`px-5 py-2 text-lg font-semibold transition-colors duration-200 bg-slate-400 rounded-3xl ${activeTab === "details" ? "border-b-4 border-blue-500" : "text-gray-500"
                                        }`}
                                    onClick={() => setActiveTab("details")}
                                >
                                    Details
                                </button>


                            </div>
                        </div>

                        <div className="w-full">
                            {activeTab === "details" && <StudioDetails studio={studio} />}
                            {activeTab === "booking" && <Booking userId={studio.userId._id} studio={studio} />}
                            {activeTab === "portfolio" && <Portfolio images={studio.images} />}
                            {activeTab === "comments" && <Comments />}
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
