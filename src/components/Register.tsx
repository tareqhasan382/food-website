/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignupMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";
type Inputs = {
  name: string;
  email: string;
  password: string;
};
const Register: React.FC = () => {
  let message = "";
  const [signup, { isLoading, isError, isSuccess }] = useSignupMutation();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const response: any = await signup(data);
    message = response?.data?.statusCode;
    console.log(response);
    if (isSuccess) {
      toast.success("User Register SuccessFully");
      // window.alert("user Loggegd in successfully");
      reset();
    } else {
      toast.error("User Register Faild");
      // window.alert("user loggedin faild");
    }
  };

  console.log("isSuccess:", isSuccess);
  console.log("isError:", isError);
  console.log("message:", message);

  return (
    <div className="bg-gray-200 ">
      <div>
        <Navbar />
      </div>
      <h1 className=" mt-[70px] pt-14  text-center text-xl font-bold ">
        Register Page
      </h1>
      {/*============== Register form ===================*/}
      <div className=" pt-8 pb-20 flex items-center justify-center px-2  ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" px-2 lg:w-[400px] w-full flex flex-col gap-3 py-5 outline rounded-md outline-1 outline-black"
        >
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="your name"
            className=" pl-2 w-full rounded-md h-10 focus:outline-none "
          />

          <input
            {...register("email", { required: true })}
            type="text"
            placeholder="email"
            className=" pl-2 w-full rounded-md h-10 focus:outline-none "
          />
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="password"
            className=" pl-2 w-full rounded-md h-10 focus:outline-none "
          />
          <p className=" text-sm font-bold text-right px-2 ">{message} </p>
          <button
            type="submit"
            disabled={isLoading}
            className=" cursor-pointer pl-2 w-full rounded-md bg-black text-white h-10 font-bold hover:bg-white hover:text-black transition ease-in-out duration-500 "
          >
            Register
          </button>
          <p className=" text-sm font-bold text-right px-2 ">
            Already have an account ?
            <Link to="/login">
              <span className=" text-blue-500 ">Login</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
