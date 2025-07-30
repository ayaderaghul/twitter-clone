// middlewares/validateTweet.js
export const validateTweet = (req, res, next) => {
  const { content } = req.body;

  // Basic existence check
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Tweet content is required and must be a string.' });
  }

  // Length limit
  if (content.length > 280) {
    return res.status(400).json({ error: 'Tweet content must be 280 characters or fewer.' });
  }

  // Optionally block empty tweets with just spaces
  if (content.trim().length === 0) {
    return res.status(400).json({ error: 'Tweet content cannot be empty.' });
  }

  next(); // Valid tweet, let it fly! 🐦
};
