import * as dotenv from 'dotenv';
const result = dotenv.config();

if (result.error) {
    console.error('Error loading .env:', result.error);
} else {
    console.log('Parsed .env:', Object.keys(result.parsed || {}));
}

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
