import {
	Alert,
	Button,
	Checkbox,
	FileInput,
	Label,
	Select,
	Spinner,
	Table,
	Textarea,
	TextInput,
} from "flowbite-react";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import { MdCancelPresentation } from "react-icons/md";

const CreateStudio = () => {
	const [formData, setFormData] = useState({
		images: [],
		week: {
			monday: { start: "", end: "" },
			tuesday: { start: "", end: "" },
			wednesday: { start: "", end: "" },
			thursday: { start: "", end: "" },
			friday: { start: "", end: "" },
			saturday: { start: "", end: "" },
			sunday: { start: "", end: "" },
		},
	});
	const [imageName, setImageName] = useState("");
	const [file, setFile] = useState("");
	const [loading, setLoading] = useState(false);
	const [imageUploading, setImageUploading] = useState(false);
	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState(null);
	const [studioErrorMsg, setStudioErrorMsg] = useState(null);

	// const [prevUrlData, setPrevUrlData] = useState([]);

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const handleUploadImage = () => {};

	const handleRemoveImage = (index, url) => {
		// Create a new array with the item removed
		const updatedImages = formData.images.filter((_, i) => i !== index);
		setFormData({
			...formData,
			images: updatedImages, // Set the updated images array
		});
		// setPrevUrlData([...prevUrlData, url]); // Store removed URL
	};

	// Handle input changes for each time field
	const handleTimeChange = (day, field, value) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			week: {
				...prevFormData.week,
				[day]: {
					...prevFormData.week[day],
					[field]: value,
				},
			},
		}));
	};

	const handleCheckboxChange = (day) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			week: {
				...prevFormData.week,
				[day]: {
					...prevFormData.week[day],
					working: !prevFormData.week[day].working,
				},
			},
		}));
	};

	return (
		<div
			className="w-full bg-cover bg-center
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			<div
				className="max-w-3xl my-10 mx-3 p-3 sm:mx-12 lg:mx-auto sm:p-10 self-center dark:shadow-whiteLg
			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-xl">
				<h1 className="text-center text-3xl mb-7 font-semibold">
					Create Studio
				</h1>
				<form className={`flex py-5 flex-col gap-6`} onSubmit={handleSubmit}>
					<div className="bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
						<div className="flex gap-2 items-center justify-center px-3">
							<Label value="Title" />
							<TextInput
								className="flex-grow w-full"
								type="text"
								placeholder="Title"
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								// disabled={}
							/>
						</div>
						<div className="flex flex-col gap-2 items-center justify-center p-3">
							<Label value="Description" />
							<Textarea
								className="mb-2"
								rows="4"
								placeholder="Write someting about your studio...."
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								// disabled={}
							/>
						</div>
					</div>

					<div className="flex flex-col justify-around items-center bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-md p-3 dark:shadow-whiteLg">
						<div className="flex gap-2 items-center justify-center w-full p-3">
							<Label value="Phone Number" className="w-32" />
							<TextInput
								className="flex-grow w-full"
								type="text"
								placeholder="Phone Number"
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
								// disabled={}
							/>
						</div>
						<div className="flex flex-row gap-4 justify-around items-center p-3 w-full">
							<div className="flex flex-col gap-1 flex-grow">
								<Label value="Address" />
								<TextInput
									className="flex-grow w-full"
									type="text"
									placeholder="Studio's address"
									onChange={(e) =>
										setFormData({ ...formData, address: e.target.value })
									}
									// disabled={}
								/>
							</div>
							<div className="flex flex-col gap-1">
								<Label value="City" />
								<TextInput
									className="flex-grow w-full"
									type="text"
									placeholder="City"
									onChange={(e) =>
										setFormData({ ...formData, city: e.target.value })
									}
									// disabled={}
								/>
							</div>
						</div>
						{/* <div className="flex flex-col gap-1">
							<Label value="City" />
							<Select
								// disabled={}
								className="w-56"
								required
								onChange={(e) =>
									setFormData({ ...formData, city: e.target.value })
								}>
								<option value="">Select an option</option>
								{countryOptions.map((country, index) => (
									<option key={index} value={country}>
										{country}
									</option>
								))}
							</Select>
						</div> */}
					</div>

					<div className="bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
						<Label value="Upload images! First image will be cover image" />
						<div className="flex flex-col mb-4 w-full gap-4 items-center justify-between">
							<div className="w-full">
								<TextInput
									type="text"
									placeholder="Image description"
									onChange={(e) => setImageName(e.target.value)}
									// disabled={}
								/>
							</div>
							<div className="flex flex-col w-full mb-4 sm:flex-row gap-4 items-center justify-between">
								<FileInput
									type="file"
									accept="image/*"
									onChange={(e) => setFile(e.target.files[0])}
									className="w-full sm:w-auto"
									// disabled={}
								/>
								<Button
									type="button"
									gradientDuoTone="purpleToBlue"
									size="sm"
									outline
									className="focus:ring-1 w-full sm:w-auto"
									onClick={handleUploadImage}
									// disabled={}
								>
									{imageUploading
										? "Uploading... Please wait!"
										: "Upload Image"}
								</Button>
							</div>
						</div>
						{imageUploadErrorMsg && (
							<Alert className="flex-auto" color="failure" withBorderAccent>
								<div className="flex justify-between">
									<span
										dangerouslySetInnerHTML={{ __html: imageUploadErrorMsg }}
									/>
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => setImageUploadErrorMsg(null)}
										/>
									</span>
								</div>
							</Alert>
						)}
						{formData.images &&
							formData.images.length > 0 &&
							formData.images.map((image, index) => (
								<div
									key={index}
									className="flex flex-col px-3 py-1 border gap-1">
									<div className="w-full">
										<Label value={`Palabras clave : ${image.name}`} />
									</div>
									<div className="flex flex-col md:flex-row justify-between px-3 py-1 items-center gap-1">
										{console.log("URL:", image.url)}
										<img
											src={image.url}
											alt="upload"
											className="w-full h-auto object-cover border 
											border-gray-500 dark:border-gray-300 mt-4"
										/>
										<button
											// disabled={}
											type="button"
											onClick={() => handleRemoveImage(index, image.url)}
											className="px-3 text-red-700 rounded-lg uppercase hover:opacity-75">
											DELETE
										</button>
									</div>
								</div>
							))}
					</div>

					{/* <div className="bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
						<span className="text-lg text-center my-2"></span>
						<div className="flex flex-col mb-4 gap-4 items-center justify-between">
							<div className="flex gap-2 items-center">
								<Label value="Monday" />
								<div className="flex items-center gap-2 ml-10">
									<Label htmlFor="mondayCheck">Working Day</Label>
									<Checkbox id="mondayCheck" className="focus:ring-0" />
								</div>
								<div>
									<input
										type="time"
										onChange={(e) => setFormData({ ...formData })}
									/>
								</div>
							</div>
						</div>
					</div> */}

					<div
						className="overflow-x-scroll p-4 lg:overflow-visible md:max-w-md lg:max-w-5xl w-full mx-auto
					scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
					 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 dark:shadow-whiteLg
					 bg-transparent border-2 border-white/40 dark:border-white/20 rounded-lg shadow-xl">
						<div className="text-lg w-full text-center my-1">
							Select Working Days and Time
						</div>
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent border-2 border-white/20 
										rounded-lg shadow-lg dark:shadow-whiteLg">
							<Table.Head className=" lg:sticky lg:top-[60px] z-20 h-16">
								<Table.HeadCell>Day</Table.HeadCell>
								<Table.HeadCell>Working Day</Table.HeadCell>
								<Table.HeadCell>Start Time</Table.HeadCell>
								<Table.HeadCell>End Time</Table.HeadCell>
							</Table.Head>
							<Table.Body>
								{[
									"monday",
									"tuesday",
									"wednesday",
									"thursday",
									"friday",
									"saturday",
									"sunday",
								].map((day) => (
									<Table.Row
										key={day}
										className="border border-gray-400 h-[75px]">
										<Table.Cell>
											<Label
												value={`${day.charAt(0).toUpperCase() + day.slice(1)}`}
											/>
										</Table.Cell>
										<Table.Cell>
											<div className="flex items-center gap-2">
												<Label htmlFor={`${day}Check`}>Working</Label>
												<Checkbox
													id={`${day}Check`}
													className="focus:ring-0"
													checked={formData.week[day].working}
													onChange={() => handleCheckboxChange(day)}
												/>
											</div>
										</Table.Cell>
										<Table.Cell>
											{formData.week[day].working && (
												<input
													type="time"
													value={formData.week[day].start}
													onChange={(e) =>
														handleTimeChange(day, "start", e.target.value)
													}
												/>
											)}
										</Table.Cell>
										<Table.Cell>
											{formData.week[day].working && (
												<input
													type="time"
													value={formData.week[day].end}
													onChange={(e) =>
														handleTimeChange(day, "end", e.target.value)
													}
												/>
											)}
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>

					<div className="bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
						<span className="text-lg text-center my-2">
							Redes Sociales (opcional)
						</span>
						<div className="flex flex-col mb-4 gap-4 items-center justify-between">
							<div className="flex sm:flex-row flex-col gap-2 items-center">
								<div className="flex items-center justify-center gap-2">
									{<FaInstagram />}
									<Label value="Instagram"></Label>
								</div>
								<TextInput
									className="w-72"
									type="text"
									placeholder="enlace de instagram"
									value={formData.socialMedia?.instagram || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											socialMedia: {
												...formData.socialMedia,
												instagram: e.target.value,
											},
										})
									}
									// disabled={}
								/>
							</div>
							<div className="flex sm:flex-row flex-col gap-2 items-center">
								<div className="flex items-center justify-center gap-2">
									<FaFacebook />
									<Label value="Facebook" />
								</div>
								<TextInput
									className="w-72"
									type="text"
									placeholder="enlace de facebook"
									value={formData.socialMedia?.facebook || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											socialMedia: {
												...formData.socialMedia,
												facebook: e.target.value,
											},
										})
									}
									// disabled={}
								/>
							</div>
							<div className="flex sm:flex-row flex-col gap-2 items-center sm:pl-4">
								<div className="flex items-center justify-center gap-2">
									<FaTwitter />
									<Label value="Twitter" />
								</div>
								<TextInput
									className="w-72"
									type="text"
									placeholder="enlace de twitter"
									value={formData.socialMedia?.twitter || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											socialMedia: {
												...formData.socialMedia,
												twitter: e.target.value,
											},
										})
									}
									// disabled={}
								/>
							</div>
							<div className="flex sm:flex-row flex-col gap-2 items-center sm:pr-2">
								<div className="flex items-center justify-center gap-2">
									<FaWhatsapp />
									<Label value="Whatsapp" />
								</div>
								<TextInput
									className="w-72"
									type="text"
									placeholder="número de whatsapp"
									value={formData.socialMedia?.whatsapp || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											socialMedia: {
												...formData.socialMedia,
												whatsapp: e.target.value,
											},
										})
									}
									// disabled={}
								/>
							</div>
						</div>
					</div>

					<Button
						type="submit"
						gradientDuoTone="purpleToPink"
						outline
						className="focus:ring-1 uppercase"
						// disabled={}
					>
						{loading ? (
							<>
								<Spinner size="sm" />
								<span className="pl-3">Creating.... Please wait!</span>
							</>
						) : (
							"Create a Studio"
						)}
					</Button>
				</form>
				{studioErrorMsg && (
					<Alert className="flex-auto" color="failure" withBorderAccent>
						<div className="flex justify-between">
							<span dangerouslySetInnerHTML={{ __html: studioErrorMsg }} />
							<span className="w-5 h-5">
								<MdCancelPresentation
									className="cursor-pointer w-6 h-6"
									onClick={() => setStudioErrorMsg(null)}
								/>
							</span>
						</div>
					</Alert>
				)}
			</div>
		</div>
	);
};

export default CreateStudio;
