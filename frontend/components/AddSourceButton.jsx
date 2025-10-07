import { FiPlus } from "react-icons/fi";
export default function AddSourceButton(props) {
    return (
        <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            onClick={() => {props.func()}}
        >
            <FiPlus className="mr-2" />
            {props.text} 
        </button>
    )
}