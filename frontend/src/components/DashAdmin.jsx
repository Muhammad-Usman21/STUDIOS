import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import {
	Alert,
	Button,
	FileInput,
	Label,
	Spinner,
	Table,
	TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { MdCancelPresentation } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";

const DashAdmin = () => {
	const [formData, setFormData] = useState(null);

	const [updatedMsg, setUpdatedMsg] = useState(null);
	const [updatedError, setUpdatedError] = useState(null);
	const [prevUrlData, setPrevUrlData] = useState([]);
	const { currentUser } = useSelector((state) => state.user);
	const [ytLink, setYTLink] = useState("");
	const [videosErrorMsg, setVideosErrorMsg] = useState(null);

	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState(null);
	const [imageUploading, setImageUploading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);

	console.log(formData);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUpdatedMsg(null);
		setUpdatedError(null);
		setLoading(true);

		try {
			if (!formData.found) {
				console.log(formData.found);
				const res = await fetch(`/api/storage/create-storage`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					console.log(data.message);
					setLoading(false);
				} else {
					setFormData(data);
					prevUrlData.map((item, index) => deleteFileByUrl(item));
					setLoading(false);
					return setUpdatedMsg("Actualizado exitosamente");
				}
			}
			if (formData.found) {
				const res = await fetch(`/api/storage/update-storage`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					console.log(data.message);
					setLoading(false);
				} else {
					setFormData(data);
					prevUrlData.map((item, index) => deleteFileByUrl(item));
					setLoading(false);
					return setUpdatedMsg("Actualizado exitosamente");
				}
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const handleAddVideos = () => {
		setVideosErrorMsg(null);
		if (ytLink && ytLink !== "") {
			setFormData({
				...formData,
				youtubeLinks: [...formData.youtubeLinks, ytLink],
			});
			setYTLink("");
		}
	};

	const handleRemoveVideo = (index) => {
		setFormData({
			...formData,
			youtubeLinks: formData.youtubeLinks.filter((x, i) => i !== index),
		});
	};

	const handleUploadImage = async () => {
		setImageUploadErrorMsg(null);
		setImageUploading(true);
		try {
			if (!file) {
				setImageUploading(false);
				setImageUploadErrorMsg("¡Seleccione una imagen!");
				return;
			}
			if (!file.type.includes("image/")) {
				setImageUploading(false);
				setImageUploadErrorMsg(
					"El tipo de archivo no es imagen.\n¡Seleccione un archivo de imagen!"
				);
				return;
			}
			if (file.size >= 5 * 1024 * 1024) {
				setImageUploading(false);
				setImageUploadErrorMsg(
					"El tamaño de la imagen debe ser inferior a 5 MB.!"
				);
				return;
			}

			const storage = getStorage(app);
			const fileName = new Date().getTime() + "-" + file.name;
			const storgeRef = ref(storage, fileName);
			const metadata = {
				customMetadata: {
					uid: currentUser.firebaseId,
				},
			};
			const uploadTask = uploadBytesResumable(storgeRef, file, metadata);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setImageUploadProgress(progress.toFixed(0));
				},
				(error) => {
					setImageUploading(false);
					setImageUploadProgress(null);
					setImageUploadErrorMsg(
						"Error al cargar la imagen. Intentar otra vez!"
					);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						if (formData.backgroundImage) {
							setPrevUrlData([...prevUrlData, formData.backgroundImage]);
						}
						setImageUploadProgress(null);
						setFormData({ ...formData, backgroundImage: downloadURL });
						setImageUploading(false);
					});
				}
			);
		} catch (error) {
			setImageUploadErrorMsg("Error al cargar la imagen. Intentar otra vez!");
			setImageUploading(false);
		}
	};

	return (
		<div
			className="w-full bg-cover bg-center
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			<div
				className="max-w-4xl my-5 sm:my-10 mx-3 p-3 sm:mx-12 lg:mx-auto sm:p-10 self-center dark:shadow-whiteLg
			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-xl">
				<h2 className="self-center text-2xl text-center font-semibold">
					Sólo para administrador
				</h2>
				{formData && (
					<form
						className="mt-10 mb-5 flex flex-col gap-10"
						onSubmit={handleSubmit}>
						<div className="bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
							<h2 className="self-center text-xl text-center font-semibold mb-2">
								Background Image
							</h2>
							<div className="bg-transparent border-2 border-white/20 backdrop-blur-[20px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
								{/* <Label value="Cargue una imagen (tamaño máximo 5 MB) (obligatorio)" /> */}
								<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
									<FileInput
										type="file"
										accept=".jpg, .jpeg, .png"
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
										disabled={imageUploadProgress || loading || imageUploading}>
										{imageUploadProgress ? (
											<div className="flex items-center">
												<CircularProgressbar
													className="h-5"
													value={imageUploadProgress}
												/>
												<span className="ml-1">
													Subiendo... Espere por favor!
												</span>
											</div>
										) : (
											"Subir imagen"
										)}
									</Button>
								</div>
								{imageUploadErrorMsg && (
									<Alert className="flex-auto" color="failure" withBorderAccent>
										<div className="flex justify-between">
											<span>{imageUploadErrorMsg}</span>
											<span className="w-5 h-5">
												<MdCancelPresentation
													className="cursor-pointer w-6 h-6"
													onClick={() => setImageUploadErrorMsg(null)}
												/>
											</span>
										</div>
									</Alert>
								)}
								{formData.backgroundImage && (
									<img
										src={formData.backgroundImage}
										alt="upload"
										className="w-full h-auto object-cover border 
								border-gray-500 dark:border-gray-300 mt-4"
									/>
								)}
							</div>
						</div>
						<div className="bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
							<h2 className="self-center text-xl text-center font-semibold mb-2">
								Guiones para practicar
							</h2>
							<div className="bg-transparent border-2 border-white/20 backdrop-blur-[20px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
								<Label value="The link to YouTube video" />
								<div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
									<TextInput
										className="flex-grow w-full"
										type="text"
										placeholder="Enlace de Youtube"
										onChange={(e) => setYTLink(e.target.value)}
										disabled={loading || imageUploading}
										value={ytLink}
									/>
									<Button
										type="button"
										gradientDuoTone="purpleToBlue"
										size="sm"
										outline
										className="focus:ring-1 w-full sm:w-auto"
										onClick={handleAddVideos}
										disabled={
											imageUploadProgress || loading || imageUploading || !ytLink
										}>
										Agregar
									</Button>
								</div>
								{ytLink && (
									<div className="video-wrapper-form h-[180px] sm:h-[270px] md:h-[260px] lg:h-[370px] w-full">
										<ReactPlayer
											url={ytLink}
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
								)}
								{videosErrorMsg && (
									<Alert className="flex-auto" color="failure" withBorderAccent>
										<div className="flex justify-between">
											<span
												dangerouslySetInnerHTML={{ __html: videosErrorMsg }}
											/>
											<span className="w-5 h-5">
												<MdCancelPresentation
													className="cursor-pointer w-6 h-6"
													onClick={() => setVideosErrorMsg(null)}
												/>
											</span>
										</div>
									</Alert>
								)}
								{formData.youtubeLinks?.length > 0 &&
									formData.youtubeLinks.map((url, index) => (
										<>
											<hr className="border-2 my-2" />
											<div
												key={url}
												className="flex-col md:flex-row justify-between px-2 py-1 items-center">
												<div className="video-wrapper-form h-[180px] sm:h-[270px] md:h-[260px] lg:h-[370px] w-full">
													<ReactPlayer
														url={url}
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
															href={url}
															target="_blank"
															rel="noopener noreferrer">
															{url}
														</a>
													</Label>
													<button
														disabled={loading || imageUploading}
														type="button"
														onClick={() => handleRemoveVideo(index)}
														className="px-3 text-red-700 rounded-lg uppercase hover:opacity-75">
														Borrar
													</button>
												</div>
											</div>
										</>
									))}
							</div>
						</div>
						<div className="bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
							<h2 className="self-center text-xl text-center font-semibold mb-2">
								¿Quiénes somos?
							</h2>
							<ReactQuill
								theme="snow"
								placeholder="Write something...."
								className="h-72 mb-16 sm:mb-12"
								disabled={loading || imageUploading}
								onChange={(value) =>
									setFormData({ ...formData, aboutContent: value })
								}
								value={formData.aboutContent}
							/>
						</div>
						<div className="bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
							<h2 className="self-center text-xl text-center font-semibold mb-2">
								Política de privacidad
							</h2>
							<ReactQuill
								theme="snow"
								placeholder="Write something...."
								className="h-72 mb-16 sm:mb-12"
								disabled={loading || imageUploading}
								onChange={(value) =>
									setFormData({ ...formData, privacyContent: value })
								}
								value={formData.privacyContent}
							/>
						</div>
						<div className="bg-transparent border-2 border-white/20 backdrop-blur-[30px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg">
							<h2 className="self-center text-xl text-center font-semibold mb-2">
								Términos legales
							</h2>
							<ReactQuill
								theme="snow"
								placeholder="Write something...."
								className="h-72 mb-16 sm:mb-12"
								disabled={loading || imageUploading}
								onChange={(value) =>
									setFormData({ ...formData, legalContent: value })
								}
								value={formData.legalContent}
							/>
						</div>
						<Button
							type="submit"
							gradientDuoTone="purpleToPink"
							outline
							disabled={loading || imageUploading}
							className="focus:ring-1 uppercase">
							{loading ? (
								<>
									<Spinner size="sm" />
									<span className="pl-3">Cargando.... Espere por favor!</span>
								</>
							) : (
								"Confirm"
							)}
						</Button>
					</form>
				)}
				{updatedMsg && (
					<Alert className="flex-auto" color="success" withBorderAccent>
						<div className="flex justify-between">
							<span>{updatedMsg}</span>
							<span className="w-5 h-5">
								<MdCancelPresentation
									className="cursor-pointer w-6 h-6"
									onClick={() => setUpdatedMsg(null)}
								/>
							</span>
						</div>
					</Alert>
				)}
			</div>
		</div>
	);
};

export default DashAdmin;

// Function to delete a file using its URL
const deleteFileByUrl = async (fileUrl) => {
	const storage = getStorage();

	try {
		// Extract the file path from the URL
		const startIndex = fileUrl.indexOf("/o/") + 3;
		const endIndex = fileUrl.indexOf("?alt=media");

		const filePath = decodeURIComponent(
			fileUrl.substring(startIndex, endIndex)
		);

		// Create a reference to the file to delete
		const fileRef = ref(storage, filePath);

		// Delete the file
		await deleteObject(fileRef);
		console.log("File deleted successfully");
	} catch (error) {
		console.error("Error deleting file:", error.message);
	}
};
