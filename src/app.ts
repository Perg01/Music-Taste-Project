import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// app.get("/", (req: Request, res: Response) => {
//   console.log("Root Route hit");
//   res.render("index.ejs");
// });

app.get("/artist/:artistId", async (req: Request, res: Response) => {
  console.log("is this working???");
  try {
    const artistId = req.params.artistId;
    const token = await getAccessToken();

    if (typeof artistId === "string") {
      const artistInfo = await getArtistInfo(token, artistId);
      const artistAlbums = await getAlbums(token, artistId);
      const artistTopTracks = await getTopTracks(token, artistId);

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
    } else {
      res.status(400).send("Invalid artistId");
    }
  } catch (error) {
    // console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

async function getAccessToken() {
  const response = await axios.post(
    `https://accounts.spotify.com/api/token`,
    `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  console.log(response.data.access_token);
  return response.data.access_token;
}

async function getArtistInfo(token: string, artistId: string) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getAlbums(token: string, artistId: string) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getTopTracks(token: string, artistId: string) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
