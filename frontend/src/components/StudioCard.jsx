import { FaParking } from "react-icons/fa";
import { FaLocationDot, FaWifi } from "react-icons/fa6";
import { RiBaseStationLine, RiTempColdLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const StudioCard = ({ studio }) => {
	console.log(studio);
	return (
		<>
			{studio && (
				<Link to={`/studio/${studio._id}`}>
					<div
						className="group relative w-full border-teal-500 h-[420px] overflow-hidden
            hover:border-2 sm:w-[370px] transition-all dark:shadow-whiteLg
            bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
						<img
							src={studio.images[0].url}
							alt="img"
							className="h-[260px] w-full object-cover group-hover:h-[200px]
                    transition-all duration-300 z-20"
						/>
						<div className="p-3 flex flex-col gap-2">
							<p className=" text-lg md:text-xl font-semibold line-clamp-1">
								{studio.title}
							</p>
							<div className="text-sm md:text-md flex gap-1 items-center">
								<FaLocationDot />
								<span>
									{studio.address}, {studio.city}
								</span>
							</div>

							<div className="flex gap-2">
								{studio.facility?.remote && (
									<p className="">
										<RiBaseStationLine className="inline-block mr-3" />
									</p>
								)}
								{studio.facility?.air && (
									<p className="">
										<RiTempColdLine className="inline-block mr-3" />
									</p>
								)}
								{studio.facility?.parking && (
									<p className=" ">
										<FaParking className="inline-block mr-3" />
									</p>
								)}
								{studio.facility?.wifi && (
									<p className="">
										<FaWifi className="inline-block mr-3" />
									</p>
								)}
							</div>

							<span className="text-sm md:text-md flex gap-1 items-center mt-1">
								$ {studio.price} / hour
							</span>

							<Link
								to={`/studio/${studio._id}`}
								className="z-10 group-hover:bottom-0 absolute bottom-[-200px]
							text-center left-0 right-0 border border-teal-400 text-teal-500
							hover:bg-teal-400 dark:border-gray-700 dark:text-gray-300
							dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:text-white
							transition-all duration-300 py-2 rounded-md !rounded-tl-none
							!rounded-br-none m-2 mt-0">
								Book Studio
							</Link>
						</div>
					</div>
				</Link>
			)}
		</>
	);
};

export default StudioCard;
