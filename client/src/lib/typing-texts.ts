const commonWords = [
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our", "had", 
  "day", "get", "has", "him", "his", "how", "man", "new", "now", "old", "see", "two", "way", "who", 
  "boy", "did", "its", "let", "put", "say", "she", "too", "use", "about", "after", "again", "back",
  "could", "every", "first", "found", "great", "house", "just", "know", "like", "long", "made", "many",
  "may", "must", "never", "only", "other", "over", "right", "said", "same", "should", "since", "small",
  "such", "take", "than", "them", "well", "were", "what", "where", "which", "while", "work", "would",
  "write", "year", "years", "young", "your", "above", "across", "against", "along", "among", "around",
  "before", "behind", "below", "beneath", "beside", "between", "beyond", "during", "except", "inside",
  "instead", "outside", "through", "throughout", "together", "toward", "under", "until", "without",
  "within", "another", "because", "become", "between", "change", "coming", "course", "different",
  "example", "following", "however", "important", "including", "interest", "looking", "meaning",
  "nothing", "number", "people", "perhaps", "picture", "problem", "question", "really", "reason",
  "second", "several", "something", "special", "still", "student", "system", "thought", "through",
  "today", "together", "turned", "usually", "wanted", "water", "without", "world", "always", "around",
  "beautiful", "business", "community", "complete", "computer", "continue", "control", "country",
  "create", "development", "education", "experience", "family", "friend", "government", "group",
  "health", "history", "home", "human", "information", "international", "language", "large", "level",
  "life", "local", "member", "moment", "money", "music", "national", "nature", "night", "order",
  "part", "person", "place", "point", "power", "private", "program", "project", "public", "research",
  "result", "room", "school", "science", "service", "social", "society", "state", "story", "study",
  "technology", "thought", "time", "today", "university", "value", "week", "woman", "word", "world"
];

const quoteWords = [
  "success", "dream", "achieve", "believe", "create", "inspire", "motivate", "overcome", "persevere",
  "courage", "strength", "wisdom", "knowledge", "learn", "grow", "improve", "excel", "progress",
  "journey", "path", "destination", "goal", "vision", "mission", "purpose", "passion", "dedication",
  "commitment", "determination", "focus", "discipline", "patience", "persistence", "resilience",
  "innovation", "creativity", "imagination", "possibility", "opportunity", "challenge", "adventure",
  "discovery", "exploration", "freedom", "independence", "leadership", "teamwork", "collaboration",
  "communication", "understanding", "empathy", "compassion", "kindness", "generosity", "gratitude",
  "happiness", "joy", "peace", "love", "hope", "faith", "trust", "respect", "honor", "integrity",
  "honesty", "truth", "justice", "equality", "fairness", "balance", "harmony", "unity", "diversity",
  "excellence", "quality", "perfection", "mastery", "expertise", "skill", "talent", "ability",
  "potential", "capacity", "capability", "competence", "confidence", "self-esteem", "self-worth",
  "mindset", "attitude", "perspective", "viewpoint", "opinion", "thought", "idea", "concept",
  "principle", "value", "belief", "philosophy", "strategy", "method", "approach", "technique",
  "solution", "answer", "result", "outcome", "achievement", "accomplishment", "victory", "triumph",
  "breakthrough", "milestone", "landmark", "legacy", "impact", "influence", "contribution", "difference"
];

function generateText(words: string[], duration: number): string {
  const wordsPerMinute = 40; // Average typing speed
  const targetWords = Math.max(20, duration * wordsPerMinute / 60);
  
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  const selectedWords = [];
  
  for (let i = 0; i < targetWords; i++) {
    selectedWords.push(shuffled[i % shuffled.length]);
  }
  
  return selectedWords.join(' ');
}

export const typingTexts = {
  common: (duration: number) => generateText(commonWords, duration),
  quotes: (duration: number) => generateText(quoteWords, duration)
};
