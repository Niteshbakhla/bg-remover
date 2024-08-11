import React, { useRef, useState } from "react";
import axios from "axios";

const Removebg = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileinput = useRef(null);
  const [images, setImages] = useState(false)

  const filehandle = () => {
    fileinput.current.click();
  };

  const onChangeHandle = async (e) => {
    setImages(true)
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage(URL.createObjectURL(file));
      await removeBackground(file);
    }
  };

  const removeBackground = async (file) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image_file', file);

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg', // Replace with your API endpoint
        formData,
        {
          headers: {
            'X-Api-Key': '9Lu83vZHATBUTBerBwtgdeg2', // Replace with your API key
          },
          responseType: 'blob',
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
      setIsLoading(false);
    } catch (error) {
      console.error('Error removing background:', error);
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = async () => {
    console.log("URL submitted:", imageUrl);
    closeModal();
    await removeBackgroundFromUrl(imageUrl);
  };

  const removeBackgroundFromUrl = async (url) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg', // Replace with your API endpoint
        { image_url: url },
        {
          headers: {
            'X-Api-Key': '9Lu83vZHATBUTBerBwtgdeg2', // Replace with your API key
          },
          responseType: 'blob',
        }
      );

      const processedUrl = URL.createObjectURL(response.data);
      setProcessedImage(processedUrl);
      setIsLoading(false);
    } catch (error) {
      console.error('Error removing background from URL:', error);
      setIsLoading(false);
    }
  };

  const downloadImage = ()=>{
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'removed_background_image.png';
    link.click();
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 pb-4 pt-4">
     
      <div className="fixed right-4 top-4 w-[50px] h-[50px] rounded-full bg-indigo-500 flex justify-center items-center text-white text-3xl">
        <p>N</p>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8">
        <span className="text-blue-500">Remove background</span> images for free
      </h1>

      {
        !images && (
          <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:w-[600px] lg:h-[360px] shadow-2xl rounded-2xl p-8 bg-white">
            <div className="border-4 border-dashed h-full border-black/60 rounded-lg p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center text-center">
              <button
                onClick={filehandle}
                className="bg-indigo-500 w-full max-w-xs h-[50px] text-white text-sm sm:text-2xl md:text-3xl font-semibold py-4 px-4 lg:py-2 lg:px-6 text-[5vw] rounded-full mb-4 active:bg-[#2013E9]"
              >
                Upload Images
              </button>
              <input type="file" ref={fileinput} onChange={onChangeHandle} className="hidden" />
              <p className="text-black mt-2">
                or <span className="font-bold">drop a file</span>
              </p>
              <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                paste image or{" "}
                <a href="#" onClick={openModal} className="text-indigo-500 underline">
                  url
                </a>
              </p>
            </div>
          </div>
        )
      }

      {isLoading && <p>Processing your image...</p>}

      <div className="grid lg:grid-cols-2 lg:gap-8  ">
        {originalImage && !isLoading && (
          <div className="mt-8 lg:w-[700px]">
            <h2 className="text-lg font-bold text-center">Original Image:</h2>
            <div className="border-4 w-[300px] lg:w-[700px]  border-black/30 rounded-2xl bg-cover bg-no-repeat overflow-hidden">
              <img src={originalImage} alt="Original" className="max-w-full w-full  mt-4" />
            </div>
          </div>
        )}

        {processedImage && !isLoading && (
          <div className="mt-8 lg:w-[700px] ">
            <h2 className="text-lg font-bold text-center">Processed Image:</h2>
            <div className="border-4 w-[300px] lg:w-[700px]   border-black/30 rounded-2xl ">
              <img src={processedImage} alt="Processed" className="max-w-full mt-4 w-full " />
            </div>
            <div className="flex justify-center">
              <button onClick={()=>downloadImage()} className="bg-indigo-500 text-white px-4 py-2 rounded mt-4">Download</button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md mx-auto transform transition-transform duration-300 ease-out slide-in">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Paste Image URL</h2>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Enter image URL here"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUrlSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Removebg;
