import axios from "axios";
import {config} from "@/api/config/env"

export const refreshClient = axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeout,
    headers: {"Content-Type": "application/json", Accept: "application/json"}
})