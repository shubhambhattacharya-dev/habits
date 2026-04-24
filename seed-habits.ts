import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.create({
    data: {
      email: 'demo@neuroforge.app',
      password: '$2a$10$placeholder', // placeholder - should be reset if used
      name: 'Demo User'
    }
  });

  await prisma.habit.createMany({
    data: [
      { userId: user.id, name: '30 min Deep Work', identityStatement: 'I am a focused engineer', category: 'productivity', difficulty: 'hard', cue: 'Sit at desk at 9am', craving: 'Build something real', response: 'Open VS Code, timer on', reward: 'Log streak + coffee' },
      { userId: user.id, name: 'Read 10 pages', identityStatement: 'I am a lifelong learner', category: 'learning', difficulty: 'easy', cue: 'After lunch', craving: 'Gain new perspective', response: 'Pick up current book', reward: 'Note one insight' },
      { userId: user.id, name: 'No Reels before noon', identityStatement: 'I control my attention', category: 'mindset', difficulty: 'medium', cue: 'Morning alarm', craving: 'Protect morning brain', response: 'Phone stays in drawer', reward: 'NeuroScore boost' },
      { userId: user.id, name: 'Evening Reflection', identityStatement: 'I am self-aware', category: 'mindset', difficulty: 'easy', cue: '9pm alarm', craving: 'Understand my patterns', response: 'Open NeuroForge reflect', reward: 'Sleep with clarity' }
    ]
  });
  console.log('Seeded demo user and 4 demo habits');
}

run();