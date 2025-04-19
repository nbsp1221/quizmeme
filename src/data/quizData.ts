import { QuizPack } from '../types/quiz';

// Helper to generate a date string for a specific number of days from today
const daysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0] || '';
};

// Generate a week's worth of quiz packs
export const quizPacks: QuizPack[] = [
  {
    id: 'tech-trivia-1',
    title: 'Tech Trivia',
    description: 'Test your knowledge of technology history and facts!',
    emoji: '💻',
    releaseDate: daysFromNow(0), // Today
    questions: [
      {
        id: 'tech-1',
        text: 'Which company created the first smartphone with a touchscreen?',
        options: ['Apple', 'IBM', 'Nokia', 'BlackBerry'],
        correctOptionIndex: 1 // IBM (Simon Personal Communicator, 1992)
      },
      {
        id: 'tech-2',
        text: 'What year was the first iPhone released?',
        options: ['2005', '2006', '2007', '2008'],
        correctOptionIndex: 2 // 2007
      },
      {
        id: 'tech-3',
        text: 'What does "HTTP" stand for?',
        options: [
          'HyperText Transfer Protocol',
          'High Tech Transfer Process',
          'Hybrid Text Technology Platform',
          'Home Tool Transfer Protocol'
        ],
        correctOptionIndex: 0 // HyperText Transfer Protocol
      },
      {
        id: 'tech-4',
        text: 'Who is considered the father of the World Wide Web?',
        options: [
          'Bill Gates',
          'Steve Jobs',
          'Tim Berners-Lee',
          'Vint Cerf'
        ],
        correctOptionIndex: 2 // Tim Berners-Lee
      },
      {
        id: 'tech-5',
        text: 'Which programming language was created first?',
        options: ['Java', 'Python', 'FORTRAN', 'C'],
        correctOptionIndex: 2 // FORTRAN (1957)
      }
    ]
  },
  {
    id: 'pop-culture-1',
    title: 'Pop Culture Mania',
    description: 'How well do you know your memes and trends?',
    emoji: '🎭',
    releaseDate: daysFromNow(1), // Tomorrow
    questions: [
      {
        id: 'pop-1',
        text: 'Which viral video featured a dramatic chipmunk turning to the camera?',
        options: [
          'Charlie Bit My Finger',
          'Dramatic Chipmunk',
          'Keyboard Cat',
          'Nyan Cat'
        ],
        correctOptionIndex: 1 // Dramatic Chipmunk
      },
      {
        id: 'pop-2',
        text: 'What year did the "Harlem Shake" meme go viral?',
        options: ['2010', '2011', '2012', '2013'],
        correctOptionIndex: 3 // 2013
      },
      {
        id: 'pop-3',
        text: 'Which clothing item became unexpectedly popular due to Bernie Sanders at the 2021 inauguration?',
        options: ['Scarves', 'Mittens', 'Beanies', 'Boots'],
        correctOptionIndex: 1 // Mittens
      },
      {
        id: 'pop-4',
        text: 'The phrase "OK Boomer" is directed at which generation?',
        options: [
          'Generation X',
          'Millennials',
          'Baby Boomers',
          'Generation Z'
        ],
        correctOptionIndex: 2 // Baby Boomers
      },
      {
        id: 'pop-5',
        text: 'Which viral challenge involved dumping ice water on your head?',
        options: [
          'Cinnamon Challenge',
          'Ice Bucket Challenge',
          'Mannequin Challenge',
          'Tide Pod Challenge'
        ],
        correctOptionIndex: 1 // Ice Bucket Challenge
      }
    ]
  },
  {
    id: 'science-1',
    title: 'Science Wonders',
    description: 'Explore the fascinating world of scientific discoveries!',
    emoji: '🔬',
    releaseDate: daysFromNow(2), // Day after tomorrow
    questions: [
      {
        id: 'sci-1',
        text: 'What is the hardest natural substance on Earth?',
        options: ['Titanium', 'Diamond', 'Tungsten', 'Graphene'],
        correctOptionIndex: 1 // Diamond
      },
      {
        id: 'sci-2',
        text: 'What is the smallest unit of life?',
        options: ['Atom', 'Cell', 'Molecule', 'Organelle'],
        correctOptionIndex: 1 // Cell
      },
      {
        id: 'sci-3',
        text: 'Which planet has the most moons?',
        options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        correctOptionIndex: 1 // Saturn (as of latest count)
      },
      {
        id: 'sci-4',
        text: 'What percentage of the human body is water?',
        options: ['50-60%', '60-70%', '70-80%', '80-90%'],
        correctOptionIndex: 1 // 60-70%
      },
      {
        id: 'sci-5',
        text: 'Which animal can regenerate its limbs?',
        options: ['Lobster', 'Starfish', 'Jellyfish', 'All of these'],
        correctOptionIndex: 3 // All of these
      }
    ]
  },
  {
    id: 'history-1',
    title: 'History Mysteries',
    description: 'Journey through time with these historical riddles!',
    emoji: '⏳',
    releaseDate: daysFromNow(3),
    questions: [
      {
        id: 'hist-1',
        text: 'Which civilization built Machu Picchu?',
        options: ['Aztec', 'Inca', 'Maya', 'Olmec'],
        correctOptionIndex: 1 // Inca
      },
      {
        id: 'hist-2',
        text: 'Which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctOptionIndex: 2 // 1945
      },
      {
        id: 'hist-3',
        text: 'Who was the first woman to win a Nobel Prize?',
        options: [
          'Marie Curie',
          'Rosalind Franklin',
          'Ada Lovelace',
          'Florence Nightingale'
        ],
        correctOptionIndex: 0 // Marie Curie
      },
      {
        id: 'hist-4',
        text: 'Which ancient wonder was located in Alexandria?',
        options: [
          'The Hanging Gardens',
          'The Lighthouse',
          'The Colossus',
          'The Temple of Artemis'
        ],
        correctOptionIndex: 1 // The Lighthouse
      },
      {
        id: 'hist-5',
        text: 'Who painted the Mona Lisa?',
        options: [
          'Vincent van Gogh',
          'Leonardo da Vinci',
          'Pablo Picasso',
          'Michelangelo'
        ],
        correctOptionIndex: 1 // Leonardo da Vinci
      }
    ]
  },
  {
    id: 'gaming-1',
    title: 'Gaming Greats',
    description: 'Level up your gaming knowledge with these questions!',
    emoji: '🎮',
    releaseDate: daysFromNow(4),
    questions: [
      {
        id: 'game-1',
        text: 'Which game featured the first widely recognized Easter egg?',
        options: [
          'Pac-Man',
          'Adventure (Atari 2600)',
          'Super Mario Bros.',
          'Donkey Kong'
        ],
        correctOptionIndex: 1 // Adventure
      },
      {
        id: 'game-2',
        text: 'Which character is NOT from the Final Fantasy series?',
        options: ['Cloud Strife', 'Tifa Lockhart', 'Link', 'Tidus'],
        correctOptionIndex: 2 // Link (from Legend of Zelda)
      },
      {
        id: 'game-3',
        text: 'What year was Minecraft first released to the public?',
        options: ['2008', '2009', '2010', '2011'],
        correctOptionIndex: 2 // 2010 (alpha)
      },
      {
        id: 'game-4',
        text: 'Which company developed the game "The Witcher 3: Wild Hunt"?',
        options: [
          'Bethesda',
          'Ubisoft',
          'CD Projekt Red',
          'BioWare'
        ],
        correctOptionIndex: 2 // CD Projekt Red
      },
      {
        id: 'game-5',
        text: 'What was the first commercially successful video game?',
        options: [
          'Pong',
          'Space Invaders',
          'Pac-Man',
          'Donkey Kong'
        ],
        correctOptionIndex: 0 // Pong
      }
    ]
  },
  {
    id: 'food-1',
    title: 'Food Frenzy',
    description: 'Satisfy your hunger for food knowledge!',
    emoji: '🍔',
    releaseDate: daysFromNow(5),
    questions: [
      {
        id: 'food-1',
        text: 'Which country invented pizza?',
        options: ['United States', 'Greece', 'Italy', 'France'],
        correctOptionIndex: 2 // Italy
      },
      {
        id: 'food-2',
        text: 'What is the main ingredient in traditional hummus?',
        options: ['Lentils', 'Chickpeas', 'Black beans', 'Soybeans'],
        correctOptionIndex: 1 // Chickpeas
      },
      {
        id: 'food-3',
        text: 'Which spice is known as "red gold"?',
        options: ['Cinnamon', 'Turmeric', 'Saffron', 'Paprika'],
        correctOptionIndex: 2 // Saffron
      },
      {
        id: 'food-4',
        text: 'Which fruit is technically a berry?',
        options: ['Strawberry', 'Banana', 'Cherry', 'Apple'],
        correctOptionIndex: 1 // Banana
      },
      {
        id: 'food-5',
        text: 'What is the national dish of Spain?',
        options: ['Gazpacho', 'Tortilla Española', 'Paella', 'Churros'],
        correctOptionIndex: 2 // Paella
      }
    ]
  },
  {
    id: 'movies-1',
    title: 'Movie Magic',
    description: 'Test your cinematic knowledge!',
    emoji: '🎬',
    releaseDate: daysFromNow(6),
    questions: [
      {
        id: 'movie-1',
        text: 'Which film won the first Academy Award for Best Picture?',
        options: [
          'Wings',
          'Gone with the Wind',
          'All Quiet on the Western Front',
          'Casablanca'
        ],
        correctOptionIndex: 0 // Wings (1927)
      },
      {
        id: 'movie-2',
        text: 'Who directed "Jurassic Park"?',
        options: [
          'James Cameron',
          'Steven Spielberg',
          'George Lucas',
          'Christopher Nolan'
        ],
        correctOptionIndex: 1 // Steven Spielberg
      },
      {
        id: 'movie-3',
        text: 'Which actor has won the most Academy Awards?',
        options: [
          'Meryl Streep',
          'Katharine Hepburn',
          'Jack Nicholson',
          'Daniel Day-Lewis'
        ],
        correctOptionIndex: 1 // Katharine Hepburn (4 Best Actress awards)
      },
      {
        id: 'movie-4',
        text: 'What was the first feature-length animated film?',
        options: [
          'Snow White and the Seven Dwarfs',
          'Fantasia',
          'Pinocchio',
          'Bambi'
        ],
        correctOptionIndex: 0 // Snow White and the Seven Dwarfs
      },
      {
        id: 'movie-5',
        text: 'Which movie features the character Jack Dawson?',
        options: ['Avatar', 'Inception', 'Titanic', 'The Revenant'],
        correctOptionIndex: 2 // Titanic
      }
    ]
  }
];

// Function to get today's quiz pack
export const getTodaysQuiz = (): QuizPack | undefined => {
  const today = new Date().toISOString().split('T')[0] || '';
  return quizPacks.find(pack => pack.releaseDate === today);
};

// Function to get all available quiz packs up to today
export const getAvailableQuizPacks = (): QuizPack[] => {
  const today = new Date().toISOString().split('T')[0] || '';
  return quizPacks.filter(pack => pack.releaseDate <= today);
}; 