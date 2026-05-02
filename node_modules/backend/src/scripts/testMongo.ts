import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is missing in backend/.env');
  process.exit(1);
}

if (uri.includes('<db_password>')) {
  console.error('MONGODB_URI still contains <db_password>. Replace it with your real Atlas password.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error('MongoDB ping failed:', error);
  process.exit(1);
});
