const Router = require('koa-better-router')
const router = Router().loadMethods()
const _ = require('underscore');
const fs = require('fs');

let citiesData = fs.readFileSync('data/cities.json');
let cities = JSON.parse(citiesData);

let regionsData = fs.readFileSync('data/regions.json');
let regions = JSON.parse(regionsData);

router.get('/regions', (ctx, next) => {
  let filterRegions = regions;
  if ( ctx.query.country_id != null ){
    filterRegions = _.where(regions, { country_id: parseInt(ctx.query.country_id) }); 
  }
  const result = {}
  for(let i of filterRegions) {
    result[''+i.id] = i.region
  }
  ctx.body = result;

  return next()
})

router.get('/cities', (ctx, next) => {
  let filterCities = cities;
  if (ctx.query.country_id != null || ctx.query.region_id != null) {
    var filter = {};
    if (ctx.query.country_id != null) {
      filter.country_id = parseInt(ctx.query.country_id);
    }
    if (ctx.query.region_id != null) {
      filter.region_id = parseInt(ctx.query.region_id);
    }
    filterCities  = _.where(cities, filter);
  }
  const result = {}
  for(let i of filterCities) {
    result[''+i.id] = i.city
  }  
  ctx.body = result;
  return next()
})


const api = Router({ prefix: '/api' })

// add `router`'s routes to api router
api.extend(router)

const serve = require('koa-static')
// The server
const Koa = require('koa') // Koa v2

const app = new Koa()

app.use(api.middleware())
app.use(serve('public'))
app.use(serve('../src'))

app.listen(3000, () => {
  console.log('Try out /api/regions and /api/cities')
});