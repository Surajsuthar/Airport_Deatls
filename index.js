const express = require('express')
const app = express()
const { Client } = require('pg');

require('dotenv').config()

const client = new Client({
	user: 'suraj',
	password: 'Suraj@0067',
	host: 'localhost',
	port: '5432',
	database: 'aiportDB',
});



client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
    })
    .catch((err) => console.log("error",err))


//hey

app.get('/api/:iata_code', async (req, res) => {
    const iataCode = req.params.iata_code;
    try {
      const query = `
        SELECT
          a.id AS airport_id,
          a.icao_code,
          a.iata_code,
          a.name AS airport_name,
          a.type AS airport_type,
          a.latitude_deg,
          a.longitude_deg,
          a.elevation_ft,
          c.id AS city_id,
          c.name AS city_name,
          c.country_id AS city_country_id,
          c.is_active AS city_is_active,
          c.lat AS city_lat,
          c.long AS city_long,
          co.id AS country_id,
          co.name AS country_name,
          co.country_code_two,
          co.country_code_three,
          co.mobile_code,
          co.continent_id
        FROM airport a
        JOIN city c ON a.city_id = c.id
        JOIN country co ON a.country_id = co.id
        WHERE a.iata_code = $1;
      `;
  
      const result = await client.query(query, [iataCode]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Airport not found' });
      }
  
      const row = result.rows[0];
  
      const response = {
        airport: {
          id: row.airport_id,
          icao_code: row.icao_code,
          iata_code: row.iata_code,
          name: row.airport_name,
          type: row.airport_type,
          latitude_deg: row.latitude_deg,
          longitude_deg: row.longitude_deg,
          elevation_ft: row.elevation_ft,
          address: {
            city: {
              id: row.city_id,
              name: row.city_name,
              country_id: row.city_country_id,
              is_active: row.city_is_active,
              lat: row.city_lat,
              long: row.city_long,
            },
            country: {
              id: row.country_id,
              name: row.country_name,
              country_code_two: row.country_code_two,
              country_code_three: row.country_code_three,
              mobile_code: row.mobile_code,
              continent_id: row.continent_id,
            }
          }
        }
      };
  
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

const PORT = process.env.PORT || 5050
app.listen(PORT,()=>console.log(`server is listning ${PORT}`))