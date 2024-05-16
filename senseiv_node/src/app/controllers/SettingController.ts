import {jsonResponse} from "../helpers/helpers";
import Setting from "../models/Setting";
import {SettingUpdateRequest, TriggerHighSwapRequest} from "../../types/requests/settings";

class SettingController {
    static async getAll() {
        return jsonResponse(await Setting.findAll() || [])
    }

    static async triggerHighSwap(request: TriggerHighSwapRequest) {
        if (!request.body.type) {
            return jsonResponse({}, false, 'Type is required')
        }

        const type = request.body.type


        return jsonResponse({}, true, 'High swap triggered')
    }

    static async update(request: SettingUpdateRequest) {
        if (!request.body.name) {
            return jsonResponse({}, false, 'Name is required')
        }

        if (!request.body.value) {
            return jsonResponse({}, false, 'Value is required')
        }

        const name = request.body.name
        const value = request.body.value

        await Setting.update({value}, {where: {name}})
        const settings = await Setting.findAll()

        return jsonResponse(settings, true, 'Setting updated')
    }
}

export default SettingController