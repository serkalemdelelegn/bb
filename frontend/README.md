### Detailed API Documentation for Commodity Distribution System

Here's a comprehensive breakdown of all the API endpoints in the system:

## Authentication API

### Login

- Endpoint: POST /api/auth
- Description: Authenticates a user and returns user information
- Request Body:

{
  "username": "trade_admin",
  "password": "password123"
}


- Response (200 OK):

{
  "user": {
    "id": "2",
    "username": "trade_admin",
    "role": "trade-bureau",
    "name": "Trade Bureau Admin"
  },
  "message": "Login successful"
}


- Response (401 Unauthorized):

{
  "error": "Invalid username or password"
}




### Validate Token

- Endpoint: GET /api/auth
- Description: Validates if the current session/token is valid
- Response (200 OK):

{
  "message": "Token is valid"
}




## Transactions API

### Get Transactions

- Endpoint: GET /api/transactions
- Description: Retrieves transactions with optional filtering
- Query Parameters:

- type: Filter by transaction type (e.g., "Distribution", "Request")
- commodity: Filter by commodity type (e.g., "Sugar", "Oil")
- status: Filter by status (e.g., "Completed", "Pending", "Approved")
- source: Filter by source location
- destination: Filter by destination location



- Response (200 OK):

{
  "transactions": [
    {
      "id": "TR-1234",
      "date": "2023-06-15",
      "type": "Distribution",
      "commodity": "Sugar",
      "quantity": "500 kg",
      "source": "Trade Bureau",
      "destination": "Cooperative #123",
      "status": "Completed"
    },
    // More transactions...
  ]
}




### Create Transaction

- Endpoint: POST /api/transactions
- Description: Creates a new transaction record
- Request Body:

{
  "type": "Distribution",
  "commodity": "Sugar",
  "quantity": "300 kg",
  "source": "Trade Bureau",
  "destination": "Cooperative #456"
}


- Response (200 OK):

{
  "transaction": {
    "id": "TR-5678",
    "date": "2023-06-16",
    "type": "Distribution",
    "commodity": "Sugar",
    "quantity": "300 kg",
    "source": "Trade Bureau",
    "destination": "Cooperative #456",
    "status": "Completed"
  },
  "message": "Transaction created successfully"
}


- Response (400 Bad Request):

{
  "error": "Missing required fields"
}




## Requests API

### Get Requests

- Endpoint: GET /api/requests
- Description: Retrieves commodity requests with optional filtering
- Query Parameters:

- status: Filter by status (e.g., "Pending", "Approved", "Rejected")
- commodity: Filter by commodity type (e.g., "Sugar", "Oil")
- requestedBy: Filter by requesting entity



- Response (200 OK):

{
  "requests": [
    {
      "id": "REQ-1001",
      "date": "2023-06-15",
      "commodity": "Sugar",
      "quantity": "1000 kg",
      "requestedBy": "Cooperative #123",
      "status": "Pending",
      "notes": "Monthly allocation request"
    },
    // More requests...
  ]
}




### Create Request

- Endpoint: POST /api/requests
- Description: Creates a new commodity request
- Request Body:

{
  "commodity": "Sugar",
  "quantity": "800 kg",
  "requestedBy": "Cooperative #123",
  "notes": "Emergency request due to shortage"
}


- Response (200 OK):

{
  "request": {
    "id": "REQ-2001",
    "date": "2023-06-16",
    "commodity": "Sugar",
    "quantity": "800 kg",
    "requestedBy": "Cooperative #123",
    "status": "Pending",
    "notes": "Emergency request due to shortage"
  },
  "message": "Request created successfully"
}


- Response (400 Bad Request):

{
  "error": "Missing required fields"
}




### Get Request by ID

- Endpoint: GET /api/requests/{id}
- Description: Retrieves a specific request by ID
- Path Parameters:

- id: The request ID (e.g., "REQ-1001")



- Response (200 OK):

{
  "request": {
    "id": "REQ-1001",
    "date": "2023-06-15",
    "commodity": "Sugar",
    "quantity": "1000 kg",
    "requestedBy": "Cooperative #123",
    "status": "Pending",
    "notes": "Monthly allocation request"
  }
}


- Response (404 Not Found):

{
  "error": "Request not found"
}




### Update Request Status

- Endpoint: PATCH /api/requests/{id}
- Description: Updates the status of a specific request
- Path Parameters:

- id: The request ID (e.g., "REQ-1001")



- Request Body:

{
  "status": "Approved"
}


- Response (200 OK):

