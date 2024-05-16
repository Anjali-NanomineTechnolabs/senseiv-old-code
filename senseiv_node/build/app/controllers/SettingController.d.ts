import { SettingUpdateRequest, TriggerHighSwapRequest } from "../../types/requests/settings";
declare class SettingController {
    static getAll(): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static triggerHighSwap(request: TriggerHighSwapRequest): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
    static update(request: SettingUpdateRequest): Promise<{
        success: boolean;
        message: string;
        data: object | null;
        code: string;
    }>;
}
export default SettingController;
