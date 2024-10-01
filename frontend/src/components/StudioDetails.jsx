import DisplayMap from "./DisplayMap";
import {
	FaRegUser,
	FaInstagram,
	FaFacebook,
	FaWhatsapp,
	FaTwitter,
	FaEnvelope,
	FaPhone,
} from "react-icons/fa";

const StudioDetails = ({ studio }) => {
	return (
		<div className="min-h-screen w-full sm:px-10 ">
			<div
				className="flex p-3 md:p-16 max-w-4xl w-full lg:mx-auto flex-col md:items-center gap-6 md:gap-10
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
				{/* Studio Description */}
				<div className="w-full">
					<h1 className="text-2xl font-semibold mb-2">Description:</h1>
					<p className="text-gray-700 dark:text-gray-300">
						{studio.description}
					</p>
				</div>

				{/* Manager Details */}
				<div className="w-full">
					<h1 className="text-2xl font-semibold mb-2">Manager:</h1>
					<div className="flex items-center gap-4">
						<img
							src={studio.userId.profilePicture}
							alt="profile"
							className="w-16 h-16 rounded-full object-cover border border-gray-300"
						/>

						<div>
							<p className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
								<FaRegUser className="text-gray-500" /> {studio.userId.name}
							</p>
							<p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
								<FaEnvelope className="text-gray-500" /> {studio.userId.email}
							</p>
							<p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
								<FaPhone className="text-gray-500" /> {studio.phone}
							</p>
						</div>
					</div>
				</div>

				<DisplayMap
					lat={studio.location.latitude}
					lng={studio.location.longitude}
				/>

				<div className="self-start mt-3 mb-3 flex flex-row gap-6 justify-center items-center w-full">
					{studio.socialMedia?.instagram && (
						<a
							href={studio.socialMedia.instagram}
							target="_blank"
							rel="noreferrer">
							<FaInstagram className="inline-block mr-2 text-3xl hover:text-pink-600" />
						</a>
					)}
					{studio.socialMedia?.facebook && (
						<a
							href={studio.socialMedia.facebook}
							target="_blank"
							rel="noreferrer">
							<FaFacebook className="inline-block mr-2 text-3xl hover:text-blue-500" />
						</a>
					)}
					{studio.socialMedia?.twitter && (
						<a
							href={studio.socialMedia.twitter}
							target="_blank"
							rel="noreferrer">
							<FaTwitter className="inline-block mr-2 text-3xl hover:text-blue-500" />
						</a>
					)}
					{studio.socialMedia?.whatsapp && (
						<a
							href={`https://wa.me/${studio.socialMedia.whatsapp}`}
							target="_blank"
							rel="noreferrer">
							<FaWhatsapp className="inline-block mr-2 text-3xl hover:text-green-500" />
						</a>
					)}
				</div>
			</div>
		</div>
	);
};

export default StudioDetails;
