import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";

const InputPassword = ({ password, setPassword }) => {

    const [isShow, setIsShow] = useState(false)

    return (
        <div className="flex items-center gap-2 border rounded-md h-8 w-80 px-2 mt-2 hover:border-primary">
            <RiLockPasswordLine />
            <input
                type={isShow ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={setPassword}
                className="focus:outline-none text-lg w-full" />
        </div>
    )
}

export default InputPassword