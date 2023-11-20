import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

import uploadSVG from "././assets/upload.svg";
import ImageCard from "./Components/ImageCard";
import OverlayImage from "./Components/OverlayImage";

function App() {
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    axios
      .get("https://nest-image-gallery.vercel.app/api/v1/image/all")
      .then(function (response) {
        const imageData = response.data.map((image) => {
          const newImage = { ...image, id: image._id, isChecked: false };
          return newImage;
        });
        setImages(imageData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  //to handle bulk unselect
  const handleUnChecked = () => {
    const uncheckedImages = images.map((img) => {
      return { ...img, isChecked: false };
    });
    setImages(uncheckedImages);
  };

  //to handle individual select
  const checked = (index) => {
    const updatedImages = [...images];
    updatedImages[index].isChecked = !updatedImages[index].isChecked;
    setImages(updatedImages);
  };

  //to handle delete
  const handleDelete = () => {
    const deletingIds = [];
    images.forEach((image) => {
      if (image.isChecked) {
        deletingIds.push(image.id);
      }
    });

    const deletingIdsStr = deletingIds.map((id) => `ids=${id}`).join("&");

    axios
      .delete(
        `https://nest-image-gallery.vercel.app/api/v1/image/delete-multiple?${deletingIdsStr}`
      )
      .then(function (response) {
        if (response.data.isDeleted) {
          const remainingImages = images.filter(
            (image) => !deletingIds.includes(image.id)
          );
          setImages(remainingImages);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDragStart = (event) => {
    const active = images.find((image) => image.id === event.active.id);
    setActiveImage(active.url);
  };

  const handleDragCancel = () => {
    setActiveImage(null);
  };

  //to handle dnd kit OnDragEnd
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setImages((images) => {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);
      return arrayMove(images, oldIndex, newIndex);
    });

    // setActiveImage(null);
  };

  //keeping the total selected img
  const totalChecked = images.filter((image) => image.isChecked).length ?? 0;

  //Separate imageCard for dnd kit with dnd kit function and props

  const handleFileChange = (e) => {
    const form = new FormData();

    const file = e.target.files[0];
    form.append("image", file);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=4389f6aa038004767b479af56fd374b6",
        form
      )
      .then(function (response) {
        createNewEntry({
          imgBBId: response.data.data.id,
          fileName: response.data.data.image.filename,
          url: response.data.data.image.url,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const createNewEntry = (body) => {
    axios
      .post("https://nest-image-gallery.vercel.app/api/v1/image/create", body)
      .then(function (response) {
        setImages([
          ...images,
          { ...response.data, id: response.data._id, isChecked: false },
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <div className="bg-white rounded-xl">
        <div className="px-1.5 py-3 border-black border-b-2">
          {/* checking if any image selected, if selected then delete button will appear */}
          {totalChecked ? (
            <div className="flex flex-row items-center justify-between  ">
              <div className="flex gap-4 border-white border-4">
                <input
                  className="mt-1 h-5 w-5 md:h-7 md:w-7"
                  type="checkbox"
                  onChange={() => handleUnChecked()}
                  defaultChecked={totalChecked > 0 ? true : false}
                />
                <span className="text-base md:text-2xl font-semibold">
                  {totalChecked} Images Selected
                </span>
              </div>

              <div
                className=" text-red-500 hover:cursor-pointer  flex justify-center items-center gap-3 text-base md:text-2xl  bg-slate-200 hover:bg-slate-400 rounded-md  font-semibold px-2 md:px-4 py-1 md:py-2"
                onClick={handleDelete}
              >
                Delete
              </div>
            </div>
          ) : (
            <div className="text-base md:text-2xl py-2 font-semibold">
              Image Gallery
            </div>
          )}
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-5 ">
              {images?.length > 0 ? (
                images.map((elm, index) => (
                  <ImageCard
                    key={elm.id}
                    index={index}
                    elm={elm}
                    checked={checked}
                  />
                ))
              ) : (
                <p className="text-3xl font-bold">No Images </p>
              )}
              <div className="h-56 w-56 flex flex-col  items-center justify-center bg-slate-100 border-dashed border-black border-2 rounded-lg">
                <img className="h-10 w-10" src={uploadSVG} />
                <label
                  htmlFor="file-upload"
                  className=" border-black  border-2 px-2 rounded-lg my-2 shadow-md  cursor-pointer custom-file-upload"
                >
                  Custom Upload
                </label>
                <input
                  className="cursor-pointer"
                  id="file-upload"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </div>
            </div>
          </SortableContext>
          <DragOverlay>
            {activeImage ? <OverlayImage url={activeImage} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}

export default App;
