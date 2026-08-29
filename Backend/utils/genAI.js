import "dotenv/config";

const getGenAIAPIResponse = async(message) => {
    const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemini-3.6-flash",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    // 1. Fixed URL: Points to Google's OpenAI-compatible endpoint
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      options
    );
    const data = await response.json();
    // console.log(data.choices[0].message.content);
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}

export default getGenAIAPIResponse;