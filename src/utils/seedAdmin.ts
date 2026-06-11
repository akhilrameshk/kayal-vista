import { User } from '@/models/User';

export async function seedSuperAdmin() {
  try {
    const adminExists = await User.findOne({ role: 'SUPER_ADMIN' });
    
    if (!adminExists) {
      await User.create({
        fullName: 'System Super Administrator',
        username: 'admin',
        email: 'admin@kayalvista.com',
        contactDetails: '+91 477 224 8900',
        password: 'password123', // In production, wrap this with a hashing library like bcrypt
        role: 'SUPER_ADMIN',
      });
      console.log('📦 Database Seeder: Super Admin account generated in kayalvista.');
    }
  } catch (error) {
    console.error('Seeder execution anomaly:', error);
  }
}