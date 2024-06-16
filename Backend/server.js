const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const imgbbUploader = require('imgbb-uploader');
const op = require('openai');
require('dotenv').config();
const OpenAI = op.OpenAI;

const app = express();
app.use(cors());
app.use(fileUpload());

const openai = new OpenAI({
  apiKey: process.env.OPENAI
});

// Replace with your own imgbb API key
const imgbbApiKey = process.env.IMGBB;

app.post('/api/analyze', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const image = req.files.file;
  const tempFilePath = path.join(__dirname, 'uploads', image.name);

  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

  image.mv(tempFilePath, async (err) => {
    if (err) {
      return res.status(500).send('Failed to save the uploaded file.');
    }

    try {
      // Upload the image to imgbb
      const imgbbResponse = await imgbbUploader(imgbbApiKey, tempFilePath);
      const imageUrl = imgbbResponse.url;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'You are a fashion expert bot you take image and analyze the outfit in that and give you rating and tell you how can you improve your outfit. So I want you to give me only rating out of 10 in first line in second line describe what good or bad is in the current outfit and in third line what can you add or change to improve your outfit.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ]
      });

      console.log(response.choices[0]);

      if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
        const content = response.choices[0].message.content.split('\n').filter(line => line.trim() !== '');
        const [rating, comments, suggestions] = content;
        res.json({
          rating,
          comments,
          suggestions
        });
      } else {
        res.status(500).send('Unexpected response structure from OpenAI API');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error analyzing the image');
    } finally {
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error('Failed to delete temporary file:', err);
      });
    }
  });
});

app.listen(4000, () => {
  console.log('Server started on http://localhost:4000');
});
