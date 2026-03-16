import { $api, config } from "../index";

export const getCommon = () => {
    return $api.get('/api', { headers: config() });
}