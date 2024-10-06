import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import Booking from "../components/Booking";
import StudioDetails from "../components/StudioDetails";
import Portfolio from "../components/Portfolio";
import Comments from "../components/Comments";
import { FaLocationDot } from "react-icons/fa6";

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
		<div className="min-h-screen w-full px-3 sm:px-5">
			<div className="max-w-7xl w-full lg:mx-auto items-center justify-center flex flex-col gap-4 my-3 lg:my-5">
				{studio ? (
					<>
						<div
							className="flex py-3 md:py-5 w-full p-3 md:p-16 max-w-4xl mx-5 sm:mx-10 md:mx-20 lg:mx-auto flex-col md:items-center gap-2 md:gap-5
				bg-transparent backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
							<img
								src={studio.images[0].url}
								alt={studio.name}
								className="w-full object-cover rounded-lg md:min-w-[300px] mx-auto"
							/>
							<h1 className="text-2xl lg:text-4xl font-bold text-center">
								{studio.title}
							</h1>
							<p className="text-lg lg:text-xl text-center">
								<FaLocationDot className="inline-block" />{" "}
								{studio.address + ", " + studio.city + ", " + studio.state + ", " + studio.country} 
							</p>
							<Booking calendarUrl={studio.calendarUrl} price={studio.price}/>
						</div>

						{/* Tab Navigation */}
						<div
							className="flex flex-col md:flex-row md:sticky md:top-[60px] z-10 px-6 py-4 max-w-2xl w-full mx-5 sm:mx-10 md:mx-20 lg:mx-auto items-center gap-2 md:gap-10 justify-between
						bg-transparent backdrop-blur-[30px] rounded-full shadow-2xl dark:shadow-whiteLg bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-60">
							<button
								className={`px-5 py-2 text-lg max-w-64 md:max-w-40 w-full font-semibold transition-colors duration-200 bg-slate-400 rounded-3xl ${
									activeTab === "details"
										? "border-b-4 border-red-500"
										: "text-gray-500"
								}`}
								onClick={() => setActiveTab("details")}>
								Details
							</button>
							<button
								className={`px-5 py-2 text-lg max-w-64 md:max-w-40 w-full font-semibold transition-colors duration-200 bg-slate-400 rounded-3xl ${
									activeTab === "comments"
										? "border-b-4 border-red-500"
										: "text-gray-500"
								}`}
								onClick={() => setActiveTab("comments")}>
								Comments
							</button>
							<button
								className={`px-5 py-2 text-lg max-w-64 md:max-w-40 w-full font-semibold transition-colors duration-200 bg-slate-400 rounded-3xl ${
									activeTab === "portfolio"
										? "border-b-4 border-red-500"
										: "text-gray-500"
								}`}
								onClick={() => setActiveTab("portfolio")}>
								Portfolio
							</button>
						</div>

						<div className="w-full">
							{activeTab === "details" && <StudioDetails studio={studio} />}
							{activeTab === "portfolio" && (
								<Portfolio images={studio.images} />
							)}
							{activeTab === "comments" && <Comments studioId={studio._id} />}
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
