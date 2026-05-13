import { useContext } from "react";
import { AuthContextStruct } from "../context/authProvider";


const useAuth = () => useContext(AuthContextStruct);

export { useAuth };