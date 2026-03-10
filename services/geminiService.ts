
import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchGeneratedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a list of 12 fictional or real movies/shows for a streaming service. Include a mix of thrillers, sci-fi, dramas, and comedies. For each, generate two distinct Reddit-style review blurbs: one 'Top Praise' (marked with 🔥) and one 'Critical/Nuanced' (marked with ⚠️). These should be realistic, about 15-20 words each, with mock usernames and upvote counts.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              genre: { type: Type.STRING },
              matchScore: { type: Type.INTEGER, description: "A number between 60 and 99" },
              reviews: {
                type: Type.OBJECT,
                properties: {
                  imdbRating: { type: Type.NUMBER },
                  rtScore: { type: Type.INTEGER },
                  redditTrending: { type: Type.BOOLEAN },
                  redditComments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        emoji: { type: Type.STRING, enum: ["🔥", "⚠️"] },
                        text: { type: Type.STRING, description: "The review text (15-20 words)" },
                        author: { type: Type.STRING, description: "e.g. u/moviebuff99" },
                        upvotes: { type: Type.STRING, description: "e.g. 1.2K" }
                      },
                      required: ["emoji", "text", "author", "upvotes"]
                    }
                  }
                },
                required: ["imdbRating", "rtScore", "redditTrending", "redditComments"]
              },
              category: { 
                type: Type.STRING, 
                enum: ["recommended", "taste_cluster", "popular", "standard"] 
              }
            },
            required: ["id", "title", "description", "genre", "matchScore", "reviews", "category"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Add images locally to ensure they work (Gemini doesn't generate valid Unsplash/Picsum URLs reliably)
    return data.map((movie: any, index: number) => ({
      ...movie,
      imageUrl: `https://picsum.photos/seed/${movie.id || index}/400/600`
    }));

  } catch (error) {
    console.error("Failed to fetch from Gemini, using fallback data", error);
    return FALLBACK_MOVIES;
  }
};

const FALLBACK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Neon Horizon",
    description: "In a future where sleep is optional, one detective hunts a dream thief.",
    genre: "Sci-Fi Thriller",
    matchScore: 98,
    imageUrl: "https://picsum.photos/seed/neon/400/600",
    category: "recommended",
    reviews: { 
      imdbRating: 8.2, 
      rtScore: 94, 
      redditTrending: true,
      redditComments: [
        {
          emoji: "🔥",
          text: "Visually stunning noir that pays off. Lead detective carries the weight perfectly. If you loved Blade Runner, watch this.",
          author: "u/cyber_junkie",
          upvotes: "2.4K"
        },
        {
          emoji: "⚠️",
          text: "Gorgeous but glacially paced. The middle act almost lost me, but the ending twist was worth the wait.",
          author: "u/pacingPolice",
          upvotes: "850"
        }
      ]
    }
  },
  {
    id: "2",
    title: "The Last Barista",
    description: "A rom-com about the last coffee shop on Mars.",
    genre: "Rom-Com",
    matchScore: 85,
    imageUrl: "https://picsum.photos/seed/coffee/400/600",
    category: "popular",
    reviews: { 
      imdbRating: 7.4, 
      rtScore: 88, 
      redditTrending: false,
      redditComments: [
         {
          emoji: "🔥",
          text: "Surprisingly heartwarming. The chemistry between the leads is electric despite the silly premise.",
          author: "u/romcom_fan",
          upvotes: "1.1K"
        },
        {
          emoji: "⚠️",
          text: "A bit cheesy in the third act and the Mars CGI is obviously low budget, but fun.",
          author: "u/scifi_critic",
          upvotes: "420"
        }
      ]
    }
  },
   {
    id: "3",
    title: "Echoes of Silence",
    description: "A mute musician discovers a frequency that changes reality.",
    genre: "Drama",
    matchScore: 91,
    imageUrl: "https://picsum.photos/seed/echo/400/600",
    category: "taste_cluster",
    reviews: { 
      imdbRating: 8.9, 
      rtScore: 96, 
      redditTrending: true,
      redditComments: [
         {
          emoji: "🔥",
          text: "An auditory masterpiece. Watch with good headphones or don't watch it at all. Best sound design of the year.",
          author: "u/audiophile",
          upvotes: "3.8K"
        },
        {
          emoji: "⚠️",
          text: "Very experimental narrative structure. It's not for everyone, requires full attention.",
          author: "u/indie_lover",
          upvotes: "1.5K"
        }
      ]
    }
  }
];
