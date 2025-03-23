import crypto from "crypto";
import SpotifyWebApi from "spotify-web-api-node";

import { CONFIGS } from "@/configs";

class SpotifyClient {
    private spotifyApi: SpotifyWebApi;

    constructor(credentials?: { access_token: string; refresh_token: string }) {
        this.spotifyApi = new SpotifyWebApi({
            clientId: CONFIGS.SPOTIFY.CLIENT_ID,
            clientSecret: CONFIGS.SPOTIFY.CLIENT_SECRET,
            redirectUri: `${CONFIGS.URL.APP_BASE_URL}${CONFIGS.SPOTIFY.REDIRECT_URI}`,
        });

        if (credentials) {
            this.spotifyApi.setAccessToken(credentials.access_token);
            this.spotifyApi.setRefreshToken(credentials.refresh_token);
        }
    }

    generateAuthorizationURL() {
        const state = crypto.randomUUID();
        const scopes = ["user-read-private", "user-read-email", "user-read-playback-state", "user-modify-playback-state"];

        return {
            state,
            authorization_url: this.spotifyApi.createAuthorizeURL(scopes, state),
        };
    }

    async getAccessToken(code: string) {
        const { body } = await this.spotifyApi.authorizationCodeGrant(code);

        this.spotifyApi.setAccessToken(body["access_token"]);
        this.spotifyApi.setRefreshToken(body["refresh_token"]);

        return body;
    }

    async refreshAccessToken() {
        const { body } = await this.spotifyApi.refreshAccessToken();

        this.spotifyApi.setAccessToken(body["access_token"]);

        return body;
    }

    async getUserProfile() {
        const { body } = await this.spotifyApi.getMe();

        return body;
    }

    async getCurrentPlayingTrack() {
        const { body } = await this.spotifyApi.getMyCurrentPlayingTrack();

        return body;
    }

    async seekToPosition(positionMs: number) {
        await this.spotifyApi.seek(positionMs);
    }
}

export default SpotifyClient;
