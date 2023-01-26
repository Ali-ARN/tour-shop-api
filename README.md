# Tour online shop API

for starting server, do `npm i` then `npm start`

## Main CRUD operations

### get all tours
`GET localhost:3000/api/v1/tours`

**also you can use filter, sort, limit fields and pagination with queries**

filter:

`GET localhost:3000/api/v1/tours?price=1500` | this will return tours with 1500 price


sort:

`GET localhost:3000/api/v1/tours?sort=price` | this will sort tours by price (ascending) |
**for descending you must use a '-' before the field**


limit fields: 

`GET localhost:3000/api/v1/tours?fields=name,price` | include name and price, exclude others

`GET localhost:3000/api/v1/tours?fields=-name,-price` | exclude name and price, include others


pagination:

`GET localhost:3000/api/v1/tours?page=2&limit=10` | i think this is clear so no need to explain :)
