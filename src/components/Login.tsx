/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoginMutation } from "../redux/api/authApi";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { setToLocalStorage } from "../utills/local-storage";
import { authKey } from "../constant/storageKey";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
type Inputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const response: any = await login(data);
    //window.alert(response?.data?.message);
    if (!isLoading && response?.data?.data?.accessToken) {
      toast.success("User loggedIn SuccessFully");
      setToLocalStorage(authKey, response?.data?.data?.accessToken);
      navigate("/");
    }
    reset();
    console.log(response);
  };
  console.log("isSuccess:", isSuccess);
  console.log("isLoading:", isLoading);
  // grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 || gray-200
  return (
    <div className=" min-h-screen bg-slate-300 ">
      {/* <div>
        <Navbar />
      </div> */}
      <h1 className=" mt-[70px] pt-14  text-center text-xl font-bold ">
        Login Page
      </h1>
      {/*============== login form ===================*/}
      <div className=" pt-8 pb-24 flex items-center justify-center px-2  ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" px-2 lg:w-[400px] w-full flex flex-col gap-3 py-5 outline rounded-md outline-1 outline-black "
        >
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
          <button
            type="submit"
            disabled={isLoading}
            className=" cursor-pointer pl-2 w-full rounded-md bg-black text-white h-10 font-bold hover:bg-white hover:text-black transition ease-in-out duration-500 "
          >
            Login
          </button>
          <p className=" text-sm font-bold text-right px-2 ">
            Don't Have an account ?
            <Link to="/register">
              <span className=" text-blue-500 "> Register</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
