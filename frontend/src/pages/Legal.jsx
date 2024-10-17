import { useEffect, useState } from "react";

const Legal = () => {
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
			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-xl text-justify bg-white bg-opacity-35 dark:bg-transparent dark:bg-opacity-100">
				<h1 className="text-2xl font-semibold text-center uppercase">
					Términos legales
				</h1>
				{formData.legalContent && (
					<div className="flex flex-col text-justify mt-4 bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-xl p-4 dark:shadow-whiteLg">
						<div
							className="p-3 max-w-2xl mx-auto w-full post-content"
							dangerouslySetInnerHTML={{ __html: formData.legalContent }}></div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Legal;
