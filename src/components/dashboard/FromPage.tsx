/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useAddFoodMutation } from "../../redux/api/foodApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
type Inputs = {
  name: string;
  category: string;
  Image: string;
  price: string;
};
const FromPage = () => {
  const navigate = useNavigate();
  const [addFood, { isLoading: loading, isSuccess }] = useAddFoodMutation();
  const [selectImage, setSelectImage] = useState<File | null>(null);
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectImage(e.target.files[0]);
    }
  };
  const [isLoading, setLoading] = useState<boolean>();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setLoading(true);

    if (selectImage) {
      const formData = new FormData();
      //selectImage || formData.append("file", data.image[0]);
      formData.append("file", selectImage);
      formData.append("upload_preset", "Reservation");
      // Make a request to Cloudinary using axios
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dsybkyula/image/upload",
        formData
      );

      const imageUrl = response.data.secure_url;

      const foodData: Inputs = {
        name: data.name,
        category: data.category,
        price: data.price,
        Image: imageUrl,
      };
      const res: any = await addFood(foodData);
      // res?.data?.success === true
      if (!loading && res?.data?.success === true) {
        toast.success("Food Added Successfully");
        navigate("/dashboard");
      }

      setLoading(false);
    }
  };
  console.log("isSuccess:", isSuccess);
  return (
    <div className=" flex items-center justify-center w-full ">
      <div className=" w-full px-4 lg:px-24 flex flex-col lg:flex-row justify-between gap-5 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" w-full flex flex-col gap-3 "
        >
          <p className=" text-base font-semibold py-3 ">Enter Your details</p>
          <input
            {...register("name", { required: true })}
            required
            type="text"
            placeholder=" enter food name"
            className=" w-full focus:outline-none h-10 rounded px-2 "
          />
          <input
            {...register("category", { required: true })}
            required
            type="text"
            placeholder="enter food category"
            className=" w-full focus:outline-none h-10 rounded px-2 "
          />
          <input
            {...register("price", { required: true })}
            required
            type="text"
            placeholder="enter food price"
            className=" w-full focus:outline-none h-10 rounded px-2 "
          />
          <input
            onChange={handleImageChange}
            // {...register("image", { required: true })}
            required
            type="file"
            placeholder="Upload Food Image"
            className=" focus:outline-none bg-white h-10 rounded px-2 right-0 py-1 items-center "
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading && " opacity-30 "
            }w-full h-10 rounded font-bold bg-black text-white hover:bg-slate-800 transition ease-in-out duration-1000`}
          >
            Submit
          </button>
        </form>
        <div className=" mt-16 w-[200px] h-[200px] bg-white rounded-md flex items-center justify-center border border-spacing-2 border-black ">
          {selectImage ? (
            <img src={URL.createObjectURL(selectImage)} alt="img" />
          ) : (
            <p className=" text-center ">
              Food image upload preview will appear here!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FromPage;
