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
import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import { MdCancelPresentation } from "react-icons/md";
import LocationPicker from "../components/LocationPicker";
import { app } from "../firebase";
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserSuccess } from "../redux/user/userSlice";

const EditStudio = () => {
	const [formData, setFormData] = useState({
		images: [],
		week: {
			monday: { start: "", end: "", working: false },
			tuesday: { start: "", end: "", working: false },
			wednesday: { start: "", end: "", working: false },
			thursday: { start: "", end: "", working: false },
			friday: { start: "", end: "", working: false },
			saturday: { start: "", end: "", working: false },
			sunday: { start: "", end: "", working: false },
		},
	});
	const [imageName, setImageName] = useState("");
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [imageUploading, setImageUploading] = useState(false);
	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState(null);
	const [studioErrorMsg, setStudioErrorMsg] = useState(null);
	const { currentUser } = useSelector((state) => state.user);
	const [updateMsg, setUpdateMsg] = useState(null);


	useEffect(() => {
		try {
			const fetchStudio = async () => {
				const res = await fetch(`/api/studio/getstudio/${currentUser._id}`);
				const data = await res.json();
				if (!res.ok) {
					return;
				}
				if (res.ok) {
					setFormData(data);
				}
			};

			{
				currentUser && fetchStudio();
			}
		} catch (error) {
			console.log(error.message);
		}
	}, [currentUser._id]);

	const [errors, setErrors] = useState({});

	const validateWorkingHours = (formData) => {
		const { week } = formData;
		const errors = {};

		Object.keys(week).forEach((day) => {
			const { working, start, end } = week[day];

			if (working) {
				if (!start || !end) {
					errors[
						day
					] = `${day} requires both start and end times when working is enabled.`;
				}
			}
		});

		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStudioErrorMsg(null);
		setLoading(true);
		setUpdateMsg(null);

		const validationErrors = validateWorkingHours(formData);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			setLoading(false);
			return;
		}

		if (
			!formData.title ||
			!formData.description ||
			!formData.address ||
			!formData.city ||
			formData.images.length === 0 ||
			!formData.location.latitude ||
			!formData.location.longitude
		) {
			setLoading(false);
			setStudioErrorMsg(
				"Only Phone number and Social media accounts are optional.<br />All other fields are required."
			);
			return;
		}

		try {
			const res = await fetch(`/api/studio/edit-studio/${currentUser._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (!res.ok) {
				setLoading(false);
				setStudioErrorMsg(data.message);
				return;
			} else {
				setLoading(false);
				setStudioErrorMsg(null);
				setUpdateMsg("Studio updated successfully!");
				// dispatch(updateUserSuccess(data.user));
				// prevUrlData.map((item, index) => deleteFileByUrl(item));
				// navigate("/");
			}
		} catch (error) {
			setStudioErrorMsg(error.message);
			setLoading(false);
		}
	};

	const handleUploadImage = async () => {
		setImageUploadErrorMsg(null);
		setImageUploading(true);
		try {
			if (!file) {
				setImageUploadErrorMsg("Select an image file to upload");
				setImageUploading(false);
				return;
			}

			if (file.size >= 5 * 1024 * 1024) {
				setImageUploadErrorMsg("Image size must be less than 5 MBs");
				setImageUploading(false);
				return;
			}

			const promises = [];


			promises.push(storeImage(file));

			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						images: [
							...formData.images,
							{
								name: imageName,
								url: urls[0],
							},
						],
					});
					setImageUploadErrorMsg(null);
					setImageUploading(false);
					setImageName("");
				})
				.catch((err) => {
					setImageUploadErrorMsg("Image size must be less than 5 MBs");
					setImageUploading(false);
				});
		} catch (error) {
			setImageUploadErrorMsg(error.message);
			setImageUploading(false);
		}
	};

	const storeImage = async (image) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + image.name;
			const stoageRef = ref(storage, fileName);
			console.log(fileName);
			// const metadata = {
			// 	customMetadata: {
			// 		uid: currentUser.firebaseId,
			// 	},
			// };
			const uploadTask = uploadBytesResumable(stoageRef, image);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(`Upload is ${progress}% done`);
				},
				(error) => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downlaodURL) => {
						resolve(downlaodURL);
					});
				}
			);
		});
	};

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
		setErrors({});
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

	// const handleCheckboxChange = (day) => {
	// 	setFormData((prevFormData) => ({
	// 		...prevFormData,
	// 		week: {
	// 			...prevFormData.week,
	// 			[day]: {
	// 				...prevFormData.week[day],
	// 				working: !prevFormData.week[day].working,
	// 			},
	// 		},
	// 	}));
	// };

	const handleCheckboxChange = (day) => {
		setErrors({});
		setFormData((prevFormData) => {
			const isWorking = !prevFormData.week[day].working;

			return {
				...prevFormData,
				week: {
					...prevFormData.week,
					[day]: {
						...prevFormData.week[day],
						working: isWorking,
						start: isWorking ? prevFormData.week[day].start : "", // Clear if unchecked
						end: isWorking ? prevFormData.week[day].end : "", // Clear if unchecked
					},
				},
			};
		});
	};

	const handleLocationChange = (data) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			location: {
				latitude: data.lat,
				longitude: data.lng,
			},
		}));
	};

	return (
		<div
			className="w-full bg-cover bg-center
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			<div
				className="max-w-4xl my-10 mx-3 p-3 sm:mx-12 lg:mx-auto sm:p-10 self-center dark:shadow-whiteLg
			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[20px] rounded-lg shadow-xl">
				<h1 className="text-center text-3xl mb-7 font-semibold">
					Update Studio
				</h1>
				<form className={`flex py-5 flex-col gap-6`} onSubmit={handleSubmit}>
					<div className="bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
						<div className="flex gap-2 sm:flex-row flex-col sm:items-center justify-center px-3">
							<Label value="Title" />
							<TextInput
								className="flex-grow w-full"
								type="text"
								placeholder="Title"
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								disabled={loading || imageUploading}
								required
								value={formData.title}
							/>
						</div>
						<div className="flex flex-col gap-2 sm:items-center justify-center p-3">
							<Label value="Description" />
							<Textarea
								className="mb-2"
								rows="4"
								placeholder="Write someting about your studio...."
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								disabled={loading || imageUploading}
								required
								value={formData.description}
							/>
						</div>
					</div>

					<div className="flex flex-col justify-around items-center bg-transparent border-2 border-white/20 backdrop-blur-[9px] rounded-lg shadow-md p-3 dark:shadow-whiteLg">
						<div className="flex sm:flex-row flex-col gap-2 sm:items-center justify-center w-full p-3">
							<Label value="Phone Number" className="w-32" />
							<TextInput
								className="flex-grow w-full"
								type="text"
								placeholder="Phone Number"
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
								disabled={loading || imageUploading}
								value={formData.phone}
							/>
						</div>
						<div className="flex flex-col sm:flex-row gap-4 justify-around items-center p-3 w-full">
							<div className="flex flex-col gap-1 flex-grow w-full">
								<Label value="Address" />
								<TextInput
									className="flex-grow w-full"
									type="text"
									placeholder="Studio's address"
									onChange={(e) =>
										setFormData({ ...formData, address: e.target.value })
									}
									disabled={loading || imageUploading}
									required
									value={formData.address}
								/>
							</div>
							<div className="flex flex-col gap-1 w-full">
								<Label value="City" />
								<TextInput
									className="flex-grow w-full"
									type="text"
									placeholder="City"
									onChange={(e) =>
										setFormData({ ...formData, city: e.target.value })
									}
									disabled={loading || imageUploading}
									required
									value={formData.city}
								/>
							</div>
						</div>
						{/* <div className="w-full">
							<LocationPicker
								pickLocation={handleLocationChange}
								lat={formData.location?.latitude || -12}
								lng={formData.location?.longitude || -77}
								currentLocation={false}
							/>
						</div> */}
						{formData.location && (
							<div className="w-full">
								<LocationPicker
									pickLocation={handleLocationChange}
									lat={formData.location?.latitude}
									lng={formData.location?.longitude}
									currentLocation={false}
								/>
							</div>
						)}
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
						<Label value="Upload images. First image will be cover" />
						<div className="flex flex-col mb-4 w-full gap-4 items-center justify-between">
							<div className="w-full">
								<TextInput
									type="text"
									placeholder="Image description"
									value={imageName}
									onChange={(e) => setImageName(e.target.value)}
									disabled={loading || imageUploading}
								/>
							</div>
							<div className="flex flex-col w-full mb-4 sm:flex-row gap-4 items-center justify-between">
								<FileInput
									type="file"
									accept="image/*"
									onChange={(e) => setFile(e.target.files[0])}
									className="w-full sm:w-auto"
									disabled={loading || imageUploading}
								/>
								<Button
									type="button"
									gradientDuoTone="purpleToBlue"
									size="sm"
									outline
									className="focus:ring-1 w-full sm:w-auto"
									onClick={handleUploadImage}
									disabled={
										loading ||
										imageUploading ||
										imageUploadErrorMsg ||
										!imageName
									}>
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
									className="flex flex-col sm:px-3 py-1 border gap-1">
									<div className="flex flex-col md:flex-row justify-between sm:px-5 sm:py-3 p-1 items-center gap-1">
										<Label value={`Palabras clave : ${image.name}`} />
										<button
											disabled={loading || imageUploading}
											type="button"
											onClick={() => handleRemoveImage(index, image.url)}
											className="px-3 text-red-700 rounded-lg uppercase hover:opacity-75">
											DELETE
										</button>
									</div>
									<div className="flex flex-col md:flex-row justify-between px-3 py-1 items-center gap-1">
										<img
											src={image.url}
											alt="upload"
											className="w-full h-auto object-cover border 
											border-gray-500 dark:border-gray-300"
										/>
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
						<div className="text-lg w-full text-center my-2">
							Select Working Days and Time
						</div>
						<Table
							hoverable
							className="backdrop-blur-[9px] bg-transparent dark:bg-transparent border-2 border-white/20 
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
													disabled={loading || imageUploading}
												/>
											</div>
										</Table.Cell>
										<Table.Cell>
											{formData.week[day].working && (
												<TextInput
													type="time"
													value={formData.week[day].start}
													disabled={loading || imageUploading}
													onChange={(e) =>
														handleTimeChange(day, "start", e.target.value)
													}
												/>
											)}
										</Table.Cell>
										<Table.Cell>
											{formData.week[day].working && (
												<TextInput
													type="time"
													value={formData.week[day].end}
													onChange={(e) =>
														handleTimeChange(day, "end", e.target.value)
													}
													disabled={loading || imageUploading}
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
									disabled={loading || imageUploading}
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
									disabled={loading || imageUploading}
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
									disabled={loading || imageUploading}
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
									disabled={loading || imageUploading}
								/>
							</div>
						</div>
					</div>

					<Button
						type="submit"
						gradientDuoTone="purpleToPink"
						outline
						className="focus:ring-1 uppercase"
						disabled={loading || imageUploading || studioErrorMsg}>
						{loading ? (
							<>
								<Spinner size="sm" />
								<span className="pl-3">Updating.... Please wait!</span>
							</>
						) : (
							"Update Studio"
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
				{updateMsg && (
					<Alert className="flex-auto" color="success" withBorderAccent>
						<div className="flex justify-between">
							<span>{updateMsg}</span>
							<span className="w-5 h-5">
								<MdCancelPresentation
									className="cursor-pointer w-6 h-6"
									onClick={() => setUpdateMsg(null)}
								/>
							</span>
						</div>
					</Alert>
				)}
				{Object.keys(errors).map((day) => (
					// <p key={day} style={{ color: "red" }}>
					// 	{errors[day]}
					// </p>
					<Alert
						className="flex-auto my-2"
						color="failure"
						withBorderAccent
						key={day}>
						<div className="flex justify-between">
							<span dangerouslySetInnerHTML={{ __html: errors[day] }} />
							<span className="w-5 h-5">
								<MdCancelPresentation
									className="cursor-pointer w-6 h-6"
									onClick={() =>
										setErrors((prevErrors) => {
											const updatedErrors = { ...prevErrors };
											delete updatedErrors[day]; // Remove the error for the clicked day
											return updatedErrors;
										})
									}
								/>
							</span>
						</div>
					</Alert>
				))}
			</div>
		</div>
	);
};

export default EditStudio;
