"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
app.set("views", path_1.default.join(__dirname, "./views"));
app.set("view engine", "ejs");
// app.get("/", (req: Request, res: Response) => {
//   console.log("Root Route hit");
//   res.render("index.ejs");
// });
app.get("/artist/:artistId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("is this working???");
    try {
        const artistId = req.params.artistId;
        const token = yield getAccessToken();
        if (typeof artistId === "string") {
            const artistInfo = yield getArtistInfo(token, artistId);
            const artistAlbums = yield getAlbums(token, artistId);
            const artistTopTracks = yield getTopTracks(token, artistId);
            console.log(artistInfo);
            console.log("######################");
            console.log(artistAlbums);
            console.log("######################");
            console.log(artistTopTracks);
            res.render("artist", {
                artist: artistInfo,
                artistId: artistId,
                token: token,
                albums: artistAlbums,
                topTracks: artistTopTracks,
            });
        }
        else {
            res.status(400).send("Invalid artistId");
        }
    }
    catch (error) {
        // console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`https://accounts.spotify.com/api/token`, `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        console.log(response.data.access_token);
        return response.data.access_token;
    });
}
function getArtistInfo(token, artistId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    });
}
function getAlbums(token, artistId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    });
}
function getTopTracks(token, artistId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    });
}
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
