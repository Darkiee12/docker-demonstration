import axios, { AxiosRequestConfig } from "axios";
import "../utils/promise";
import Detection from "../models/Detection";
import { Err, Ok } from "../utils/result";

const API = import.meta.env.VITE_API_URL;
export async function detect(image: File): Promise<Result<Detection[]>>{
    const data = new FormData();
    data.append("image_file", image, "image_file");
    const config: AxiosRequestConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 5000
    };
    const [response, error] = await axios.post<Detection[]>(`${API}/detect`, data, config).toResult();
    if(error){
        console.error(error.message);
        return Err(error);
    }
    return Ok(response.data);
}

const DetectionService = {
    detect
}

export default DetectionService;