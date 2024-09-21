import { Link } from "react-router-dom";

const StudioCard = ({ studio }) => {
	return (
		<>
			{studio && (
				<div
					className="bg-gray-300 dark:bg-gray-700 shadow-xl hover:shadow-2xl dark:shadow-whiteLg transition-shadow 
            			overflow-hidden rounded-lg w-full md:w-[360px] flex flex-col justify-center">
					<Link to={`/studio/${studio._id}`}>
						<div className="relative flex">
							<div className="h-[350px] w-full bg-slate-400">
								<img
									src={studio.images[0].url}
									alt="img"
									className="h-[350px] w-full object-cover
                    		hover:scale-105 transition-scale duration-300"
								/>
							</div>
							<div className="absolute bottom-[15%] z-20 w-full flex flex-col items-center justify-center bg-black bg-opacity-50 font-serif text-white dark:text-white">
								<span className="text-3xl">{studio.title}</span>
								<span className="text-sm">{studio.address}, {studio.city}</span>
							</div>
						</div>
					</Link>
				</div>
			)}
		</>
	);
};

export default StudioCard;
