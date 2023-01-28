# Tour online shop API

for starting server, do `npm i` then `npm start`

## Main CRUD operations

### Get all tours

`GET localhost:3000/api/v1/tours`

**also you can use filter, sort, limit fields and pagination with queries**

_FILTER_:

`GET localhost:3000/api/v1/tours?price=1500` | this will return tours with 1500 price

_SORT_:

`GET localhost:3000/api/v1/tours?sort=price` | this will sort tours by price (ascending) |
**for descending you must use a '-' before the field**

_LIMIT FIELDS_:

`GET localhost:3000/api/v1/tours?fields=name,price` | include name and price, exclude others

`GET localhost:3000/api/v1/tours?fields=-name,-price` | exclude name and price, include others

_PAGINATION_:

`GET localhost:3000/api/v1/tours?page=2&limit=10` | i think this is clear, so no need to explain :)

### Get one tour

`GET localhost:3000/api/v1/tours/{id_paceholder}` | put your tour id in the placeholder

### Create tour

`POST localhost:3000/api/v1/tours` | send your tour object

### Update tour

`PATCH localhost:3000/api/v1/tours/{id_paceholder}` | send the updated fields (the id must be the tour that you want to update)

### Delete tour

`DELETE localhost:3000/api/v1/tours/{id_palceholder}`
