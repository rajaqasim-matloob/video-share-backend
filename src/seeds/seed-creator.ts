// import { connect, Connection } from 'mongoose';
// import { hash } from 'bcrypt';
// import { config } from 'dotenv';
// import { UserSchema } from '../users/schemas/user.schema'; // adjust path

// config(); // load .env

// async function seedCreators() {
//   const mongoUri = process.env.MONGO_URI;
//   if (!mongoUri) {
//     throw new Error('MONGO_URI is not defined in .env');
//   }

//   // Connect to Mongo
//   const connection: Connection = await connect(mongoUri);

//   const User = connection.model('User', UserSchema);

//   const creators = [
//     {
//       name: 'John Creator',
//       email: 'john.creator@example.com',
//       password: await hash('password123', 10),
//       role: 'creator',
//     },
//     {
//       name: 'Jane Creator',
//       email: 'jane.creator@example.com',
//       password: await hash('password123', 10),
//       role: 'creator',
//     },
//   ];

//   for (const creator of creators) {
//     const exists = await User.findOne({ email: creator.email });
//     if (!exists) {
//       await User.create(creator);
//       console.log(`✅ Created creator: ${creator.email}`);
//     } else {
//       console.log(`⚠️ Creator already exists: ${creator.email}`);
//     }
//   }

//   await connection.close();
//   console.log('🌱 Seeding complete.');
// }

// seedCreators().catch(err => {
//   console.error(err);
//   process.exit(1);
// });  
