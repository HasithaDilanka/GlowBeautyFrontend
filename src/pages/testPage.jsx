import { useState } from "react";

export default function TestPage() {

    const [count , setCount] = useState(0)       //a = state variable, b = function 
   // const [name, setName] = useState("Hasitha");

    function increment() {
        setCount(count + 1);
    }

    function decrement() {
        setCount(count - 1);
    }


    return (
        <div className="w-full bg-amber-200 h-screen flex items-center justify-center">
            <div className="w-[400px] h-[400px] bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">

                <h1 className="text-5xl font-bold">{count}</h1>

                <div className="w-full flex justify-center items-center  h-[100px]">

                    <button onClick={increment} className=" w-[100px] bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300 mx-5 text-2xl">
                        +
                    </button>

                    <button onClick={decrement} className="w-[100px] bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300 text-2xl">
                        -
                    </button>

                </div>
            </div>
        </div>
    );
}