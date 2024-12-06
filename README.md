# workindia_assign

This API allows users to interact with the train management system. It includes features for booking seats, viewing train schedules, and managing data (for admin users).

- Endpoints
- Auth
- Trains
- Admin
- Booking


## Setup

### Prerequisites

- Node.js (version 16 or above)
- npm or yarn
- MySQL Database
- [Postman](https://www.postman.com/) (optional, for testing API endpoints)

### Installation

1. Clone the repository:
```bash
    git clone 
```
2. Install dependencies:

```bash
    npm install
```
3. Set up the Database
  - Create a new MySQL database.
  - Update the .env.example file with your database configuration details. Rename the file to .env once completed.

4. Start the server:
```bash
npm run dev
```
5. The server will run on http://localhost:3000 by default.
   
## Authentication

All API requests must include a valid JSON Web Token (JWT) in the Authorization header. For admin endpoints, an additional x-api-key header is required.

**Headers**

- Authorization: Bearer `<JWT_TOKEN>`
- x-api-key (admin endpoints): `<API_KEY>`

## Endpoints

### Trains

1. **Get All Trains**

**Description**: Fetch all trains between a source and destination.

**Endpoint**: `GET /trains`

**Query Parameters:**

- **source**(string) - Source Station
- **desitnation** (string) - Destination Station

**Headers**

- `Authorization: Bearer <JWT_TOKEN>`

**Response**:

````json
[
  {
    "id": 1,
    "name": "Express 101",
    "source_station": "NewDelhi",
    "destination_station": "Siwan",
    "available_seats": 50,
    "total_seats": 100,
    "createdAt": "2024-12-01T00:00:00Z",
    "updatedAt": "2024-12-01T00:00:00Z"
  }
]
````
2. **Book a Seat**
**Description**: Book a seat on a specific train.

**Endpoint**: `POST /trains/:id`

**Route Parameters:**

-`id`(integer) - Train ID

**Headers**
- `Authorization: Bearer <JWT_TOKEN>`

**Response**:
```json
[{
  "message": "Seat booked successfully",
  "seatNo": 50
}]

```
3. **Booking Details**
**Description**: Retrieve details of a specific booking.

**Endpoint**: `GET /booking/:id`

**Route Parameters:**

-`id`(integer) - Booking ID

**Headers**
- `Authorization: Bearer <JWT_TOKEN>`

**Response**:
```json
[
    {
  "id": 123,
  "user_id": 456,
  "train_id": 1,
  "seat_no": 50,
  "createdAt": "2024-12-01T00:00:00Z",
  "updatedAt": "2024-12-01T00:00:00Z"
}
]
````

## Admin

1. **Add a New Train**
   **Description**: Add a new train to the system.

**Endpoint**: `POST /admin/trains/`

**Headers**

- `Authorization: Bearer <JWT_TOKEN>`
- `x-api-key: <API_KEY>`

**Request Body**

```json
[
  {
    "name": "Express 102",
    "source_station": "NewDelhi",
    "destination_station": "Lucknow",
    "total_seats": 120
  }
]
```

**Response**:

```json
[
  {
    "message": "Train added successfully",
    "train": {
      "id": 2,
      "name": "Express 102",
      "source_station": "NewDelhi",
      "destination_station": "Lucknow",
      "available_seats": 120,
      "total_seats": 120,
      "createdAt": "2024-12-07T00:00:00Z",
      "updatedAt": "2024-12-07T00:00:00Z"
    }
  }
]
```
