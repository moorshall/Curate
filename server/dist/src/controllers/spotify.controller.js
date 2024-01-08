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
exports.populateSpotifyFeed = exports.fetchPlaylistSongs = exports.searchSpotify = void 0;
const axios_1 = __importDefault(require("axios"));
const spotify_client_token_1 = require("../utils/spotify-client-token");
const searchSpotify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.body;
    const type = encodeURIComponent(search.types.join());
    try {
        const token = yield (0, spotify_client_token_1.getClientToken)();
        const searchResults = yield (0, axios_1.default)({
            method: "get",
            url: `https://api.spotify.com/v1/search?q=${search.term}&type=${type}&limit=${search.limit}&offset=${search.offset}`,
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = searchResults.data;
        // console.log(data.tracks.items[0]);
        // console.log(data.albums.items[0]);
        //console.log(data.artists.items[1]);
        let result = {};
        for (const itemType in data) {
            const items = data[itemType].items;
            result[itemType] = [];
            for (const item of items) {
                if (itemType === "albums") {
                    result[itemType].push({
                        type: itemType,
                        uri: item.uri,
                        title: item.name,
                        name: item.artists[0].name,
                        imageUrl: item.images[0].url,
                        releaseDate: item.release_date,
                    });
                }
                if (itemType === "tracks") {
                    result[itemType].push({
                        type: itemType,
                        uri: item.uri,
                        title: item.name,
                        name: item.artists[0].name,
                        imageUrl: item.album.images[0].url,
                        releaseDate: item.release_date,
                    });
                }
                if (itemType === "artists") {
                    result[itemType].push({
                        type: itemType,
                        uri: item.uri,
                        title: null,
                        name: item.name,
                        imageUrl: item.images[0] ? item.images[0].url : "",
                        releaseDate: null,
                    });
                }
            }
        }
        return res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(`Error searching with spotify client`);
    }
});
exports.searchSpotify = searchSpotify;
const fetchPlaylistSongs = (token, url) => __awaiter(void 0, void 0, void 0, function* () {
    const songResults = yield (0, axios_1.default)({
        method: "get",
        url: url,
        headers: { Authorization: `Bearer ${token}` },
    });
    return songResults.data.items.map((song) => {
        var _a, _b, _c, _d, _e;
        return ({
            id: (_a = song.track) === null || _a === void 0 ? void 0 : _a.id,
            title: (_b = song.track) === null || _b === void 0 ? void 0 : _b.name,
            artist: (_c = song.track) === null || _c === void 0 ? void 0 : _c.artists[0].name,
            imageUrl: (_e = (_d = song.track) === null || _d === void 0 ? void 0 : _d.album.images[0]) === null || _e === void 0 ? void 0 : _e.url,
        });
    });
});
exports.fetchPlaylistSongs = fetchPlaylistSongs;
const populateSpotifyFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, spotify_client_token_1.getClientToken)();
        const playlistResults = yield (0, axios_1.default)({
            method: "get",
            url: `https://api.spotify.com/v1/browse/featured-playlists?country=US`,
            headers: { Authorization: `Bearer ${token}` },
        });
        const playlists = playlistResults.data.playlists.items;
        const result = yield Promise.all(playlists.map((playlist) => __awaiter(void 0, void 0, void 0, function* () {
            const songs = yield (0, exports.fetchPlaylistSongs)(token, playlist.tracks.href);
            return {
                id: playlist.id,
                title: playlist.name,
                author: playlist.owner.display_name,
                description: playlist.description.replace(/Cover:.*$/, ""),
                songs: songs,
                downloads: 0,
                likes: [],
                comments: [],
            };
        })));
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(`Error searching with spotify client`);
    }
});
exports.populateSpotifyFeed = populateSpotifyFeed;