{
  "request": {
    "id": "REQ-1001",
    "date": "2023-06-15",
    "commodity": "Sugar",
    "quantity": "1000 kg",
    "requestedBy": "Cooperative #123",
    "status": "Approved",
    "notes": "Monthly allocation request"
  },
  "message": "Request updated successfully"
}


- Response (400 Bad Request):

{
  "error": "Invalid status"
}


- Response (404 Not Found):

{
  "error": "Request not found"
}




## Citizens API

### Get Citizens

- Endpoint: GET /api/citizens
- Description: Retrieves citizens with optional filtering
- Query Parameters:

- verified: Filter by verification status ("true" or "false")
- kebele: Filter by kebele number
- search: Search by name, address, or ID



- Response (200 OK):

{
  "citizens": [
    {
      "id": "CIT-1001",
      "name": "Abebe Kebede",
      "address": "Woreda 3, Kebele 05, House 123",
      "familySize": 4,
      "verified": true,
      "lastDistribution": "2023-06-10",
      "sugarAllocation": "4 kg",
      "oilAllocation": "2 L"
    },
    // More citizens...
  ]
}




### Register Citizen

- Endpoint: POST /api/citizens
- Description: Registers a new citizen
- Request Body:

{
  "name": "Yonas Tadesse",
  "address": "Woreda 3, Kebele 08, House 505",
  "familySize": 5,
  "verified": false
}


- Response (200 OK):

{
  "citizen": {
    "id": "CIT-2001",
    "name": "Yonas Tadesse",
    "address": "Woreda 3, Kebele 08, House 505",
    "familySize": 5,
    "verified": false,
    "lastDistribution": "N/A",
    "sugarAllocation": "5 kg",
    "oilAllocation": "2.5 L"
  },
  "message": "Citizen created successfully"
}


- Response (400 Bad Request):

{
  "error": "Missing required fields"
}




### Get Citizen by ID

- Endpoint: GET /api/citizens/{id}
- Description: Retrieves a specific citizen by ID
- Path Parameters:

- id: The citizen ID (e.g., "CIT-1001")



- Response (200 OK):

{
  "citizen": {
    "id": "CIT-1001",
    "name": "Abebe Kebede",
    "address": "Woreda 3, Kebele 05, House 123",
    "familySize": 4,
    "verified": true,
    "lastDistribution": "2023-06-10",
    "sugarAllocation": "4 kg",
    "oilAllocation": "2 L"
  }
}


- Response (404 Not Found):

{
  "error": "Citizen not found"
}




### Update Citizen

- Endpoint: PATCH /api/citizens/{id}
- Description: Updates a citizen's verification status or distribution date
- Path Parameters:

- id: The citizen ID (e.g., "CIT-1001")



- Request Body:

{
  "verified": true,
  "lastDistribution": "2023-06-16"
}


- Response (200 OK):

{
  "citizen": {
    "id": "CIT-1001",
    "name": "Abebe Kebede",
    "address": "Woreda 3, Kebele 05, House 123",
    "familySize": 4,
    "verified": true,
    "lastDistribution": "2023-06-16",
    "sugarAllocation": "4 kg",
    "oilAllocation": "2 L"
  },
  "message": "Citizen updated successfully"
}


- Response (404 Not Found):

{
  "error": "Citizen not found"
}




## Inventory API

### Get Inventory

- Endpoint: GET /api/inventory
- Description: Retrieves inventory items with optional filtering and summary statistics
- Query Parameters:

- commodity: Filter by commodity type (e.g., "Sugar", "Oil")
- location: Filter by location
- status: Filter by status (e.g., "In Stock", "Low Stock")



- Response (200 OK):

{
  "inventory": [
    {
      "id": "INV-1001",
      "commodity": "Sugar",
      "quantity": "2500 kg",
      "location": "Main Warehouse",
      "lastUpdated": "2023-06-15",
      "status": "In Stock",
      "expiryDate": "2024-06-15"
    },
    // More inventory items...
  ],
  "summary": {
    "totalSugar": "3200 kg",
    "totalOil": "2200 L",
    "lowStockItems": 2,
    "expiringItems": 0
  }
}




### Add Inventory

- Endpoint: POST /api/inventory
- Description: Adds a new inventory item
- Request Body:

{
  "commodity": "Sugar",
  "quantity": "1000 kg",
  "location": "Main Warehouse",
  "expiryDate": "2024-06-16"
}


- Response (200 OK):

