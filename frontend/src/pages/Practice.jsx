import { Label } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const Practice = () => {
	const [formData, setFormData] = useState({
		youtubeLinks: [],
	});

	useEffect(() => {
		const fetchStorage = async () => {
			try {
				const response = await fetch("/api/storage/get-storage");
				const data = await response.json();
				setFormData(data);
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchStorage();
	}, []);

	return (
		<div className="w-full bg-cover bg-center min-h-screen">
			<div
				className="max-w-4xl my-10 mx-3 p-3 sm:mx-12 lg:mx-auto sm:p-10 self-center dark:shadow-whiteLg items-center justify-center flex flex-col
			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-xl text-justify">
				<h1 className="text-2xl font-semibold text-center uppercase">
					Guiones para practicar
				</h1>
				{formData.youtubeLinks && (
					<div className="flex w-full flex-col text-justify mt-4 bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-xl p-4 dark:shadow-whiteLg">
						{formData.youtubeLinks?.length > 0 &&
							formData.youtubeLinks.map((url, index) => (
								<>
									<div
										key={index}
										className="flex-col md:flex-row justify-between px-2 py-2 items-center gap-2">
										<div className="flex flex-col md:flex-row justify-between px-3 py-3 border items-center gap-1">
											<Label className="flex-grow">{url.title}</Label>
										</div>
										<div className="video-wrapper-form h-[180px] sm:h-[270px] md:h-[260px] lg:h-[400px] w-full">
											<ReactPlayer
												url={url.url}
												controls
												loop
												config={{
													youtube: {
														playerVars: {
															modestbranding: 1, // Hide the YouTube logo
															rel: 0, // Minimizes related videos
															showinfo: 0, // Hides video title and info (deprecated but still useful in some cases)
															disablekb: 1, // Disables keyboard shortcuts
														},
													},
												}}
												width={"100%"}
												className="react-player-form"
											/>
										</div>
										<div className="flex flex-col md:flex-row justify-between px-3 py-3 border items-center gap-1">
											<Label className="flex-grow">
												<a
													href={url.url}
													target="_blank"
													rel="noopener noreferrer">
													{url.url}
												</a>
											</Label>
										</div>
									</div>
									<hr className="border-2 my-2" />
								</>
							))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Practice;
