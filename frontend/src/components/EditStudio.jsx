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
	ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
	FaCalendarAlt,
	FaFacebook,
	FaInstagram,
	FaTwitter,
	FaWhatsapp,
} from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import { MdCancelPresentation } from "react-icons/md";
import LocationPicker from "./LocationPicker";
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
import { countries } from "countries-list";
import { FaMoneyBill1Wave } from "react-icons/fa6";

const EditStudio = () => {
	const [formData, setFormData] = useState({
		images: [],
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

	const countryOptions = Object.values(countries).map(
		(country) => country.name
	);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStudioErrorMsg(null);
		setLoading(true);
		setUpdateMsg(null);

		if (!formData.type || formData.type === "") {
			setLoading(false);
			setStudioErrorMsg("Se requiere tipo de estudio.");
			return;
		}

		if (!formData.country || formData.country === "") {
			setLoading(false);
			setStudioErrorMsg("Se requiere país.");
			return;
		}

		if (
			!formData.title ||
			!formData.calendarUrl ||
			!formData.description ||
			!formData.address ||
			!formData.city ||
			!formData.price ||
			formData.images.length === 0 ||
			!formData.location.latitude ||
			!formData.location.longitude
		) {
			setLoading(false);
			setStudioErrorMsg(
				"Solo el número de teléfono y las cuentas de redes sociales son opcionales.<br />Todos los demás campos son obligatorios.."
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
				setUpdateMsg("Estudio actualizado exitosamente!");
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
				setImageUploadErrorMsg("Seleccione un archivo de imagen para cargar");
				setImageUploading(false);
				return;
			}

			if (file.size >= 5 * 1024 * 1024) {
				setImageUploadErrorMsg(
					"El tamaño de la imagen debe ser inferior a 5 MB."
				);
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
					setImageUploadErrorMsg(
						"El tamaño de la imagen debe ser inferior a 5 MB."
					);
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
			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-xl bg-white bg-opacity-35 dark:bg-transparent dark:bg-opacity-100">
				<h1 className="text-center text-3xl mb-7 font-semibold">
					Actualizar estudio
				</h1>
				<form className={`flex py-5 flex-col gap-6`} onSubmit={handleSubmit}>
					<div className="bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
						<div className="flex gap-2 sm:flex-row flex-col sm:items-center justify-center px-3 pt-3">
							<Label value="Título" />
							<TextInput
								className="flex-grow w-full"
								type="text"
								placeholder="Título"
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								disabled={loading || imageUploading}
								required
								value={formData.title}
							/>
						</div>
						<div className="flex gap-2 sm:flex-row flex-col sm:items-center justify-center px-3">
							<FaCalendarAlt className="text-2xl" />
							<TextInput
								className="flex-grow w-full ml-1"
								type="text"
								placeholder="Enlace de cita del calendario"
								onChange={(e) =>
									setFormData({ ...formData, calendarUrl: e.target.value })
								}
								disabled={loading || imageUploading}
								required
								value={formData.calendarUrl}
							/>
						</div>
						<div className="flex flex-col gap-2 sm:items-center justify-center p-3">
							<Label value="Descripción" />
							<Textarea
								className=""
								rows="4"
								placeholder="Escribe algo sobre tu estudio....."
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								disabled={loading || imageUploading}
								required
								value={formData.description}
							/>
						</div>
						<div className="flex flex-col lg:flex-row w-full lg:w-auto justify-around gap-3">
							<div className="flex flex-col w-full lg:w-auto gap-1">
								<Label value="Tipo" className="" />
								<Select
									disabled={loading || imageUploading}
									className="w-full lg:w-64"
									required
									value={formData.type}
									onChange={(e) =>
										setFormData({ ...formData, type: e.target.value })
									}>
									<option value="">Seleccione un tipo</option>
									<option value="music">Estudio de música</option>
									<option value="recording">Estudio de grabación</option>
									<option value="podcast">Estudio de podcasts</option>
									<option value="rehersal">Estudio de ensayo</option>
								</Select>
							</div>
							<div className="flex flex-col w-full lg:w-auto gap-1">
								<Label value="Precio ($) por Hora" className="" />
								<TextInput
									className="flex-grow w-full md:ml-1"
									type="number"
									placeholder=""
									value={formData.price}
									min={0}
									onChange={(e) =>
										setFormData({ ...formData, price: e.target.value })
									}
									disabled={loading || imageUploading}
									required
								/>
							</div>
						</div>

						<Label value="Beneficios" className="self-center mt-5" />
						<div className="flex flex-col md:flex-row gap-2 md:flex-wrap md:justify-between lg:justify-around my-1">
							<ToggleSwitch
								// className="focus:ring-1"
								checked={formData.facility?.remote}
								label="Grabación remota a través de Zoom"
								onChange={() =>
									setFormData({
										...formData,
										facility: {
											...formData.facility,
											remote: !formData.facility.remote,
										},
									})
								}
							/>
							<ToggleSwitch
								checked={formData.facility?.wifi}
								label="Wi-Fi"
								onChange={() =>
									setFormData({
										...formData,
										facility: {
											...formData.facility,
											wifi: !formData.facility.wifi,
										},
									})
								}
							/>
							<ToggleSwitch
								checked={formData.facility?.air}
								label="Aire acondicionado"
								onChange={() =>
									setFormData({
										...formData,
										facility: {
											...formData.facility,
											air: !formData.facility.air,
										},
									})
								}
							/>
							<ToggleSwitch
								checked={formData.facility?.parking}
								label="Aparcamiento"
								onChange={() =>
									setFormData({
										...formData,
										facility: {
											...formData.facility,
											parking: !formData.facility.parking,
										},
									})
								}
							/>
						</div>
					</div>

					<div className="flex flex-col justify-around items-center bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 dark:shadow-whiteLg">
						<div className="flex sm:flex-row flex-col gap-2 sm:items-center justify-center w-full p-3">
							<Label value="Número de teléfono" className="w-32" />
							<TextInput
								className="flex-grow w-full"
								type="text"
								placeholder="Número de teléfono"
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
								disabled={loading || imageUploading}
								value={formData.phone}
							/>
						</div>
						<div className="flex flex-col sm:flex-row gap-4 justify-around items-center p-3 w-full">
							<div className="flex flex-col gap-1 flex-grow w-full">
								<Label value="DIRECCIÓN" />
								<TextInput
									className="flex-grow w-full"
									type="text"
									placeholder="dirección del estudio"
									onChange={(e) =>
										setFormData({ ...formData, address: e.target.value })
									}
									disabled={loading || imageUploading}
									required
									value={formData.address}
								/>
							</div>
							<div className="flex flex-col gap-1 w-full">
								<Label value="Ciudad" />
								<TextInput
									className="flex-grow w-full"
									type="text"
									placeholder="Ciudad"
									onChange={(e) =>
										setFormData({ ...formData, city: e.target.value })
									}
									disabled={loading || imageUploading}
									required
									value={formData.city}
								/>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row gap-4 justify-around items-center py-3 w-full">
							<div className="flex flex-col gap-1 flex-grow w-full">
								<Label value="Estado" />
								<TextInput
									className="flex-grow w-full"
									type="text"
									placeholder="Estado"
									value={formData.state}
									onChange={(e) =>
										setFormData({ ...formData, state: e.target.value })
									}
									disabled={loading || imageUploading}
									required
								/>
							</div>
							<div className="flex flex-col gap-1 w-full md:w-auto">
								<Label value="País" />
								<Select
									disabled={loading || imageUploading}
									className="w-full lg:w-64"
									required
									value={formData.country}
									onChange={(e) =>
										setFormData({ ...formData, country: e.target.value })
									}>
									<option value="">Seleccione un país</option>
									{countryOptions.map((country, index) => (
										<option key={index} value={country}>
											{country}
										</option>
									))}
								</Select>
							</div>
						</div>

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
					</div>

					<div className="bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
						<Label value="Sube imágenes. La primera imagen será la portada." />
						<div className="flex flex-col mb-4 w-full gap-4 items-center justify-between">
							<div className="w-full">
								<TextInput
									type="text"
									placeholder="Descripción de la imagen"
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
										? "Subiendo... Por favor espera!"
										: "Subir imagen"}
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
											BORRAR
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

					<div className="bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
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
							<div className="flex sm:flex-row flex-col gap-2 items-center sm:pl-2">
								<div className="flex items-center justify-center gap-2">
									<FaMoneyBill1Wave />
									<Label value="Deposit" />
								</div>
								<TextInput
									className="w-72"
									type="text"
									placeholder="deposit link"
									value={formData.socialMedia?.deposit || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											socialMedia: {
												...formData.socialMedia,
												deposit: e.target.value,
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
								<span className="pl-3">Actualizando... Por favor espera!</span>
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
