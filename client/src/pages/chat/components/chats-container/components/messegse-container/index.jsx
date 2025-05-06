import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../../store";
import moment from "moment";
import apiClients from "../../../../../../lib/api-clients";
import { GET_CHANNEL_MESSAGES, GET_MESSAGES, HOST } from "../../../../../../utils/constants";
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp as IoClose, IoCloseSharp } from 'react-icons/io5';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";


const MessegeContainer = () => {

	const [screenshotWarning, setScreenshotWarning] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "PrintScreen") {
				setScreenshotWarning(true);
				navigator.clipboard.writeText(''); // clears clipboard
				setTimeout(() => setScreenshotWarning(false), 3000); // removes warning after 3s
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const scrollRef = useRef();
	const { selectedChatData, selectedChatType, selectedChatMessages, setselectedChatMessages, userInfo, setFileDownloadProgress, setIsDownloading } = useAppStore();

	const [showImage, setshowImage] = useState(false);
	const [imageUrl, setimageUrl] = useState(null)


	useEffect(() => {
		const getMessages = async () => {
			try {

				const response = await apiClients.post(GET_MESSAGES, { id: selectedChatData._id }, { withCredentials: true });

				console.log(selectedChatData._id);

				console.log(response.data)

				if (response.data.messages) {
					setselectedChatMessages(response.data.messages);
				}

			} catch (error) {
				console.log({ error });
			}
		}

		const getChannelMessages = async () => {
			try {

				const response = await apiClients.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`, { withCredentials: true });

				if (response.data.messages) {
					setselectedChatMessages(response.data.messages);
				}

			} catch (error) {
				console.log({ error });
			}
		}
		if (selectedChatData._id) {

			if (selectedChatType === "Contact") {
				getMessages();
			} else if (selectedChatType === "Channel") {
				getChannelMessages();
			}
		}

	}, [selectedChatData, selectedChatType, setselectedChatMessages]);


	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" })
		}
	}, [selectedChatMessages])

	const renderMessages = () => {
		let lastdate = null;
		return selectedChatMessages.map((message, index) => {
			const messageDate = moment(message.timeStamps).format("YYYY-MM-DD");
			const showDate = messageDate !== lastdate;
			lastdate = messageDate;
			return (
				<div key={index}>
					{
						showDate && (
							<div className="text-center text-gray-500">{moment(message.timeStamps).format("LL")}</div>
						)
					}
					{
						selectedChatType === "Contact" && renderDMMessages(message)
					}
					{selectedChatType === "Channel" && renderChannelMessages(message)}
				</div>
			);
		});
	};



	const checkImage = (filePath) => {
		const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i
		return imageRegex.test(filePath);
	}

	const downloadFile = async (filePath) => {
		const response = await apiClients.get(`${HOST}/${filePath}`, {
			responseType: 'blob', onDownloadProgress: (ProgressEvent) => {
				const { loaded, total } = ProgressEvent;
				const percentCompleted = Math.round((loaded * 100) / total);
				setFileDownloadProgress(percentCompleted);
			}
		});
		const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.href = urlBlob;
		link.setAttribute('download', filePath.split('/').pop());
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(urlBlob);
		setIsDownloading(false);
		setFileDownloadProgress(0);

	}

	const renderDMMessages = (message) => {


		const isImage = message.fileUrl && checkImage(message.fileUrl);

		return (
			<div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
				{screenshotWarning && (
					<div className="bg-red-500 text-white px-4 py-2 rounded shadow mb-2">
						🚫 Screenshot detected! Please respect privacy.
					</div>
				)}

				{
					message.messageType === "text" && (
						<div className={`${message.sender && message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded m-1 max-w-[50%] break-words`}>
							{message.content}
						</div>
					)
				}

				{
					message.messageType === "audio" && message.fileUrl && (
						<div className={`${message.sender && message.sender !== selectedChatData._id
								? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
								: "bg-[#2a2b33]/5 text-white/80 border-white/20"
							} border inline-block p-4 rounded m-1 max-w-[80%] min-w-[200px]`}>
							<p className="mb-1 text-xs text-gray-400">🎧 Audio Message</p>
							<audio controls src={message.fileUrl} className="w-full h-10" />
						</div>
					)
				}
				{
					message.messageType === "file" && message.fileUrl && (
						<div className={`${message.sender && message.sender._id === selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded m-1 max-w-[50%] break-words`}>
							{
								isImage ? (
									<div className="cursor-pointer">
										<img src={`${HOST}/${message.fileUrl}`} alt="Message file" height={300} width={300} onClick={() => {
											setshowImage(true);
											setimageUrl(message.fileUrl);
										}} />
									</div>
								) : (
									<div className="flex items-center justify-center gap-4 cursor-pointer">
										<span className="text-white/80 rounded-full text-3xl bg-black/20  p-3">
											<MdFolderZip />
										</span>
										<span className="cursor-pointer hover:text-blue-600" onClick={() => { downloadFile(message.fileUrl) }}>
											{message.fileUrl.split('/').pop()}
										</span>
										<span className="rounded-full bg-black/20 p-3 hover:bg-black/50 text-2xl cursor-pointer" onClick={() => { downloadFile(message.fileUrl) }}>
											<IoMdArrowRoundDown />
										</span>
									</div>
								)
							}
						</div>
					)
				}
				<div className="text-xs text-gray-600">
					{moment(message.timeStamps).format("LT")}
				</div>
			</div>
		);
	};

	const renderChannelMessages = (message) => {


		return (
			<div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"} `} >
				{
					message.messageType === "text" && (

						<div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded m-1 max-w-[50%] break-words ml-9 `}>
							{message.content}
						</div>

					)
				}
				{
					message.messageType === "file" && (
						<div className={`${message.sender === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded m-1 max-w-[50%] break-words `}>
							{
								checkImage(message.fileUrl) ? <div className="cursor-pointer">
									<img src={`${HOST}/${message.fileUrl}`} height={300} width={300} onClick={() => {
										setshowImage(true);
										setimageUrl(message.fileUrl);
									}} />
								</div> :
									<div className="flex items-center justify-center gap-4 cursor-pointer">
										<span className="text-white/80 rounded-full text-3xl bg-black/20  p-3">
											<MdFolderZip />
										</span>
										<span className="cursor-pointer hover:text-blue-600" onClick={() => { downloadFile(message.fileUrl) }}>{message.fileUrl.split('/').pop()}</span>
										<span className="rounded-full bg-black/20 p-3 hover:bg-black/50 text-2xl cursor-pointer" onClick={() => { downloadFile(message.fileUrl) }}><IoMdArrowRoundDown /></span>
									</div>
							}
						</div>
					)
				}
				{
					message.sender._id !== userInfo.id ? (<div className="items-center justify-start flex gap-3">
						<Avatar className="w-8 h-8 rounded-full overflow-hidden">
							{
								message.sender.image && (<AvatarImage src={`${HOST}/${message.sender.image}`} alt="profile" className="w-full h-full object-cover bg-black rounded-full" />)}
							<AvatarFallback className={`uppercase h-8 w-8  text-lg border-[1px] flex justify-center items-center rounded-full ${getColor(message.sender.color)}`}>
								{
									message.sender.firstName ? message.sender.firstName.split("").shift() : message.sender.email.split("").shift()
								}
							</AvatarFallback>

						</Avatar>
						<span className="text-sm text-white/60 " >{`${message.sender.firstName} ${message.sender.lastName}`}</span>
						<span className="text-xs text-white/60" >{moment(message.timeStamps).format("LT")}</span>
					</div>) : (<div className="text-xs text-white/60 mt-1" >{moment(message.timeStamps).format("LT")}</div>)
				}
			</div>
		)
	}
	return (

		<div className="flex-1 overflow-y-auto  p-4 px-8 w-full md:w-[65px] lg:w-[70px] scrollbar:hidden xl:w-[80vw]">
			{renderMessages()}
			<div ref={scrollRef} />
			{
				showImage && (
					<div className="flex items-center justify-center z-[1000] top-0 fixed left-0 h-[100vh] w-[100vw] backdrop-blur-lg flex-col">
						<div>
							<img src={`${HOST}/${imageUrl}`} className="h-[80vh] w-full bg-cover" />
						</div>
						<div className="fixed gap-5 flex top-0 mt-5 ">
							<button className="rounded-full bg-black/20 p-3 hover:bg-black/50 text-2xl cursor-pointer" onClick={() => { downloadFile(imageUrl) }}>
								<IoMdArrowRoundDown />
							</button>
							<button className="rounded-full bg-black/20 p-3 hover:bg-black/50 text-2xl cursor-pointer" onClick={() => {
								setshowImage(false);
								setimageUrl(null);
							}}>
								<IoCloseSharp />
							</button>
						</div>
					</div>

				)
			}
		</div>
	)
}

export default MessegeContainer
