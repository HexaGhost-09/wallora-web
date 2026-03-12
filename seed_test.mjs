import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_wallpapers (
        id VARCHAR(255) PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        download VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const data = [
      {
        "id": "car1_view",
        "category": "cars",
        "title": "Car View 1",
        "image": "https://files.catbox.moe/yz6zeb.jpg",
        "download": "https://files.catbox.moe/msnece.jpg",
        "timestamp": "2025-07-10T15:39:37Z"
      },
      {
        "id": "car2_view",
        "category": "cars",
        "title": "Car View 2",
        "image": "https://files.catbox.moe/8ei6eh.jpg",
        "download": "https://files.catbox.moe/egccrj.jpg",
        "timestamp": "2025-07-10T15:39:37Z"
      },
      {
        "id": "car3_view",
        "category": "cars",
        "title": "Car View 3",
        "image": "https://files.catbox.moe/cbnq49.jpg",
        "download": "https://files.catbox.moe/cvpu1z.jpg",
        "timestamp": "2025-11-14T12:00:00Z"
      }
    ];

    for (const item of data) {
      await pool.query(
        'INSERT INTO test_wallpapers (id, category, title, image, download, timestamp) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
        [item.id, item.category, item.title, item.image, item.download, item.timestamp]
      );
    }
    console.log('Inserted successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
