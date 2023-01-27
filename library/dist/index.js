var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NounsDataClient } from "./NounsDataClient.js";
export const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new NounsDataClient();
    yield client.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688");
    console.log("getNounishProfile()" + JSON.stringify(yield client.getNounishProfile()));
    console.log("getCeramicProposals()" + JSON.stringify(yield client.getCeramicProposals()));
});
