import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

const Login = () => {
    return (
        <div className="h-screen bg-amber-50 overflow-hidden relative">
            <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
                <div className="w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10">
                    <p className="text-white text-3xl font-medium">Note App</p>
                </div>
                <div className="w-2/4 bg-white py-12 px-8  rounded-lg">
                    <p className="text-3xl font-medium">Login</p>
                    <form>
                        <div className="flex items-center gap-2 border rounded-md h-8 w-80 px-2 mt-5">
                            <MdOutlineMailOutline />
                            <input type="text" placeholder="Email"
                                className="focus:outline-none text-lg w-full" />
                        </div>
                        <div className="flex items-center gap-2 border rounded-md h-8 w-80 px-2 mt-2">
                            <RiLockPasswordLine />
                            <input type="password" placeholder="Password"
                                className="focus:outline-none text-lg w-full" />
                        </div>

                        <button type="submit" className="bg-primary w-28 h-7 mt-5 rounded-md text-white">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login