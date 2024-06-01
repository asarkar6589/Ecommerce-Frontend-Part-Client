import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";

const Login = () => {
    const [gender, setGender] = useState<string>("");
    const [date, setDate] = useState<string>("");

    const [login] = useLoginMutation()

    const loginHandeler = async () => {
        try {
            const provider = new GoogleAuthProvider();

            const { user } = await signInWithPopup(auth, provider);

            // name, email, photo and id, we will get it from firebase.
            const res = await login({
                name: user.displayName!,
                email: user.email!,
                photo: user.photoURL!,
                gender,
                role: "user",
                dob: date,
                _id: user.uid // very important, we will store this id instead of the id that is provided by mongodb.
            });

            if ("data" in res) {
                toast.success(res.data.message);
            }
            else {
                const error = res.error as FetchBaseQueryError;
                const message = (error.data as MessageResponse).message;
                toast.error(message)
            }
        } catch (error) {
            toast.error("Sign In failed");
        }
    }

    return (
        <div className="login">
            <main>
                <h1 className="heading">Login</h1>

                <div>
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="demal">Female</option>
                    </select>
                </div>

                <div>
                    <label>Date of birth</label>
                    <input type="date" name="" id="" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div>
                    <p>Already Signed In Once</p>

                    <button onClick={loginHandeler}>
                        <FcGoogle />
                        <span>Sign in With Google</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;
