import { useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import InputPassword from "../../components/InputPassword";
import { validateEmail } from "../../utilities/Helper";
import axiosInstance from '../../utilities/axiosInstance'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Email is invalid")
            return
        }

        if (!password) {
            setError("Password can not be empty!")
            return
        }

        // api call login
        try {
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password
            })

            // handel successful login respond
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken)
                navigate("/dashboard")
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
        }
    }

    console.log(password)

    return (
        <div className="h-screen bg-amber-50 overflow-hidden relative">
            <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
                <div className="w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10">
                    <p className="text-white text-3xl font-medium">Note App</p>
                </div>
                <div className="w-2/4 bg-white py-12 px-8  rounded-lg">
                    <p className="text-3xl font-medium">Login</p>
                    <form onSubmit={handleLogin}>
                        <div className="flex items-center gap-2 border rounded-md h-8 w-80 px-2 mt-5 hover:border-primary">
                            <MdOutlineMailOutline />
                            <input type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="focus:outline-none text-lg w-full" />
                        </div>

                        <InputPassword password={password} setPassword={(e) => setPassword(e.target.value)} />

                        {error && <p className="mt-2 text-red-400">{error}</p>}

                        <button
                            type="submit"
                            className="bg-primary w-28 h-7 mt-5 rounded-md text-white hover:scale-105 transition-all duration-300"
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login