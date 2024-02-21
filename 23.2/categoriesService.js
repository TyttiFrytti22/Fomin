const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

function getCategories() {
  return new Promise((resolve, reject) => {
    client.get('categories', (err, data) => {
      if (err) {
        reject(err);
      } else if (data) {
        resolve(JSON.parse(data));
      } else {
        // Запрос к базе данных для получения категорий
        const categories = await Category.find();
        
        client.set('categories', JSON.stringify(categories));
        resolve(categories);
      }
    });
  });
}

module.exports = {
  getCategories
};

const categoriesService = require('./categoriesService');

async function getAllCategories(req, res) {
  try {
    const categories = await categoriesService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения категорий' });
  }
}
