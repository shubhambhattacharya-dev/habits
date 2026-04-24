import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetSequences() {
  try {
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"User"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"Habit"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"HabitCompletion"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"FocusSession"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"Distraction"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"ClaritySession"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"ClarityTask"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"DailyReflection"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"NeuroScoreEntry"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"Challenge"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"ChallengeDayLog"', 'id'), 0, false);
      SELECT setval(pg_get_serial_sequence('"BookWisdom"', 'id'), 0, false);
    `);
    console.log('All sequences reset to start from 0');
  } catch (error) {
    console.error('Failed to reset sequences:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetSequences();