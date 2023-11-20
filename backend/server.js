
const { OpenAI } = require("openai");

const express = require('express');
const app = express();
const port = 3000; 

const openai = new OpenAI({
  apiKey: 'YOUR-OPENAI-API-KEY',
});


const cors = require('cors')
app.use(cors({origin:true}))

app.use(express.json());

app.post('/submit-form', async (req, res) => {
  const formData = req.body;
  console.log('Received form data: ');
  console.log(formData);

  try {
    const result = await generatePrompt(formData);
    console.log(result);
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



async function generatePrompt(formData) {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: generateAdString(formData)
        },
        {
          role: 'user',
          content: 'Generate ONE ad tag line for each ONLY, one from the perspective of a comedic outlook, and the other one as an infotainment. STRICTLY In the following format: Comedic: [comedicTagline], Infotainment: [infotainmentTagline]'
        }
      ],
      temperature: 0.8,
    });

    const result = completion.choices[0].message.content;
    return result;
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      throw new Error('An error occurred during your request.');
    }
  }
}


function generateAdString(formData) {

  const adString = `Imagine you are an experienced advertising agency. This is the brand info provided:
  brandName: '${formData.brandName}',
  serviceIndustry: '${formData.serviceIndustry}',
  targetUserAge: [${formData.targetUserAge.map(age => "'" + age + "'").join(", ")}],
  brandSlogan: '${formData.brandSlogan}',
  additionalComments: '${formData.additionalComments}'`;

  return adString;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



/*

ChatGPT prompt:

Imagine you are an advertising agency. This is the brand info provided:
brandName: 'Bata',
serviceIndustry: 'Sports',
targetUserAge: [adults],
brandSlogan: 'Boring corporate',
additionalComments: 
Generate ad tag lines, one from the perspective of a comedic outlook, and the other one as an infotainment. 


Output:

Comedic Tagline:
"Step up your game with Bata: Because life's too short for boring shoes in a boring corporate world!"

Infotainment Tagline:
"Unleash Your Potential with Bata: Where Comfort Meets Performance for the Modern Athlete in the Boardroom."

*/
