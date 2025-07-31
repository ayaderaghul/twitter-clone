const lda =require('lda')
const compromise = require('compromise')

function analyzeTrends(tweets) {
    const texts = tweets.map(tweet => {
        let doc = compromise(tweet.content)
        return doc.normalize().out('text')
    })

    // const result = lda(texts, 5, 1) // topics, terms 
    // return result

    // Run LDA - 5 topics, 10 terms each
  const rawResults = lda(texts, 5, 2);

  // 3. Global deduplication across all topics
  const allTerms = [];
  const seenTerms = new Set();
  const finalTopics = [];
  
  // First pass: collect all terms with their max probability
  rawResults.forEach(topic => {
    topic.forEach(({ term, probability }) => {
      if (!seenTerms.has(term)) {
        seenTerms.add(term);
        allTerms.push({ term, probability, topicWeight: probability });
      } else {
        // Update if this occurrence has higher probability
        const existing = allTerms.find(t => t.term === term);
        if (existing && probability > existing.probability) {
          existing.probability = probability;
        }
      }
    });
  });

  // 4. Reconstruct topics with unique terms
  rawResults.forEach(topic => {
    const uniqueTopic = [];
    const usedTerms = new Set();
    
    // Sort terms by probability descending
    const sortedTerms = [...topic].sort((a, b) => b.probability - a.probability);
    
    for (const { term, probability } of sortedTerms) {
      if (!usedTerms.has(term) && seenTerms.has(term)) {
        uniqueTopic.push({ term, probability });
        usedTerms.add(term);
        seenTerms.delete(term); // Prevent term from appearing in other topics
        if (uniqueTopic.length >= 5) break; // Limit terms per topic
      }
    }
    
    if (uniqueTopic.length > 0) {
      finalTopics.push(uniqueTopic);
    }
  });

  return finalTopics;
}

module.exports = {analyzeTrends}