{
  "inventory": {
    "id": "INV-2001",
    "commodity": "Sugar",
    "quantity": "1000 kg",
    "location": "Main Warehouse",
    "lastUpdated": "2023-06-16",
    "status": "In Stock",
    "expiryDate": "2024-06-16"
  },
  "message": "Inventory added successfully"
}


- Response (400 Bad Request):

{
  "error": "Missing required fields"
}




### Transfer Inventory

- Endpoint: POST /api/inventory/transfer
- Description: Transfers inventory from one location to another
- Request Body:

{
  "fromLocation": "Main Warehouse",
  "toLocation": "Cooperative #123",
  "commodity": "Sugar",
  "quantity": "500 kg"
}


- Response (200 OK):

{
  "message": "Inventory transfer successful",
  "source": {
    "id": "INV-1001",
    "commodity": "Sugar",
    "quantity": "2000 kg",
    "location": "Main Warehouse",
    "lastUpdated": "2023-06-16",
    "status": "In Stock",
    "expiryDate": "2024-06-15"
  },
  "destination": {
    "id": "INV-1003",
    "commodity": "Sugar",
    "quantity": "1000 kg",
    "location": "Cooperative #123",
    "lastUpdated": "2023-06-16",
    "status": "In Stock",
    "expiryDate": "2024-06-15"
  }
}


- Response (400 Bad Request):

{
  "error": "Insufficient quantity in source location"
}


- Response (404 Not Found):

{
  "error": "Source inventory not found"
}




## Dashboard API

### Get Dashboard Data

- Endpoint: GET /api/dashboard
- Description: Retrieves aggregated data for dashboard visualizations
- Response (200 OK):

{
  "data": {
    "totalDistributed": {
      "sugar": "12,345 kg",
      "oil": "8,765 L",
      "change": "+20.1%"
    },
    "beneficiaries": {
      "total": 4231,
      "change": "+10.5%"
    },
    "pendingRequests": {
      "total": 24,
      "change": "-5%"
    },
    "currentStock": {
      "sugar": "3,200 kg",
      "oil": "2,200 L",
      "change": "+12%"
    },
    "distributionByMonth": [
      { "month": "Jan", "sugar": 1200, "oil": 900 },
      { "month": "Feb", "sugar": 1900, "oil": 1200 },
      { "month": "Mar", "sugar": 1500, "oil": 1300 },
      { "month": "Apr", "sugar": 1700, "oil": 1400 },
      { "month": "May", "sugar": 2100, "oil": 1800 },
      { "month": "Jun", "sugar": 1800, "oil": 1600 }
    ],
    "distributionByType": {
      "sugar": 65,
      "oil": 35
    },
    "recentActivity": [
      {
        "type": "received",
        "description": "Received 500kg of sugar from Trade Bureau",
        "timestamp": "2 hours ago"
      },
      {
        "type": "distributed",
        "description": "Distributed 200kg of oil to Shop #123",
        "timestamp": "5 hours ago"
      },
      {
        "type": "approved",
        "description": "Approved request from Cooperative #456",
        "timestamp": "Yesterday"
      }
    ],
    "distributionTrend": [
      { "day": "Mon", "amount": 65 },
      { "day": "Tue", "amount": 59 },
      { "day": "Wed", "amount": 80 },
      { "day": "Thu", "amount": 81 },
      { "day": "Fri", "amount": 56 },
      { "day": "Sat", "amount": 55 },
      { "day": "Sun", "amount": 40 }
    ],
    "performanceMetrics": {
      "distributionEfficiency": "92%",
      "coverageRate": "87%",
      "stockAccuracy": "99%"
    }
  }
}




## Error Handling

All APIs follow a consistent error handling pattern:

1. 400 Bad Request: When required parameters are missing or invalid
2. 401 Unauthorized: When authentication fails
3. 404 Not Found: When a requested resource doesn't exist
4. 500 Internal Server Error: For unexpected server errors


Error responses always include an error field with a descriptive message.

## Authentication and Authorization

In a production environment, these APIs would require proper authentication and authorization:

1. Authentication: Using JWT tokens or session cookies
2. Authorization: Role-based access control based on the user's role:

1. Sub-City Office
2. Trade Bureau
3. Woreda Office
4. Retailer Cooperative
5. Retailer Cooperative Shop





Each role would have different permissions for accessing and modifying data through these APIs.

## Implementation Notes
- The current implementation uses in-memory data structures for demonstration purposes
- In a production environment, these would be replaced with a proper database
- Additional validation and error handling would be implemented
- Proper authentication middleware would be added to secure the APIs