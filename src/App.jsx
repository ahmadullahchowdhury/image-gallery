// import { useState } from "react";
// import "./App.css";
// import { Images } from "./util/image.util";

// function App() {
//   const [images, setImages] = useState([...Images]);

//   const [draggedImage, setDraggedImage] = useState(null);

//   const handleUnChecked = () => {
//     const uncheckedImages = images.map((img) => {
//       return { ...img, isChecked: false };
//     });
//     setImages(uncheckedImages);
//   };

//   const checked = (index) => {
//     const updatedImages = [...images];
//     updatedImages[index].isChecked = !updatedImages[index].isChecked;
//     setImages(updatedImages);
//   };

//   const handleDelete = () => {
//     console.log("delete");
//     const remainingImages = images.filter((image) => !image.isChecked);
//     setImages(remainingImages);
//   };

//   const handleDragStart = (image) => {
//     setDraggedImage(image);
//   };

//   const handleDrop = (targetIndex) => {
//     if (draggedImage) {
//       const updatedImages = [...images];

//       const removedImageIndex = updatedImages.findIndex(
//         (image) => image.id === draggedImage.id
//       );
//       if (removedImageIndex !== -1) {
//         updatedImages.splice(removedImageIndex, 1);
//         updatedImages.splice(targetIndex, 0, draggedImage);
//         setImages(updatedImages);
//         setDraggedImage(null);
//       }
//     }
//   };

//   const totalChecked = images.filter((image) => image.isChecked).length ?? 0;

//   const ImageCard = ({ elm, index }) => {
//     return (
//       <div
//         draggable={true}
//         onDragStart={() => handleDragStart(elm)}
//         onDrop={() => handleDrop(index)}
//         className={`${index === 0 ? "row-span-2 col-span-2" : ""} group `}
//         key={index}
//         onClick={() => checked(index)}
//       >
//         <div className="relative overflow-hidden rounded-lg border-slate border-2  ">
//           <img
//             className="w-full"
//             data-id={elm.id}
//             alt={elm.id}
//             src={elm?.image}
//           />
//           <div
//             className={`absolute h-full w-full ${
//               elm?.isChecked
//                 ? "bottom-0 opacity-100 bg-black/20"
//                 : "bg-black/40 opacity-0 -bottom-10"
//             }  group-hover:bottom-0 group-hover:opacity-100 ease-out  group-hover:ease-out delay-150 duration-300`}
//           >
//             <div className=" py-5 px-5">
//               <input
//                 className="w-5 h-5"
//                 // onChange={() => checked(index)}
//                 checked={elm?.isChecked}
//                 type="checkbox"
//               ></input>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="bg-white rounded-xl   ">
//         <div className="px-1.5 py-3 border-black border-b-2">
//           {totalChecked ? (
//             <div className="flex flex-row items-center justify-between  ">
//               <div className="flex gap-4 border-white border-4">
//                 <input
//                   className="mt-1 h-5 w-5 md:h-7 md:w-7"
//                   type="checkbox"
//                   onChange={() => handleUnChecked()}
//                   checked={totalChecked > 0 ? true : false}
//                 />
//                 <span className="text-base md:text-2xl font-semibold">
//                   {totalChecked} Images Selected
//                 </span>
//               </div>

//               <div
//                 className=" text-base md:text-2xl text-red-600 bg-slate-200 hover:bg-slate-400 rounded-md hover:cursor-pointer font-semibold px-2 md:px-4 py-1 md:py-2"
//                 onClick={handleDelete}
//               >
//                 Delete
//               </div>
//             </div>
//           ) : (
//             <div className="text-base md:text-2xl py-2 font-semibold">
//               Image Gallery
//             </div>
//           )}
//         </div>

//         <div
//           onDragOver={(e) => {
//             e.preventDefault();
//           }}
//           className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-5 "
//         >
//           {images.length > 0 ? (
//             images.map((elm, index) => (
//               <ImageCard key={index} index={index} elm={elm} />
//             ))
//           ) : (
//             <p className="text-3xl font-bold">No Images </p>
//           )}
//           <div className="flex flex-col w-full items-center justify-center bg-slate-100 border-dashed border-black border-2 rounded-lg">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               className="w-5 h-5"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
//               />
//             </svg>

//             <p>Upload Images</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;


import { useState } from "react";
import "./App.css";
import { Images } from "./util/image.util";
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function App() {
  const [images, setImages] = useState([...Images]);

  const [dragging, setDragging] = useState(false);
  const [draggedImage, setDraggedImage] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const ImageCard = ({ elm, index }) => {

    
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: elm.id });
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };
    return (
      <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
        // draggable={true}
        // onDragStart={() => handleDragStart(elm)}
        // onDrop={() => handleDrop(index)}
        className={`${index === 0 ? "row-span-2 col-span-2" : " "} group `}
        key={index}
        onClick={() => {
          console.log('Image clicked')
          checked(index)}}      >
        <div className="relative overflow-hidden rounded-lg border-slate border-2  ">
          <img
            className="w-full"
            data-id={elm.id}
            
            src={elm?.image}
          />
          <div
            className={`absolute h-full w-full ${
              elm?.isChecked
                ? "bottom-0 opacity-100 bg-black/20"
                : "bg-black/40 opacity-0 -bottom-10"
            }  group-hover:bottom-0 group-hover:opacity-100 ease-out  group-hover:ease-out delay-150 duration-300`}
          >
            <div className=" py-5 px-5">
              <input
                className="w-5 h-5"
                onClick={() => {
                  console.log('Image clicked')
                  checked(index)}}
                checked={elm?.isChecked}
                type="checkbox"
              ></input>
            </div>
          </div>

          
        </div>
      </div>
    );
  };

  const handleUnChecked = () => {
    const uncheckedImages = images.map((img) => {
      return { ...img, isChecked: false };
    });
    setImages(uncheckedImages);
  };

  const checked = (index) => {
    console.log('checked')
    const updatedImages = [...images];
    updatedImages[index].isChecked = !updatedImages[index].isChecked;
    setImages(updatedImages);
  };

  const handleDelete = () => {
    console.log("delete");
    const remainingImages = images.filter((image) => !image.isChecked);
    setImages(remainingImages);
  };


  const onDragEnd = (event) => {
    // console.log(event)
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setImages((images) => {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);
      return arrayMove(images, oldIndex, newIndex);
    });
  }

  // const handleDragStart = (image) => {
  //   setDragging(true);

  //   setDraggedImage(image);
  // };
  // const handleDrop = (targetIndex) => {
  //   setDragging(false);

  //   if (draggedImage) {
  //     const updatedImages = images.filter(
  //       (image) => image.id !== draggedImage.id
  //     );
  //     updatedImages.splice(targetIndex, 0, draggedImage);

  //     setImages(updatedImages);
  //     setDraggedImage(null);
  //   }
  // };

  // const handleDragOver = (e) => {
  //   e.preventDefault();
  //   const firstChild = e.target.children[0];
  //   console.log("firstChild", firstChild);

  //   if (firstChild && firstChild.dataset.id) {
  //     setDraggedIndex(firstChild.dataset.id);
  //   }
  // };

  const totalChecked = images.filter((image) => image.isChecked).length ?? 0;

  return (
    <>
      <div className="bg-white rounded-xl   ">
        <div className="px-1.5 py-3 border-black border-b-2">
          {totalChecked ? (
            <div className="flex flex-row items-center justify-between  ">
              <div className="flex gap-4 border-white border-4">
                <input
                  className="mt-1 h-5 w-5 md:h-7 md:w-7"
                  type="checkbox"
                  onChange={() => handleUnChecked()}
                  checked={totalChecked > 0 ? true : false}
                />
                <span className="text-base md:text-2xl font-semibold">
                  {totalChecked} Images Selected
                </span>
              </div>

              <div
                className=" text-base md:text-2xl  bg-slate-200 hover:bg-slate-400 rounded-md hover:cursor-pointer font-semibold px-2 md:px-4 py-1 md:py-2"
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
        

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} >
          <SortableContext items={images} strategy={rectSortingStrategy}>
        <div
          // onDragOver={handleDragOver}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-5 "
        >
          {images.length > 0 ? (
            images.map((elm, index) => (
              <ImageCard key={index} index={index} elm={elm} />
            ))
          ) : (
            <p className="text-3xl font-bold">No Images </p>
          )}
          
          <div className="flex flex-col w-full items-center justify-center bg-slate-100 border-dashed border-black border-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>

            <p>Upload Images</p>
          </div>
        </div>
        </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default App;